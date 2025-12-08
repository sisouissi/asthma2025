
import { GoogleGenAI } from '@google/genai';
import type { PatientProfile } from '../types';

export const config = {
    runtime: 'edge',
};

// Initialize Gemini
let ai: GoogleGenAI | null = null;
if (typeof window === 'undefined') {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    } else {
        console.error("API_KEY/GEMINI_API_KEY not found.");
    }
}

const SYSTEM_PROMPT = `You are an expert respiratory consultant assisting a physician. 
Your task is to review the provided patient data (including consultations, medications, and risk factors) and generate a comprehensive but concise clinical summary.

The summary should include:
1. **Patient Identification**: Name, Age, significant history.
2. **Current Asthma Status**: GINA Step, control level (ACT/ACQ scores), exacerbation history.
3. **Phenotype/Diagnosis**: Type 2 status, confirmed allergies, comorbidities.
4. **Current Management**: Medications, adherence issues, technique.
5. **Recommendations**: Suggested next steps based on GINA 2025 guidelines.

Format the output in clear **Markdown**. Use bullet points and bold text for readability.
Do NOT invent information. If data is missing (e.g., no spirometry), mention that it is not recorded.
`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    if (!ai) {
        return new Response(JSON.stringify({ error: "AI service not configured." }), { status: 500 });
    }

    try {
        const { patient } = await req.json() as { patient: PatientProfile };

        if (!patient) {
            return new Response('Patient data is required.', { status: 400 });
        }

        // Convert patient object to a readable string for the AI
        const patientContext = JSON.stringify(patient, null, 2);

        const stream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: `Here is the patient record:\n\`\`\`json\n${patientContext}\n\`\`\`\n\nPlease generate the clinical summary.` }] }
            ],
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });

        const responseStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                    }
                }
                controller.close();
            }
        });

        return new Response(responseStream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error: any) {
        console.error('Error generating summary:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
