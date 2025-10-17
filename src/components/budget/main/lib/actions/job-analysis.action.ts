"use server";

import { prisma } from "@/lib/prisma";

export async function getJobAnalysisById(id: string) {
  try {
    const jobAnalysis = await prisma.jobAnalysis.findUnique({
      where: { id },
    });

    if (!jobAnalysis) return null;

    return {
      id: jobAnalysis.id,
      role: jobAnalysis.role,
      level: jobAnalysis.level,
      company: jobAnalysis.company,
      extractedSkills: JSON.parse(jobAnalysis.extractedSkills),
      coreCompetencies: JSON.parse(jobAnalysis.coreCompetencies),
      responsibilities: JSON.parse(jobAnalysis.responsibilities),
      qualifications: JSON.parse(jobAnalysis.qualifications),
      niceToHave: JSON.parse(jobAnalysis.niceToHave),
      analyzedAt: jobAnalysis.analyzedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching job analysis:", error);
    return null;
  }
}

export async function getJobAnalysesByUserId(userId: string) {
  try {
    const analyses = await prisma.jobAnalysis.findMany({
      where: { userId },
      orderBy: { analyzedAt: "desc" },
      include: {
        interviews: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    return analyses.map((analysis) => ({
      id: analysis.id,
      role: analysis.role,
      level: analysis.level,
      company: analysis.company,
      extractedSkills: JSON.parse(analysis.extractedSkills),
      coreCompetencies: JSON.parse(analysis.coreCompetencies),
      analyzedAt: analysis.analyzedAt.toISOString(),
      interviewCount: analysis.interviews.length,
    }));
  } catch (error) {
    console.error("Error fetching job analyses:", error);
    return [];
  }
}
