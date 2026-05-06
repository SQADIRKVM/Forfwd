import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the schema for a generated question
const GeneratedQuestionSchema = z.object({
    id: z.string(),
    section: z.enum(['academic', 'interests', 'skills', 'personality', 'goals', 'constraints']),
    text: z.string(),
    type: z.enum(['multi_select', 'yes_no', 'rating', 'slider', 'text']),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    allowSkip: z.boolean(),
    helpText: z.string().optional()
});

const QuestionSetSchema = z.object({
    questions: z.array(GeneratedQuestionSchema)
});

export async function POST(req: Request) {
    try {
        const { studentType, userName } = await req.json();

        const result = await generateObject({
            model: google('gemini-3.1-flash-lite-preview'), // Fast model for interactivity
                schema: QuestionSetSchema,
            system: `You are an expert Career Counselor AI. 
      Generate 5-7 highly relevant, probing questions to analyze a student's career potential.
      
      The student is: ${userName || 'Student'} (${studentType} level).
      
      RULES:
      1. **Be Personal**: Use their name (${userName}) in at least 2 questions to make it feel human.
      2. **Be Adaptive**: If they look like a creative person, ask about design/art. If technical, ask about engineering. If business-oriented, ask about management/HR. If social-focused, ask about psychology/sociology.
      3. **Diverse Types**: Use a mix of 'multi_select', 'rating' (1-5), 'yes_no', and 'slider' (e.g. for confidence/marks).
      4. **Outcome Focus**: Ask questions that help determine their best career fit, whether in tech, management, or social sciences.
      5. **Full Trajectory**: Ask at least one question about their long-term dream role (e.g., Lead, Director, Founder).
      `,
            messages: [
                { role: 'user', content: `Generate questions for ${userName}, a ${studentType} student.` }
            ]
        });

        return Response.json({ success: true, data: result.object.questions });

    } catch (error) {
        console.error("Question Generation Error:", error);
        return Response.json({ success: false, error: error instanceof Error ? error.message : 'Failed to generate questions' }, { status: 500 });
    }
}
