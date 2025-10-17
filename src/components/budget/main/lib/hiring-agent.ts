import { z } from "zod";
import { generateObject } from "./bedrock";
import { COMPETENCIES_DATABASE } from "@/constants/competencies";

/**
 * Job Analysis Schema - Output from the hiring agent
 */
export const jobAnalysisSchema = z.object({
  role: z.string().describe("Job title/role extracted from the description"),
  level: z
    .enum(["Intern", "Junior", "Mid-Level", "Senior", "Staff", "Principal", "Lead"])
    .describe("Experience level required for the role"),
  company: z
    .string()
    .optional()
    .describe("Company name if mentioned in the job description"),
  extractedSkills: z
    .array(z.string())
    .describe("List of technical skills and technologies mentioned"),
  coreCompetencyIds: z
    .array(z.string())
    .describe(
      "IDs of competencies from the database that match this role (e.g., tech-001, lead-002)"
    ),
  responsibilities: z
    .array(z.string())
    .describe("Key responsibilities extracted from the job description"),
  qualifications: z
    .array(z.string())
    .describe("Required qualifications and experience"),
  niceToHave: z
    .array(z.string())
    .describe("Nice-to-have skills or qualifications (if mentioned)"),
  interviewFocus: z
    .enum(["technical", "behavioral", "mixed"])
    .describe(
      "Recommended interview focus based on job description emphasis"
    ),
  suggestedQuestionCount: z
    .number()
    .min(3)
    .max(15)
    .describe("Recommended number of interview questions based on role complexity"),
});

export type JobAnalysisResult = z.infer<typeof jobAnalysisSchema>;

/**
 * AI Hiring Agent - Analyzes job descriptions using AWS Bedrock
 * Persona: Senior technical recruiter with deep hiring expertise
 */
export async function analyzeJobDescription(
  jobDescription: string
): Promise<JobAnalysisResult> {
  // Build competencies context for the AI
  const competenciesContext = COMPETENCIES_DATABASE.map(
    (comp) => `${comp.id}: ${comp.name} (${comp.category}) - ${comp.description}`
  ).join("\n");

  const systemPrompt = `You are an expert technical recruiter and hiring manager with 15+ years of experience in the technology industry. You have:

- Deep expertise in identifying job competencies from descriptions
- Strong understanding of technical roles, skills, and career levels
- Ability to match job requirements to standardized competency frameworks
- Experience hiring for companies like Google, Amazon, Meta, OpenAI, and Anthropic

Your task is to analyze job descriptions and extract structured information that will be used to create tailored interview questions.

COMPETENCIES DATABASE:
${competenciesContext}

IMPORTANT INSTRUCTIONS:
1. Carefully read the job description
2. Extract the exact role title and experience level
3. Identify all technical skills and technologies mentioned
4. Match the job requirements to competencies from the database above (use the competency IDs)
5. Extract key responsibilities and qualifications
6. Determine the appropriate interview focus (technical vs behavioral)
7. Suggest an appropriate number of interview questions based on role seniority`;

  const userPrompt = `Analyze the following job description and extract structured information:

JOB DESCRIPTION:
"""
${jobDescription}
"""

Please provide a comprehensive analysis with:
1. Role title and experience level
2. All technical skills mentioned
3. Matching competency IDs from the database (select 3-8 most relevant competencies)
4. Key responsibilities
5. Required qualifications
6. Nice-to-have skills
7. Interview focus recommendation
8. Suggested number of interview questions

Be thorough but concise. Focus on accuracy and relevance.`;

  const result = await generateObject({
    schema: jobAnalysisSchema,
    prompt: userPrompt,
    systemPrompt,
    maxTokens: 6000,
    temperature: 0.3, // Lower temperature for more consistent extraction
  });

  return result;
}

/**
 * Map competency IDs to full competency objects
 */
export function mapCompetencyIds(ids: string[]) {
  return ids
    .map((id) => COMPETENCIES_DATABASE.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
}
