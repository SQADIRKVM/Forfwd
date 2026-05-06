import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, context } = await req.json();

    // Build a system prompt grounded in the student's dashboard data
    const systemPrompt = `You are CareerX AI, a world-class career counselor with deep knowledge of universities, career paths, job markets, and skill development.

You are currently helping a specific student who has already received their personalized CareerX dashboard. You have full context of their profile and recommendations below.

STUDENT CONTEXT:
${context ? JSON.stringify(context, null, 2) : 'No context provided yet.'}

RULES:
1. Be warm, encouraging, and specific. Never give generic advice.
2. Always refer back to their specific recommended career paths, universities, and skills when relevant.
3. If asked about jobs/salaries, give real-world figures with caveats about variation.
4. If asked something outside your context, acknowledge it and give your best AI-powered answer.
5. Keep responses concise (2-4 paragraphs max) unless the student asks for detail.
6. Use markdown formatting for lists when helpful.`;

    const result = streamText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
