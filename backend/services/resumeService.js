import pdfjsLib from 'pdfjs-dist';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.workerSrc;
pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = 
    `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`;

export async function analyzeResume(pdfBuffer, jobDescription = null) {
    try {
        // TODO: add support for larger files
        const pdf = await pdfjsLib.getDocument(new Uint8Array(pdfBuffer)).promise;

        // could probably optimize this
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + ' ';
        }

        
        const analysis = await analyzeWithGPT(fullText, jobDescription);
        return { success: true, analysis };
    } catch (error) {
        console.error('Error in analyzeResume:', error);
        return { success: false, error: error.message };
    }
}

// need to add rate limiting
async function analyzeWithGPT(text, jobDescription = null) {
    try {
        const systemPrompt = `You are an expert resume analyzer and career advisor. First analyze the resume, then if a job description is provided, directly compare the resume against it within each relevant section of your analysis. Format your response as follows:

1. TOP ROLES:
   List 3-5 roles this candidate is best suited for. If a job description is provided, indicate how well the target role aligns with these recommendations.

2. DETAILED ANALYSIS:
   - Strengths: Analyze key strengths, highlighting those that specifically match the job requirements if provided
   - Key Skills: List skills, emphasizing those that align with the job description
   - Experience Highlights: Detail relevant experience, noting which experiences directly relate to the job requirements

3. IMPROVEMENT SUGGESTIONS:
   - Formatting: Suggest formatting improvements
   - Content: Recommend content changes, especially those that would better align with the target role
   - Wording: Suggest wording improvements to better match industry/role expectations

4. RESUME RATING:
   Score out of 10, explaining the rating in context of the target role if provided`;

        const userPrompt = jobDescription
            ? `Resume: ${text}\n\nCompare this resume against the following job description:\n${jobDescription}`
            : `Resume: ${text}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: 0.5,  // Further reduced for more structured output
            max_tokens: 3000   // Increased again to ensure full response
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}