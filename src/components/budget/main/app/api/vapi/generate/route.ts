import { generateText } from "@/lib/bedrock";
import { prisma } from "@/lib/prisma";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid, jobAnalysisId, competencies } =
    await request.json();

  try {
    // Enhanced prompt when competencies are provided
    let promptContext = "";
    if (competencies && competencies.length > 0) {
      const competencyList = competencies.map((c: any) => c.name).join(", ");
      promptContext = `\n\nKey competencies for this role: ${competencyList}.\nPlease ensure questions assess these competencies effectively.`;
    }

    const questions = await generateText({
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.${promptContext}

        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3
    `,
    });

    const techstackArray = techstack.split(",");

    await prisma.interview.create({
      data: {
        role,
        type,
        level,
        techstack: JSON.stringify(techstackArray),
        questions,
        userId: userid,
        jobAnalysisId: jobAnalysisId || null,
        finalized: true,
        coverImage: getRandomInterviewCover(),
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
