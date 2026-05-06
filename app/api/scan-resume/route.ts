import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow enough time for analysis

const AtsResultSchema = z.object({
    matchScore: z.number().describe("Percentage score 0-100 indicating how well the resume matches the target role"),
    missingKeywords: z.array(z.string()).describe("Crucial ATS keywords missing from the resume for this role"),
    feedback: z.string().describe("1-2 short, punchy sentences of actionable advice to improve the resume for this specific role")
});

export async function POST(req: Request) {
    try {
        const { resume, jobRole } = await req.json();

        if (!resume || !jobRole) {
            return NextResponse.json({ error: 'Missing resume or job role' }, { status: 400 });
        }

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: AtsResultSchema,
            system: `You are an expert ATS (Applicant Tracking System) algorithm used by top tech companies and recruiters.
Your job is to strictly evaluate a candidate's given resume text against the target job role they selected.

CRITICAL RULES:
1. Be brutally honest. If the resume is just a few generic lines, the matchScore should be very low (e.g., 10-30%).
2. Match Score: A number out of 100 based on keyword density, relevant experience, and formatting.
3. Missing Keywords: Identify up to 6 specific hard skills, tools, or industry terms expected for "${jobRole}" that are completely missing from the resume.
4. Feedback: Keep it extremely concise and actionable. Tell them exactly what to fix.`,
            messages: [
                {
                    role: 'user',
                    content: `Target Role: ${jobRole}\n\nResume Text to Scan:\n${resume}`
                }
            ]
        });

        return NextResponse.json(result.object);

    } catch (error) {
        console.error('ATS Scan Error:', error);
        return NextResponse.json({ error: 'Failed to scan resume' }, { status: 500 });
    }
}
