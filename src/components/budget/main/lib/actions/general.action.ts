"use server";

import { generateObject } from "@/lib/bedrock";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const object = await generateObject({
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      systemPrompt:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedbackData = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: JSON.stringify(object.categoryScores),
      strengths: JSON.stringify(object.strengths),
      areasForImprovement: JSON.stringify(object.areasForImprovement),
      finalAssessment: object.finalAssessment,
    };

    let feedback;

    if (feedbackId) {
      feedback = await prisma.feedback.update({
        where: { id: feedbackId },
        data: feedbackData,
      });
    } else {
      feedback = await prisma.feedback.create({
        data: feedbackData,
      });
    }

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await prisma.interview.findUnique({
    where: { id },
  });

  if (!interview) return null;

  return {
    id: interview.id,
    userId: interview.userId,
    role: interview.role,
    type: interview.type,
    techstack: JSON.parse(interview.techstack),
    level: interview.level,
    questions: JSON.parse(interview.questions),
    finalized: interview.finalized,
    coverImage: interview.coverImage,
    createdAt: interview.createdAt.toISOString(),
  } as Interview;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await prisma.feedback.findFirst({
    where: {
      interviewId,
      userId,
    },
  });

  if (!feedback) return null;

  return {
    id: feedback.id,
    interviewId: feedback.interviewId,
    totalScore: feedback.totalScore,
    categoryScores: JSON.parse(feedback.categoryScores),
    strengths: JSON.parse(feedback.strengths),
    areasForImprovement: JSON.parse(feedback.areasForImprovement),
    finalAssessment: feedback.finalAssessment,
    createdAt: feedback.createdAt.toISOString(),
  } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await prisma.interview.findMany({
    where: {
      finalized: true,
      userId: {
        not: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return interviews.map((interview) => ({
    id: interview.id,
    userId: interview.userId,
    role: interview.role,
    type: interview.type,
    techstack: JSON.parse(interview.techstack),
    level: interview.level,
    questions: JSON.parse(interview.questions),
    finalized: interview.finalized,
    coverImage: interview.coverImage,
    createdAt: interview.createdAt.toISOString(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await prisma.interview.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return interviews.map((interview) => ({
    id: interview.id,
    userId: interview.userId,
    role: interview.role,
    type: interview.type,
    techstack: JSON.parse(interview.techstack),
    level: interview.level,
    questions: JSON.parse(interview.questions),
    finalized: interview.finalized,
    coverImage: interview.coverImage,
    createdAt: interview.createdAt.toISOString(),
  })) as Interview[];
}
