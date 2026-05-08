import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { searchSearxNG } from '@/lib/searxng';
import { fetchPageContent } from '@/lib/scraper';
import { DashboardDataSchema } from '@/lib/schemas';
import { saveReportAction } from '@/app/actions/report';
import { auth } from '@/lib/auth/server';

export const maxDuration = 120; // Allow 120s for deep multi-page research

export async function POST(req: Request) {
    try {
        const { data: session } = await auth.getSession();
        const userId = session?.user?.id;
        const { answers, studentType, userName, location, currency } = await req.json();

        // Always compute the current year server-side — never let the AI guess
        const CURRENT_YEAR = new Date().getFullYear();
        const NEXT_YEAR = CURRENT_YEAR + 1;

        // ── 1. Plan: generate 6 targeted search queries ──────────────────────────
        const searchPlan = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: DashboardDataSchema.pick({ profileSummary: true }).extend({
                searchQueries: z.array(z.string()).min(4).max(8)
            }),
            system: `You are an expert research strategist. Today's date: ${CURRENT_YEAR}.
Generate 6–8 highly targeted, diverse search queries that will collectively surface 100+ unique articles, forums, and data sources.

RULES:
1. Always use ${CURRENT_YEAR} or ${NEXT_YEAR} (NEVER years older than ${CURRENT_YEAR - 1}) in time-sensitive queries.
2. Cover multiple angles: market data, real opinions, rankings, salaries, certifications, opportunities.
3. Ensure **Full Trajectories**:
   - Include queries for the "next-level" studies (e.g. "Best MBA programs for HR in ${location}").
   - Include queries for "mid-career transition" and "senior leadership roles" in their field.
4. Include at minimum:
   - 1 query with "site:reddit.com" for community opinions
   - 1 query with "site:linkedin.com" or professional forums
   - 1 query targeting salary/income data for **entry vs senior levels**
   - 1 query targeting top programs/universities/certifications for the **next academic level**
   - 2 queries specific to the user's location: ${location || 'global'}
5. Be specific to the user's role type (${studentType}), but explore **Full Breadth** (don't stick to just one path).
6. If their goal involves starting a business: include incubator/accelerator/funding queries.
7. If they're a professional: include upskilling, career progression, industry trends.
8. **Diversity Rule**: Cover HR, Management, Public Admin, Creative, and Tech if the user's profile suggests any interest in these areas.
9. **NO DICTIONARIES OR GRAMMAR**: Avoid queries that yield general word definitions or English grammar discussions (e.g., "it is best" vs "it is the best", StackExchange grammar threads). Append "-dictionary -thesaurus" if needed.
10. **NO API REFERENCE MANUALS**: Avoid literal search queries for language syntax or programming API classes (e.g., "std::future", "std::async", "C++ promise") unless the user explicitly requested code snippets. Focus entirely on careers, real-world industry trends, job salaries, university programs, and professional skills (e.g., "M.Tech Software Engineering Cochin University", "Senior Software Developer salary Kochi").
`,
            messages: [
                {
                    role: 'user',
                    content: `User: ${userName || 'Unknown'}\nRole: ${studentType}\nLocation: ${location || 'Global'}\nCurrency: ${currency || 'USD'}\nAnswers: ${JSON.stringify(answers)}`
                }
            ]
        });

        // ── 2. Execute searches — 5 pages each, up to 6 queries in parallel ───
        const queries = searchPlan.object.searchQueries.slice(0, 6);
        console.log(`🔍 Running ${queries.length} queries × 5 pages each (target: 100+ results):`, queries);

        // Run queries with a small stagger to avoid SearXNG burst limits
        const searchResultArrays = await Promise.all(
            queries.map(async (q, i) => {
                // Stagger query starts by 2s each
                if (i > 0) await new Promise(r => setTimeout(r, i * 2000));
                return searchSearxNG(q, 5); // 5 pages per query
            })
        );

        // Flatten + deduplicate by URL + filter out irrelevant dictionary sites
        const BANNED_DOMAINS = [
            'dictionary.com', 'merriam-webster.com', 'thesaurus.com', 
            'oxfordlearnersdictionaries.com', 'cambridge.org', 'wiktionary.org',
            'collinsdictionary.com', 'definitions.net', 'vocabulary.com', 'wordsmyth.net',
            'ell.stackexchange.com', 'english.stackexchange.com', 'cppreference.com', 'stackoverflow.com'
        ];

        const seenUrls = new Set<string>();
        const flatResults = searchResultArrays
            .flat()
            .filter(r => {
                if (seenUrls.has(r.url)) return false;
                
                // Filter out banned domains
                const isBanned = BANNED_DOMAINS.some(domain => r.url.toLowerCase().includes(domain));
                if (isBanned) return false;

                seenUrls.add(r.url);
                return true;
            });

        console.log(`📊 Total unique relevant results collected: ${flatResults.length}`);

        // ── 2a. Deep RAG: Scrape top 10 most relevant results ────────────────
        const resultsToScrape = flatResults.slice(0, 10);
        console.log(`🧠 Deep RAG: Scraping full content for top ${resultsToScrape.length} results...`);

        const scrapedContents = await Promise.all(
            resultsToScrape.map(async (r) => {
                const fullText = await fetchPageContent(r.url);
                return {
                    ...r,
                    fullContent: fullText || r.content // Fallback to snippet if scraping fails
                };
            })
        );

        // Safeguard: need at least 5 results to avoid hallucinated dashboard
        if (flatResults.length < 5) {
            return Response.json({
                status: 'error',
                message: 'Insufficient live data. SearXNG may be rate-limited or offline.'
            }, { status: 429 });
        }

        // Feed top sources to AI (Deep contents + other snippets)
        const topSources = [
            ...scrapedContents,
            ...flatResults.slice(10, 60) // Add 50 more snippets for breadth
        ];

        // ── 3. Synthesize personalized dashboard ────────────────────────────────
        const dashboard = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: DashboardDataSchema,
            system: `You are a world-class Career Counselor & Educational Consultant. Today is ${CURRENT_YEAR}.
Generate a detailed, hyper-personalized career dashboard based on the user's profile and the research data below.

CRITICAL RULES:
1. CURRENT YEAR: Use ONLY ${CURRENT_YEAR}/${NEXT_YEAR} data. Do NOT reference anything before ${CURRENT_YEAR - 1}.
2. CURRENCY & LOCATION: Convert ALL salary/fee data to ${currency || 'USD'}. Be specific to ${location}.
3. SPECIFIC PROGRAMS: Name real programs with actual providers (e.g. "AWS Solutions Architect – Associate" not "cloud cert").
4. ROADMAP: Fill skillGaps.roadmap with Year 1, Year 2, Year 3, Year 4, Year 5 — specific and actionable.
5. LOCAL UNIVERSITIES: Focus on institutions in/near ${location}. Include real fees and rankings.
6. **FULL CAREER PATHS**: For every career pathway, explain the journey from **Entry Level** (Junior) all the way to **C-Suite/Executive/Partner** (Senior). Don't just show one role.
7. **FULL STUDY PATHS**: Provide a complete educational chain. If they have a Bachelor's, show the Master's AND the specialized certifications needed to reach the peak of that career.
8. **NO LIMITS**: If the user is interested in HR, Management, or Social Sciences, provide full detail for those paths. Do not bias towards tech.
9. **MATCH SCORE ALGORITHM**: For each career pathway, you MUST calculate the \`matchPercentage\` using the following Weighted Alignment Formula:
   Score = (0.4 * Skill_Match) + (0.3 * Market_Demand) + (0.3 * User_Preference)
   - Skill_Match (0-100): How well the user's background (education/role) aligns with this path's requirements.
   - Market_Demand (0-100): Current volume of job openings and growth trends surfaced in the scraped research data.
   - User_Preference (0-100): Alignment with user's specific answers, locations, and dream roles.
   This ensures that the score is a reproducible technical assessment, not a generic guess.

EDUCATION LEVEL RULE (VERY IMPORTANT):
- The user's CURRENT education level is stored in answers._currentEducationLevel.
- You MUST recommend the NEXT level up, NEVER the same level they already have.
- Examples:
  * "Bachelor's degree / B.Tech student" → recommend M.Tech, MS, MBA, PG Diplomas, Certifications (NOT B.Tech programs)
  * "Master's degree student" → recommend PhD, Executive programs, Professional certs
  * "High school student" → recommend B.Tech, BSc, BA, Diploma programs
  * "Professional certificate holder" → recommend Bachelor's or advanced certs
- In topUniversities: list institutions offering the NEXT-LEVEL programs for this person, not their current level.
- In education.degrees: only list degree programs ABOVE their current qualification.

UNIVERSITY vs COLLEGE RULE:
- Do NOT list affiliated/regional colleges (e.g. "Amal College") in the \`topUniversities\` array unless they have full University status.
- Only list actual Universities, Institutes of National Importance (NITs, IITs), or recognized autonomous universities.
- If you mention a local college in a reasoning field, call it a "college" not a "university".

ANSWER FORMAT & NO-ID RULE:
- The answers object keys are the actual question titles. Values are human-readable labels.
- CRITICAL: Sometimes legacy answers contain internal IDs like "startup3", "build2", or "tech_founder". 
- YOU MUST NEVER output these raw IDs in the generated text. Always translate them into natural English (e.g. "building solutions", "founding a startup") in your reasoning/descriptions.

PERSONA-SPECIFIC RULES for Career Pathways (inclusive of all domains):
- Faculty/Academic → research grants, international conferences, admin leadership, higher teaching roles
- Founder/Management → funding rounds, market size, MBA/Leadership certs, board of directors path
- Healthcare → specialization tracks, hospital rankings, board certifications (populate professionalBodies)
- HR/Ops → Talent acquisition strategy, Org development, HR Analytics, CHRO trajectory
- Creative → portfolio platforms, client rates, agency, freelance routes
- Parent → child's university shortlist, admission strategy, scholarships (populate scholarships)
- Student → internships, first job outcomes, then grad school options (populate scholarships)
- Legal → bar exams, LLM programs, in-house vs firm routes (populate professionalBodies)

JOB PORTAL LINKS: For each job in the jobs array, generate pre-filled jobPortalLinks with search URLs (aim for 4-5 relevant ones per role):
- LinkedIn: https://www.linkedin.com/jobs/search/?keywords=[ROLE]&location=[LOCATION]
- Naukri: https://www.naukri.com/[role-keywords]-jobs-in-[city]
- Indeed: https://in.indeed.com/jobs?q=[ROLE]&l=[LOCATION]
- Glassdoor: https://www.glassdoor.com/Job/jobs.htm?sc.keyword=[ROLE]&locT=C&locId=[CITY_ID] (use a generic search URL if city ID unknown)
- Wellfound (Startups): https://wellfound.com/role/[ROLE-SLUG]
- Himalayas (Remote): https://himalayas.app/jobs/[ROLE-SLUG]
- Levels.fyi (Tech): https://www.levels.fyi/jobs/title/[ROLE-SLUG]

COURSE LINKS: For certifications, use real URLs:
- Coursera: https://www.coursera.org/search?query=[CERT NAME]
- Udemy: https://www.udemy.com/courses/search/?q=[CERT NAME]
- Google: https://grow.google/certificates/

SOURCE CITATIONS: Populate sources[] with real URLs from the research data below. Reference their ids in careerPathways[].sourceIds.

LIVE RESEARCH DATA (${flatResults.length} sources, ${CURRENT_YEAR}):
${topSources.map((r, i) => `[${i + 1}] ${r.title}\n   URL: ${r.url}\n   ${(r as unknown as Record<string, unknown>).fullContent ? `FULL CONTENT (SCALED): ${String((r as unknown as Record<string, unknown>).fullContent).slice(0, 8000)}` : `SNIPPET: ${r.content?.slice(0, 500)}`}`).join('\n\n')}
`,
            messages: [
                {
                    role: 'user',
                    content: `Generate dashboard for:\nName: ${userName}\nRole: ${studentType}\nLocation: ${location}\nCurrency: ${currency}\nAnswers: ${JSON.stringify(answers)}`
                }
            ]
        });

        // ── 4. Save to Neon (Permanent Storage) ─────────────────────────────
        if (userId) {
            try {
                await saveReportAction(dashboard.object);
                console.log('✅ Report saved to Neon for user:', userId);
            } catch (saveError) {
                console.error('❌ Failed to save to Neon:', saveError);
            }
        }

        return Response.json({
            status: 'complete',
            data: dashboard.object,
            meta: {
                sourcesUsed: topSources.length,
                queriesRun: queries.length,
                year: CURRENT_YEAR
            }
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        return Response.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
