import Image from "next/image";
import { redirect } from "next/navigation";

import TextInterview from "@/components/TextInterview";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between items-start max-sm:flex-col">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={interview.coverImage || getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <div className="flex gap-2 items-center">
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit text-sm">
            {interview.type}
          </p>
          <p className="bg-primary-200/20 text-primary-100 px-4 py-2 rounded-lg h-fit text-sm">
            {interview.level}
          </p>
        </div>
      </div>

      <TextInterview
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetails;
