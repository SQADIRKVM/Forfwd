import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

/**
 * Ablation endpoint: LLM-only generation WITHOUT any web retrieval.
 * Used exclusively for the research paper's ablation study.
 * This lets us measure what the LLM produces from training data alone.
 */

const AblationSchema = z.object({
    profileSummary: z.string(),
    careerPathways: z.array(z.object({
        title: z.string(),
        reasoning: z.string(),
        matchPercentage: z.number().min(0).max(100),
        salaryRange: z.string(),
        marketDemand: z.string(),
        requiredSkills: z.array(z.string()),
    })),
    topUniversities: z.array(z.object({
        name: z.string(),
        location: z.string(),
        averageFees: z.string(),
        topPrograms: z.array(z.string()),
    })),
    jobs: z.array(z.object({
        role: z.string(),
        entrySalary: z.string(),
        growthPath: z.string(),
        skillsRequired: z.array(z.string()),
    })),
    education: z.object({
        certifications: z.array(z.object({
            name: z.string(),
            provider: z.string(),
            relevance: z.string(),
        })),
    }),
    sources: z.array(z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
    })).optional(),
});

export async function POST(req: Request) {
    try {
        const { answers, studentType, userName, location, currency } = await req.json();
        const CURRENT_YEAR = new Date().getFullYear();

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: AblationSchema,
            system: `You are a career counselor. Generate career recommendations based ONLY on your training knowledge. Do NOT make up URLs or sources. Today is ${CURRENT_YEAR}. Location: ${location}. Currency: ${currency}.`,
            messages: [{
                role: 'user',
                content: `Generate career dashboard for:\nName: ${userName}\nRole: ${studentType}\nLocation: ${location}\nCurrency: ${currency}\nAnswers: ${JSON.stringify(answers)}`
            }]
        });

        return Response.json({
            status: 'complete',
            data: result.object,
            meta: { sourcesUsed: 0, queriesRun: 0, mode: 'llm-only' }
        });
    } catch (error) {
        console.error('Ablation LLM-Only Error:', error);
        return Response.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
