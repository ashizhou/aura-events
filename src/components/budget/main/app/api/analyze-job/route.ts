import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeJobDescription, mapCompetencyIds } from "@/lib/hiring-agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobDescription } = await request.json();

    if (!jobDescription || jobDescription.trim().length < 50) {
      return Response.json(
        {
          success: false,
          error: "Job description must be at least 50 characters",
        },
        { status: 400 }
      );
    }

    // Analyze job description using AI hiring agent
    const analysis = await analyzeJobDescription(jobDescription);

    // Map competency IDs to full competency objects
    const competencies = mapCompetencyIds(analysis.coreCompetencyIds);

    // Save to database
    const jobAnalysis = await prisma.jobAnalysis.create({
      data: {
        userId: user.id,
        jobDescription: jobDescription.trim(),
        role: analysis.role,
        level: analysis.level,
        company: analysis.company || null,
        extractedSkills: JSON.stringify(analysis.extractedSkills),
        coreCompetencies: JSON.stringify(
          competencies.map((c) => ({
            id: c.id,
            name: c.name,
            category: c.category,
          }))
        ),
        responsibilities: JSON.stringify(analysis.responsibilities),
        qualifications: JSON.stringify(analysis.qualifications),
        niceToHave: JSON.stringify(analysis.niceToHave),
      },
    });

    return Response.json(
      {
        success: true,
        data: {
          id: jobAnalysis.id,
          role: analysis.role,
          level: analysis.level,
          company: analysis.company,
          extractedSkills: analysis.extractedSkills,
          coreCompetencies: competencies,
          responsibilities: analysis.responsibilities,
          qualifications: analysis.qualifications,
          niceToHave: analysis.niceToHave,
          interviewFocus: analysis.interviewFocus,
          suggestedQuestionCount: analysis.suggestedQuestionCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing job description:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
