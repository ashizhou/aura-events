"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createFeedback } from "@/lib/actions/general.action";
import { toast } from "sonner";

interface TextInterviewProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  questions: string[];
}

interface Message {
  role: "assistant" | "user";
  content: string;
  isFollowUp?: boolean;
}

export default function TextInterview({
  userName,
  userId,
  interviewId,
  feedbackId,
  questions,
}: TextInterviewProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [waitingForFollowUp, setWaitingForFollowUp] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const maxFollowUpsPerQuestion = 2;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (isStarted && currentQuestion && messages.length === 0) {
      // Add first question
      setMessages([
        {
          role: "assistant",
          content: `Hello ${userName}! Let's begin the interview. ${currentQuestion}`,
        },
      ]);
    }
  }, [isStarted, currentQuestion, messages.length, userName]);

  const handleStart = () => {
    setIsStarted(true);
  };

  // Decide if we should generate a follow-up question
  const shouldGenerateFollowUp = (answer: string): boolean => {
    // Don't generate follow-ups on last question
    if (isLastQuestion && !waitingForFollowUp) return false;

    // Limit follow-ups per question
    if (followUpCount >= maxFollowUpsPerQuestion) return false;

    const wordCount = answer.trim().split(/\s+/).length;
    const hasKeywords = /\b(because|implemented|designed|decided|approach|solution|challenge)\b/i.test(answer);

    // Generate follow-up if:
    // - Answer is brief (< 30 words) OR
    // - Answer mentions interesting technical details that could be explored
    return wordCount < 30 || hasKeywords;
  };

  const generateFollowUp = async (question: string, answer: string) => {
    setIsGeneratingFollowUp(true);
    try {
      const response = await fetch("/api/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (data.success && data.followUpQuestion) {
        return data.followUpQuestion;
      }
      return null;
    } catch (error) {
      console.error("Error generating follow-up:", error);
      return null;
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    // Add user answer to messages
    const newMessages = [
      ...messages,
      {
        role: "user" as const,
        content: userAnswer,
      },
    ];

    setMessages(newMessages);
    const submittedAnswer = userAnswer;
    setUserAnswer("");

    // Get the current question being answered
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    const currentQ = lastAssistantMessage?.content || currentQuestion;

    // Determine if we should generate a follow-up
    const needsFollowUp = shouldGenerateFollowUp(submittedAnswer);

    if (needsFollowUp) {
      setWaitingForFollowUp(true);

      // Generate follow-up question
      const followUp = await generateFollowUp(currentQ, submittedAnswer);

      if (followUp) {
        setFollowUpCount(prev => prev + 1);

        // Add follow-up question with tag
        setTimeout(() => {
          setMessages([
            ...newMessages,
            {
              role: "assistant" as const,
              content: `<follow_up>${followUp}</follow_up>`,
              isFollowUp: true,
            },
          ]);
          setWaitingForFollowUp(false);
        }, 500);
        return; // Don't move to next question yet
      }
    }

    // Move to next question or finish
    if (isLastQuestion) {
      setIsCompleted(true);
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setFollowUpCount(0); // Reset follow-up count for new question

      // Add next question
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            role: "assistant" as const,
            content: questions[nextIndex],
          },
        ]);
      }, 500);
    }
  };

  const handleSkipFollowUp = () => {
    setWaitingForFollowUp(false);
    setFollowUpCount(0);

    // Move to next question
    if (isLastQuestion) {
      setIsCompleted(true);
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      setTimeout(() => {
        setMessages([
          ...messages,
          {
            role: "assistant" as const,
            content: questions[nextIndex],
          },
        ]);
      }, 300);
    }
  };

  const handleFinishInterview = async () => {
    if (!interviewId || !userId) {
      toast.error("Missing interview or user information");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format transcript for feedback generation
      const transcript = messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      }));

      const result = await createFeedback({
        interviewId,
        userId,
        transcript,
        feedbackId,
      });

      if (result.success) {
        toast.success("Interview completed! Generating feedback...");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Failed to generate feedback");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="card-border max-w-2xl w-full">
          <div className="card p-8 flex flex-col items-center gap-6 text-center">
            <div className="size-20 rounded-full bg-primary-200/20 flex-center">
              <span className="text-4xl">💬</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Text-Based Interview</h2>
              <p className="text-light-100 mb-2">
                You&apos;ll be asked {questions.length} questions. Take your time to
                provide thoughtful answers.
              </p>
              <p className="text-light-100 text-sm">
                Your responses will be analyzed to provide detailed feedback.
              </p>
            </div>

            <div className="w-full max-w-md bg-dark-200 rounded-lg p-4 text-left">
              <p className="text-sm text-light-100 mb-2">Interview includes:</p>
              <ul className="text-sm space-y-1">
                <li>✓ {questions.length} carefully crafted questions</li>
                <li>✓ Smart follow-up questions based on your answers</li>
                <li>✓ No time limits - answer at your pace</li>
                <li>✓ AI-powered feedback on completion</li>
                <li>✓ Detailed performance analysis</li>
              </ul>
            </div>

            <Button onClick={handleStart} className="btn-primary px-8">
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="card-border max-w-2xl w-full">
          <div className="card p-8 flex flex-col items-center gap-6 text-center">
            <div className="size-20 rounded-full bg-success-100/20 flex-center">
              <span className="text-4xl">✓</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Interview Complete!</h2>
              <p className="text-light-100 mb-2">
                You&apos;ve answered all {questions.length} questions.
              </p>
              <p className="text-light-100 text-sm">
                Click below to generate your detailed feedback and performance
                analysis.
              </p>
            </div>

            <div className="w-full max-w-md bg-dark-200 rounded-lg p-4 text-left">
              <p className="text-sm text-light-100 mb-2">Your feedback will include:</p>
              <ul className="text-sm space-y-1">
                <li>✓ Overall performance score</li>
                <li>✓ Category-wise breakdown</li>
                <li>✓ Strengths and areas for improvement</li>
                <li>✓ Final assessment and recommendations</li>
              </ul>
            </div>

            <Button
              onClick={handleFinishInterview}
              disabled={isSubmitting}
              className="btn-primary px-8"
            >
              {isSubmitting ? "Generating Feedback..." : "Get Feedback"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-light-100">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-primary-200 font-semibold">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-dark-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-200 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card-border">
        <div className="card p-6 flex flex-col gap-6">
          {/* Messages */}
          <div className="flex flex-col gap-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => {
              // Extract content and check for follow-up tag
              const isFollowUp = message.isFollowUp || message.content.includes("<follow_up>");
              const displayContent = message.content
                .replace(/<follow_up>/g, "")
                .replace(/<\/follow_up>/g, "");

              return (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    {message.role === "assistant" && isFollowUp && (
                      <span className="text-xs text-primary-200 font-semibold flex items-center gap-1 ml-1">
                        <span>🔍</span> Follow-up Question
                      </span>
                    )}
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === "assistant"
                          ? isFollowUp
                            ? "bg-primary-200/10 text-light-100 border border-primary-200/40"
                            : "bg-dark-200 text-light-100"
                          : "bg-primary-200/20 text-white border border-primary-200/30"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{displayContent}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {isGeneratingFollowUp && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-dark-200 text-light-100 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin size-4 border-2 border-primary-200 border-t-transparent rounded-full" />
                    <p className="text-sm text-light-100">Generating follow-up question...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <label className="text-sm font-medium">Your Answer:</label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here... Be detailed and specific."
              className="w-full min-h-[120px] bg-dark-200 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 placeholder:text-light-100"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSubmitAnswer();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-light-100">
                  Press Ctrl+Enter to submit
                </span>
                {waitingForFollowUp && (
                  <button
                    onClick={handleSkipFollowUp}
                    className="text-xs text-primary-200 hover:underline text-left"
                  >
                    Skip to next question →
                  </button>
                )}
              </div>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isGeneratingFollowUp}
                className="btn-primary"
              >
                {isGeneratingFollowUp ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Processing...
                  </span>
                ) : waitingForFollowUp ? (
                  "Submit Answer"
                ) : isLastQuestion ? (
                  "Finish Interview"
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
