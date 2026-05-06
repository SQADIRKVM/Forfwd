/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * CareerX Evaluation Harness v2
 * 
 * Extended to 12 profiles with 90-second cooldowns to avoid Gemini free-tier rate limits.
 * Target: n ≥ 10 successful completions for publishable aggregate statistics.
 */

export {};

const BASE_URL = 'http://localhost:3000';

interface TestProfile {
    id: string;
    label: string;
    studentType: string;
    userName: string;
    location: string;
    currency: string;
    answers: Record<string, string>;
}

const TEST_PROFILES: TestProfile[] = [
    {
        id: 'P1', label: 'CS Student (India)',
        studentType: "Bachelor's degree / B.Tech student", userName: 'Arjun',
        location: 'Kerala, India', currency: 'INR',
        answers: { '_role': "Bachelor's degree / B.Tech student", '_currentEducationLevel': "Bachelor's degree / B.Tech student", 'What subjects excite you?': 'AI, Web Development, Data Science', 'Dream role?': 'AI Engineer at a top tech company', 'Open to abroad?': 'Yes', 'Key strengths?': 'Problem Solving, Coding, Mathematics' }
    },
    {
        id: 'P2', label: 'HR Professional (USA)',
        studentType: 'Working Professional - Human Resources', userName: 'Sarah',
        location: 'New York, USA', currency: 'USD',
        answers: { '_role': 'Working Professional - Human Resources', '_currentEducationLevel': "Master's degree", 'Current role?': 'HR Manager at a mid-size company', 'Target role?': 'CHRO', 'Years experience?': '7', 'Skills to develop?': 'People Analytics, Strategic HR, Leadership' }
    },
    {
        id: 'P3', label: 'Career Switcher (UK)',
        studentType: 'Career Switcher - Medicine to Tech', userName: 'James',
        location: 'London, UK', currency: 'GBP',
        answers: { '_role': 'Career Switcher', '_currentEducationLevel': 'Medical degree (MBBS)', 'Current field?': 'General Medicine / NHS Doctor', 'Target role?': 'Health-Tech Product Manager', 'Tech skills?': 'Basic Python, some data analysis' }
    },
    {
        id: 'P4', label: 'Startup Founder (India)',
        studentType: 'Founder / Entrepreneur', userName: 'Priya',
        location: 'Bangalore, India', currency: 'INR',
        answers: { '_role': 'Founder / Entrepreneur', '_currentEducationLevel': "Bachelor's degree", 'Startup stage?': 'Pre-seed, building MVP', 'Industry?': 'EdTech - Online learning platform', 'Needs?': 'Funding, Technical Co-founder, Go-to-market strategy' }
    },
    {
        id: 'P5', label: 'High School Student (UAE)',
        studentType: 'High School Student (Plus Two)', userName: 'Ahmed',
        location: 'Dubai, UAE', currency: 'AED',
        answers: { '_role': 'High School Student', '_currentEducationLevel': 'High School / Plus Two', 'Favourite subjects?': 'Physics, Mathematics, Computer Science', 'Dream career?': 'Aerospace Engineer or Robotics', 'Study abroad?': 'Yes, USA or Germany', 'Grade average?': '92%' }
    },
    {
        id: 'P6', label: 'MBA Student (Singapore)',
        studentType: 'MBA Student', userName: 'Wei Lin',
        location: 'Singapore', currency: 'SGD',
        answers: { '_role': 'MBA Student', '_currentEducationLevel': "Master's degree (MBA)", 'Specialization?': 'Finance and Strategy', 'Target industry?': 'Consulting or Investment Banking', 'Post-MBA goal?': 'Management Consultant at McKinsey or BCG' }
    },
    {
        id: 'P7', label: 'Nursing Professional (Australia)',
        studentType: 'Healthcare Professional - Nursing', userName: 'Emily',
        location: 'Sydney, Australia', currency: 'AUD',
        answers: { '_role': 'Healthcare Professional', '_currentEducationLevel': "Bachelor of Nursing", 'Current role?': 'Registered Nurse in ICU', 'Career goal?': 'Nurse Practitioner or Healthcare Administration', 'Years experience?': '5', 'Open to further study?': 'Yes' }
    },
    {
        id: 'P8', label: 'Law Student (India)',
        studentType: 'Law Student (LLB)', userName: 'Rohan',
        location: 'Delhi, India', currency: 'INR',
        answers: { '_role': 'Law Student', '_currentEducationLevel': 'LLB', 'Area of interest?': 'Corporate Law, Intellectual Property', 'Target?': 'Senior Associate at a top law firm', 'Bar exam?': 'Planning to appear for AIBE' }
    },
    {
        id: 'P9', label: 'Graphic Designer (Canada)',
        studentType: 'Creative Professional - Design', userName: 'Maya',
        location: 'Toronto, Canada', currency: 'CAD',
        answers: { '_role': 'Creative Professional', '_currentEducationLevel': 'Diploma in Graphic Design', 'Current work?': 'Freelance graphic designer', 'Goal?': 'UX/UI Design Lead at a tech company', 'Portfolio?': 'Yes, Behance and Dribbble', 'Skills?': 'Figma, Illustrator, Photoshop' }
    },
    {
        id: 'P10', label: 'Data Analyst (Germany)',
        studentType: 'Working Professional - Data Analytics', userName: 'Klaus',
        location: 'Berlin, Germany', currency: 'EUR',
        answers: { '_role': 'Data Analyst', '_currentEducationLevel': "Master's in Statistics", 'Current role?': 'Data Analyst at a fintech startup', 'Target?': 'Lead Data Scientist or ML Engineer', 'Skills?': 'Python, SQL, Tableau, basic ML', 'Years experience?': '3' }
    },
    {
        id: 'P11', label: 'Teacher (Nigeria)',
        studentType: 'Education Professional', userName: 'Chioma',
        location: 'Lagos, Nigeria', currency: 'NGN',
        answers: { '_role': 'Teacher', '_currentEducationLevel': "Bachelor's in Education", 'Subjects?': 'Mathematics and Physics', 'Goal?': 'Education Technology Specialist or School Administrator', 'Open to online study?': 'Yes' }
    },
    {
        id: 'P12', label: 'Mechanical Engineer (Japan)',
        studentType: 'Engineering Professional', userName: 'Takeshi',
        location: 'Tokyo, Japan', currency: 'JPY',
        answers: { '_role': 'Mechanical Engineer', '_currentEducationLevel': "Master's in Mechanical Engineering", 'Current role?': 'R&D Engineer at an automotive company', 'Interest?': 'EV technology and autonomous vehicles', 'Goal?': 'Technical Director or CTO at an EV startup' }
    }
];

interface EvalResult {
    profileId: string;
    profileLabel: string;
    dashboardTimeMs: number;
    sourcesUsed: number;
    queriesRun: number;
    careerPathwayCount: number;
    universityCount: number;
    jobCount: number;
    certificationCount: number;
    scholarshipCount: number;
    // Schema completeness (formal definition)
    requiredFieldsPopulated: number;
    requiredFieldsTotal: number;
    optionalFieldsPopulated: number;
    optionalFieldsTotal: number;
    schemaCompleteness: number;
    hasSkillGap: boolean;
    hasSocialReviews: boolean;
    success: boolean;
    error?: string;
}

/**
 * Schema Completeness Metric (formally defined):
 * 
 * Completeness = (N_populated / N_total) × 100
 * 
 * Where N_total = required fields + optional fields in the DashboardDataSchema,
 * and a field is "populated" if:
 *   - For strings: non-empty after trim
 *   - For arrays: length > 0
 *   - For objects: at least one child property populated
 */
function computeSchemaCompleteness(data: any): { populated: number; total: number; optPop: number; optTotal: number; pct: number } {
    const requiredFields = ['profileSummary', 'careerPathways', 'education', 'topUniversities', 'jobs', 'skillGaps'];
    const optionalFields = ['startupResources', 'scholarships', 'professionalBodies', 'socialReviews', 'sources'];
    
    let reqPop = 0;
    for (const f of requiredFields) {
        const val = data[f];
        if (val && (Array.isArray(val) ? val.length > 0 : (typeof val === 'object' ? Object.keys(val).length > 0 : String(val).trim().length > 0))) {
            reqPop++;
        }
    }
    
    let optPop = 0;
    for (const f of optionalFields) {
        const val = data[f];
        if (val && Array.isArray(val) && val.length > 0) {
            optPop++;
        }
    }
    
    const total = requiredFields.length + optionalFields.length;
    const populated = reqPop + optPop;
    
    return {
        populated: reqPop,
        total: requiredFields.length,
        optPop,
        optTotal: optionalFields.length,
        pct: Math.round((populated / total) * 100)
    };
}

async function evaluateProfile(profile: TestProfile): Promise<EvalResult> {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🧪 [${profile.id}] ${profile.label}`);
    console.log(`${'─'.repeat(60)}`);
    
    const startTime = Date.now();
    
    try {
        const res = await fetch(`${BASE_URL}/api/generate-dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                answers: profile.answers,
                studentType: profile.studentType,
                userName: profile.userName,
                location: profile.location,
                currency: profile.currency
            })
        });
        
        const elapsed = Date.now() - startTime;
        const result = await res.json();
        
        if (result.status !== 'complete' || !result.data) {
            console.log(`  ❌ Failed (${(elapsed/1000).toFixed(0)}s): ${result.message?.slice(0, 80) || 'Unknown'}`);
            return { profileId: profile.id, profileLabel: profile.label, dashboardTimeMs: elapsed, sourcesUsed: 0, queriesRun: 0, careerPathwayCount: 0, universityCount: 0, jobCount: 0, certificationCount: 0, scholarshipCount: 0, requiredFieldsPopulated: 0, requiredFieldsTotal: 6, optionalFieldsPopulated: 0, optionalFieldsTotal: 5, schemaCompleteness: 0, hasSkillGap: false, hasSocialReviews: false, success: false, error: result.message };
        }
        
        const d = result.data;
        const meta = result.meta || {};
        const sc = computeSchemaCompleteness(d);
        
        const evalResult: EvalResult = {
            profileId: profile.id, profileLabel: profile.label,
            dashboardTimeMs: elapsed,
            sourcesUsed: meta.sourcesUsed || 0,
            queriesRun: meta.queriesRun || 0,
            careerPathwayCount: d.careerPathways?.length || 0,
            universityCount: d.topUniversities?.length || 0,
            jobCount: d.jobs?.length || 0,
            certificationCount: d.education?.certifications?.length || 0,
            scholarshipCount: d.scholarships?.length || 0,
            requiredFieldsPopulated: sc.populated,
            requiredFieldsTotal: sc.total,
            optionalFieldsPopulated: sc.optPop,
            optionalFieldsTotal: sc.optTotal,
            schemaCompleteness: sc.pct,
            hasSkillGap: !!(d.skillGaps && d.skillGaps.roadmap?.length > 0),
            hasSocialReviews: !!(d.socialReviews && d.socialReviews.length > 0),
            success: true
        };
        
        console.log(`  ✅ ${(elapsed/1000).toFixed(1)}s | Sources: ${evalResult.sourcesUsed} | Paths: ${evalResult.careerPathwayCount} | Unis: ${evalResult.universityCount} | Jobs: ${evalResult.jobCount} | Complete: ${evalResult.schemaCompleteness}% (${sc.populated}/${sc.total} req + ${sc.optPop}/${sc.optTotal} opt)`);
        return evalResult;
        
    } catch (err: any) {
        const elapsed = Date.now() - startTime;
        console.log(`  ❌ Error (${(elapsed/1000).toFixed(0)}s): ${err.message?.slice(0, 80)}`);
        return { profileId: profile.id, profileLabel: profile.label, dashboardTimeMs: elapsed, sourcesUsed: 0, queriesRun: 0, careerPathwayCount: 0, universityCount: 0, jobCount: 0, certificationCount: 0, scholarshipCount: 0, requiredFieldsPopulated: 0, requiredFieldsTotal: 6, optionalFieldsPopulated: 0, optionalFieldsTotal: 5, schemaCompleteness: 0, hasSkillGap: false, hasSocialReviews: false, success: false, error: err.message };
    }
}

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  CareerX Evaluation v2 — 12 Profiles, 90s Cooldowns     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    
    const results: EvalResult[] = [];
    
    for (let i = 0; i < TEST_PROFILES.length; i++) {
        const result = await evaluateProfile(TEST_PROFILES[i]);
        results.push(result);
        
        if (i < TEST_PROFILES.length - 1) {
            console.log(`  ⏳ Cooling 90s (${i + 1}/${TEST_PROFILES.length} done)...`);
            await new Promise(r => setTimeout(r, 90000));
        }
    }
    
    // ── Summary ──────────────────────────────────────────────────────
    const ok = results.filter(r => r.success);
    const n = ok.length;
    const times = ok.map(r => r.dashboardTimeMs);
    const mean = times.reduce((a, b) => a + b, 0) / n;
    const median = [...times].sort((a, b) => a - b)[Math.floor(n / 2)];
    const sd = Math.sqrt(times.reduce((s, t) => s + (t - mean) ** 2, 0) / n);
    
    console.log('\n\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  FINAL EVALUATION RESULTS                ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n  Successful: ${n}/${results.length}`);
    console.log(`  Response Time: mean=${(mean/1000).toFixed(1)}s, median=${(median/1000).toFixed(1)}s, SD=${(sd/1000).toFixed(1)}s, range=[${(Math.min(...times)/1000).toFixed(1)}–${(Math.max(...times)/1000).toFixed(1)}]s`);
    console.log(`  Sources (avg): ${(ok.reduce((a, r) => a + r.sourcesUsed, 0) / n).toFixed(1)}`);
    console.log(`  Pathways (avg): ${(ok.reduce((a, r) => a + r.careerPathwayCount, 0) / n).toFixed(1)}`);
    console.log(`  Universities (avg): ${(ok.reduce((a, r) => a + r.universityCount, 0) / n).toFixed(1)}`);
    console.log(`  Jobs (avg): ${(ok.reduce((a, r) => a + r.jobCount, 0) / n).toFixed(1)}`);
    console.log(`  Schema Completeness (avg): ${(ok.reduce((a, r) => a + r.schemaCompleteness, 0) / n).toFixed(1)}%`);
    console.log(`  Required Fields (avg): ${(ok.reduce((a, r) => a + r.requiredFieldsPopulated, 0) / n).toFixed(1)}/${ok[0]?.requiredFieldsTotal || 6}`);
    
    console.log(`\n  Per-profile:`);
    console.log(`  ${'ID'.padEnd(5)} ${'Profile'.padEnd(32)} ${'Time'.padEnd(8)} ${'Src'.padEnd(5)} ${'Pth'.padEnd(5)} ${'Uni'.padEnd(5)} ${'Job'.padEnd(5)} ${'Cmp%'.padEnd(6)} Status`);
    console.log(`  ${'─'.repeat(80)}`);
    for (const r of results) {
        const t = r.success ? `${(r.dashboardTimeMs/1000).toFixed(0)}s` : '—';
        const st = r.success ? '✅' : `❌ ${(r.error || '').slice(0, 25)}`;
        console.log(`  ${r.profileId.padEnd(5)} ${r.profileLabel.padEnd(32)} ${t.padEnd(8)} ${String(r.sourcesUsed).padEnd(5)} ${String(r.careerPathwayCount).padEnd(5)} ${String(r.universityCount).padEnd(5)} ${String(r.jobCount).padEnd(5)} ${(r.schemaCompleteness+'%').padEnd(6)} ${st}`);
    }
    
    const fs = require('fs');
    const outputPath = require('path').join(__dirname, '..', 'evaluation_results_v2.json');
    fs.writeFileSync(outputPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        profiles: results,
        aggregate: {
            totalProfiles: results.length, successfulProfiles: n,
            meanResponseTimeMs: Math.round(mean), medianResponseTimeMs: Math.round(median),
            minResponseTimeMs: Math.min(...times), maxResponseTimeMs: Math.max(...times),
            stdDevMs: Math.round(sd),
            avgSourcesUsed: +(ok.reduce((a, r) => a + r.sourcesUsed, 0) / n).toFixed(1),
            avgCareerPathways: +(ok.reduce((a, r) => a + r.careerPathwayCount, 0) / n).toFixed(1),
            avgUniversities: +(ok.reduce((a, r) => a + r.universityCount, 0) / n).toFixed(1),
            avgJobMappings: +(ok.reduce((a, r) => a + r.jobCount, 0) / n).toFixed(1),
            avgSchemaCompleteness: +(ok.reduce((a, r) => a + r.schemaCompleteness, 0) / n).toFixed(1),
            avgRequiredFieldsPopulated: +(ok.reduce((a, r) => a + r.requiredFieldsPopulated, 0) / n).toFixed(1),
        }
    }, null, 2));
    
    console.log(`\n  💾 Saved: ${outputPath}\n  ✅ Done.\n`);
}

main().catch(console.error);
