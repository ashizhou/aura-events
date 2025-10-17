import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getJobAnalysesByUserId } from "@/lib/actions/job-analysis.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview, jobAnalyses] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
    getJobAnalysesByUserId(user?.id!),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;
  const hasJobAnalyses = jobAnalyses?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Upload job descriptions, extract competencies, and practice with
            targeted interview questions
          </p>

          <div className="flex gap-3 max-sm:flex-col">
            <Button asChild className="btn-primary">
              <Link href="/analyze-job">Analyze Job →</Link>
            </Button>
            <Button asChild className="btn-secondary">
              <Link href="/interview">Quick Interview</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Job Analyses Section */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex justify-between items-center">
          <h2>Your Job Analyses</h2>
          <Button asChild className="btn-primary text-sm">
            <Link href="/analyze-job">+ New Analysis</Link>
          </Button>
        </div>

        <div className="interviews-section">
          {hasJobAnalyses ? (
            jobAnalyses?.map((analysis) => (
              <div key={analysis.id} className="card-border flex-1 min-w-[300px]">
                <div className="card-interview">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {analysis.role}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-primary-200/20 text-primary-100 rounded-full text-xs">
                            {analysis.level}
                          </span>
                          {analysis.company && (
                            <span className="px-2 py-1 bg-primary-200/20 text-primary-100 rounded-full text-xs">
                              {analysis.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-light-100">
                        {analysis.coreCompetencies.length} Competencies •{" "}
                        {analysis.extractedSkills.length} Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {analysis.coreCompetencies.slice(0, 3).map((comp: any) => (
                          <span
                            key={comp.id}
                            className="px-2 py-1 bg-dark-200 rounded text-xs"
                          >
                            {comp.name}
                          </span>
                        ))}
                        {analysis.coreCompetencies.length > 3 && (
                          <span className="px-2 py-1 bg-dark-200 rounded text-xs">
                            +{analysis.coreCompetencies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button asChild className="btn-primary flex-1 text-sm">
                        <Link href={`/interview?jobAnalysisId=${analysis.id}`}>
                          Create Interview
                        </Link>
                      </Button>
                      <Button asChild className="btn-secondary text-sm">
                        <Link href={`/analyze-job?id=${analysis.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card-border w-full">
              <div className="card p-8 flex-center flex-col gap-4 text-center">
                <div className="size-16 rounded-full bg-primary-200/10 flex-center">
                  <span className="text-3xl">📄</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Job Analyses Yet
                  </h3>
                  <p className="text-light-100 mb-4">
                    Upload a job description to get AI-powered competency analysis
                  </p>
                  <Button asChild className="btn-primary">
                    <Link href="/analyze-job">Analyze Your First Job</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
