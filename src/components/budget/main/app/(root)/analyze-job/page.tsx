"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  id: string;
  role: string;
  level: string;
  company?: string;
  extractedSkills: string[];
  coreCompetencies: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  responsibilities: string[];
  qualifications: string[];
  niceToHave: string[];
  interviewFocus: string;
  suggestedQuestionCount: number;
}

export default function AnalyzeJobPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50) {
      toast.error("Please enter at least 50 characters");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "Analysis failed");
        return;
      }

      setAnalysisResult(data.data);
      toast.success("Job description analyzed successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to analyze job description");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateInterview = () => {
    if (analysisResult) {
      router.push(`/interview?jobAnalysisId=${analysisResult.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Analyze Job Description</h1>
        <p className="text-light-100 text-lg">
          Upload a job description and let our AI hiring agent extract key
          competencies for targeted interview preparation.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="card-border">
          <div className="card p-6 flex flex-col gap-6">
            <div className="flex flex-row items-center gap-3">
              <div className="size-12 rounded-full bg-primary-200/20 flex-center">
                <Image
                  src="/ai-avatar.png"
                  alt="AI Agent"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">AI Hiring Agent</h3>
                <p className="text-light-100 text-sm">
                  Expert technical recruiter with 15+ years experience
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-light-100 font-medium">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here...&#10;&#10;Example:&#10;Senior Full-Stack Engineer&#10;&#10;We're looking for an experienced engineer to join our team...&#10;&#10;Requirements:&#10;- 5+ years of experience with React and Node.js&#10;- Strong system design skills&#10;- Experience with AWS..."
                className="w-full min-h-[400px] bg-dark-200 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 placeholder:text-light-100"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-light-100">
                  {jobDescription.length} characters
                </span>
                {jobDescription.length < 50 && jobDescription.length > 0 && (
                  <span className="text-sm text-destructive-100">
                    Minimum 50 characters required
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || jobDescription.trim().length < 50}
              className="btn-primary w-full"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  Analyzing...
                </span>
              ) : (
                "Analyze Job Description"
              )}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="card-border">
          <div className="card p-6 flex flex-col gap-6">
            {!analysisResult ? (
              <div className="flex-center flex-col gap-4 min-h-[400px] text-center">
                <div className="size-16 rounded-full bg-primary-200/10 flex-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Waiting for Analysis
                  </h3>
                  <p className="text-light-100 text-sm max-w-md">
                    Paste a job description and click &quot;Analyze&quot; to extract
                    competencies and prepare for targeted interviews.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Role Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold">{analysisResult.role}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary-200/20 text-primary-100 rounded-full text-sm">
                      {analysisResult.level}
                    </span>
                    {analysisResult.company && (
                      <span className="px-3 py-1 bg-primary-200/20 text-primary-100 rounded-full text-sm">
                        {analysisResult.company}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-success-100/20 text-success-100 rounded-full text-sm capitalize">
                      {analysisResult.interviewFocus} Focus
                    </span>
                  </div>
                </div>

                {/* Core Competencies */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold">Core Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.coreCompetencies.map((comp) => (
                      <span
                        key={comp.id}
                        className="px-3 py-2 bg-dark-200 rounded-lg text-sm border border-primary-200/30"
                      >
                        {comp.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.extractedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-dark-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.responsibilities.slice(0, 3).map((resp, idx) => (
                      <li key={idx} className="text-sm text-light-100">
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-light-100 mb-4">
                    Ready to create {analysisResult.suggestedQuestionCount}{" "}
                    targeted interview questions?
                  </p>
                  <Button
                    onClick={handleCreateInterview}
                    className="btn-primary w-full"
                  >
                    Create Interview →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
