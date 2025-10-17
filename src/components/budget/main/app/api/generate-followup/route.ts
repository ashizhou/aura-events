import { NextRequest } from "next/server";
import { generateText } from "@/lib/bedrock";

export async function POST(request: NextRequest) {
  try {
    const { question, answer, conversationHistory } = await request.json();

    if (!question || !answer) {
      return Response.json(
        { success: false, error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Build conversation context
    const contextMessages = conversationHistory
      ?.slice(-4) // Last 2 Q&A pairs for context
      ?.map((msg: any) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      ?.join("\n") || "";

    const systemPrompt = `You are an expert interviewer conducting a professional technical interview. Your role is to:

1. Ask intelligent follow-up questions to:
   - Clarify vague or brief responses
   - Dive deeper into interesting points
   - Assess technical depth and understanding
   - Explore decision-making processes
   - Understand practical experience

2. Follow-up question characteristics:
   - Brief and focused (1-2 sentences max)
   - Directly related to the candidate's answer
   - Natural and conversational
   - Probing but not aggressive
   - Professional and respectful

3. When to ask follow-ups:
   - Answer lacks specific details
   - Mentions interesting technical choices
   - Claims experience without examples
   - Shows potential for deeper discussion
   - Demonstrates unique problem-solving approach

Return ONLY the follow-up question text, nothing else.`;

    const userPrompt = `Based on this interview exchange, generate ONE specific follow-up question:

Original Question: "${question}"

Candidate's Answer: "${answer}"

${contextMessages ? `\nRecent Conversation Context:\n${contextMessages}` : ""}

Generate a natural follow-up question that:
- Directly addresses something specific from their answer
- Asks for concrete examples, details, or clarification
- Feels like a real interviewer seeking to understand better
- Is brief and conversational

Follow-up Question:`;

    const followUpQuestion = await generateText({
      prompt: userPrompt,
      systemPrompt,
      maxTokens: 200,
      temperature: 0.7, // Slightly higher for natural conversation
    });

    // Clean up the response
    const cleanedQuestion = followUpQuestion
      .trim()
      .replace(/^(Follow-up Question:|Question:)/i, "")
      .replace(/^["']|["']$/g, "")
      .trim();

    return Response.json(
      {
        success: true,
        followUpQuestion: cleanedQuestion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate follow-up",
      },
      { status: 500 }
    );
  }
}
