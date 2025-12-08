import { GoogleGenAI } from '@google/genai';
import { PatientProfile } from '../types';

// Initialize Gemini Client
// Note: In a production environment, API calls should go through a backend to protect the API key.
// For this local/demo setup, we use the key directly from the environment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("GEMINI_API_KEY not found in environment variables.");
}

const SUMMARY_SYSTEM_PROMPT = `You are an expert respiratory consultant assisting a physician. 
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

export const generateClinicalSummary = async (patient: PatientProfile, onChunk: (chunk: string) => void): Promise<void> => {
    // HYBRID STRATEGY:
    // In Development: Use direct client-side SDK (requires VITE_GEMINI_API_KEY in .env)
    // In Production: Use secure server-side API (hides API key)

    if (import.meta.env.DEV) {
        // DEVELOPMENT MODE: Direct Client-Side Call
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

        if (!apiKey) {
            throw new Error("AI service not configured. Missing VITE_GEMINI_API_KEY in .env file.");
        }

        const ai = new GoogleGenAI({ apiKey });
        const patientContext = JSON.stringify(patient, null, 2);

        try {
            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'user', parts: [{ text: `Here is the patient record:\n\`\`\`json\n${patientContext}\n\`\`\`\n\nPlease generate the clinical summary.` }] }
                ],
                config: {
                    systemInstruction: SUMMARY_SYSTEM_PROMPT,
                },
            });

            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    onChunk(text);
                }
            }
        } catch (error: any) {
            console.error("Error generating summary (Client):", error);
            throw new Error(error.message || "Failed to generate summary.");
        }
    } else {
        // PRODUCTION MODE: Secure Server-Side Call
        try {
            const response = await fetch('/api/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to generate summary');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response stream');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                onChunk(chunk);
            }
        } catch (error: any) {
            console.error("Error generating summary (Server):", error);
            throw new Error(error.message || "Failed to generate summary.");
        }
    }
};
