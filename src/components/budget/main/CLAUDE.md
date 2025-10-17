# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prepwise is an AI-powered job interview preparation platform built with Next.js 15, SQLite with Prisma ORM, and AWS Bedrock. Users can analyze job descriptions, create targeted mock interviews, practice with text-based interviews, and receive detailed AI-generated feedback. Authentication is handled with session-based cookies.

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Push schema changes to SQLite database
```

## Environment Variables

Required in `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# AWS Bedrock (job analysis, question generation & feedback)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**AWS Bedrock Setup**:
- Default model: `anthropic.claude-3-5-sonnet-20241022-v2:0`
- Ensure your AWS account has access to Claude models in Bedrock
- Grant IAM permissions: `bedrock:InvokeModel` for the Bedrock runtime
- No Vapi API keys needed - text-based interviews only

## Architecture

### Core Flow

1. **Job Competencies Creation** (`app/analyze-job/page.tsx` → `lib/hiring-agent.ts`)
   - User uploads job description
   - AI Hiring Agent (senior recruiter persona) analyzes the description using AWS Bedrock
   - Extracts: role, level, skills, competencies, responsibilities, qualifications
   - Matches requirements to standardized competency database (33 competencies across 7 categories)
   - Stores analysis in SQLite with job-interview relationship

2. **Interview Creation** (`app/api/vapi/generate/route.ts`)
   - Uses AWS Bedrock (Claude) to generate interview questions
   - Can be based on:
     - Job analysis (targeted questions based on extracted competencies)
     - Manual input (role, level, tech stack, type)
   - Questions enhanced with competency context when available
   - Questions are stored in SQLite via Prisma with metadata

3. **Interview Execution** (`components/TextInterview.tsx`)
   - Text-based interview system with question-by-question flow
   - User types answers with no time limits
   - **Intelligent Follow-up Questions**: AI automatically generates contextual follow-up questions based on:
     - Brief answers (< 30 words)
     - Answers containing technical keywords (e.g., "implemented", "designed", "approach", "challenge")
     - Maximum 2 follow-ups per main question to prevent loops
   - Progress tracking and real-time chat interface
   - Responses stored as transcript (with `<follow_up>` tags) for feedback generation

4. **Feedback Generation** (`lib/actions/general.action.ts`)
   - After interview ends, transcript is sent to AWS Bedrock (Claude)
   - AI evaluates candidate on 5 categories: Communication Skills, Technical Knowledge, Problem Solving, Cultural Fit, Confidence & Clarity
   - Feedback includes scores (0-100), strengths, areas for improvement, and final assessment
   - Structured output validated with Zod schema

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Next.js API routes (server actions)
- **Database**: SQLite with Prisma ORM
- **Auth**: Session-based authentication with bcrypt password hashing
- **AI**: AWS Bedrock (Claude 3.5 Sonnet via Converse API)
- **Validation**: Zod schemas
- **Interview Mode**: Text-based with chat UI

### Key Files

- `lib/bedrock.ts`: AWS Bedrock client and helper functions (generateText, generateObject)
- `lib/hiring-agent.ts`: AI Hiring Agent for job description analysis with competency extraction
- `constants/competencies.ts`: Comprehensive competencies database (33 competencies across 7 categories)
- `components/TextInterview.tsx`: Text-based interview component with chat UI and intelligent follow-ups
- `lib/prisma.ts`: Prisma client singleton
- `lib/session.ts`: Session management utilities (create, get, delete)
- `prisma/schema.prisma`: Database schema (User, JobAnalysis, Interview, Feedback, Session models)
- `constants/index.ts`: Interview configuration, tech mappings, Vapi assistant config, feedback schema
- `lib/actions/job-analysis.action.ts`: Server actions for job analysis operations
- `lib/actions/general.action.ts`: Server actions for interviews and feedback
- `lib/actions/auth.action.ts`: Server actions for authentication
- `app/analyze-job/page.tsx`: Job description upload and analysis page
- `app/api/analyze-job/route.ts`: API endpoint for job description analysis
- `app/api/generate-followup/route.ts`: API endpoint for AI-powered follow-up question generation

### Database Schema (Prisma)

**User Model**:
- id, email (unique), password (hashed with bcrypt), name, createdAt
- Relations: jobAnalyses[], interviews[], feedback[], sessions[]

**JobAnalysis Model** (NEW):
- id, userId, jobDescription (text), role, level, company (optional)
- extractedSkills (JSON array), coreCompetencies (JSON array of matched competencies)
- responsibilities (JSON array), qualifications (JSON array), niceToHave (JSON array)
- analyzedAt (timestamp)
- Relations: user, interviews[]

**Interview Model**:
- id, userId, jobAnalysisId (optional FK), role, type, level, techstack (JSON string)
- questions (JSON string), finalized, coverImage, createdAt
- Relations: user, jobAnalysis (optional), feedback[]

**Feedback Model**:
- id, interviewId, userId, totalScore, categoryScores (JSON string), strengths (JSON string), areasForImprovement (JSON string), finalAssessment, createdAt
- Relations: interview, user

**Session Model**:
- id, userId, token (unique), expiresAt, createdAt
- Relations: user

### Text Interview System

- **Interview Flow** (`components/TextInterview.tsx`):
  - Question-by-question progression with chat interface
  - No time limits - users answer at their own pace
  - Progress tracking with visual progress bar
  - Ctrl+Enter keyboard shortcut for quick submission
- **Transcript Generation**: User responses and questions stored in message format
- **Feedback Integration**: Transcript automatically sent for AI analysis on completion

### Intelligent Follow-up Question System

**Detection Logic** (`components/TextInterview.tsx:63-77`):
- Automatically triggers when candidate's answer:
  - Is brief (< 30 words) OR
  - Contains technical keywords: "because", "implemented", "designed", "decided", "approach", "solution", "challenge"
- Maximum 2 follow-ups per main question (prevents infinite loops)
- Skips follow-ups on the last question (unless already in follow-up mode)

**Generation** (`app/api/generate-followup/route.ts`):
- Uses AWS Bedrock (Claude) with expert interviewer persona
- Analyzes candidate's answer in context of the conversation
- Includes last 4 messages for conversation continuity
- Temperature: 0.7 for natural, conversational questions
- Returns single focused follow-up question (1-2 sentences max)

**UI Features**:
- Follow-up questions tagged with `<follow_up>` in message content
- Visual indicators: 🔍 icon and "Follow-up Question" label
- Special styling: border and highlighted background
- Loading state: "Generating follow-up question..." with spinner
- User control: "Skip to next question →" option while waiting for answer
- Preserved in transcript for comprehensive feedback analysis

**Follow-up Question Characteristics**:
- Brief and focused (1-2 sentences)
- Directly related to candidate's answer
- Natural and conversational
- Probing but not aggressive
- Professional and respectful
- Seeks: clarification, concrete examples, technical depth, decision-making processes

### AI Prompts

**Question Generation** (`app/api/vapi/generate/route.ts:13-25`):
- Generates interview questions based on role, level, tech stack, type, and amount
- Returns JSON array of questions formatted for voice assistant
- Avoids special characters that break voice synthesis

**Follow-up Question Generation** (`app/api/generate-followup/route.ts:21-60`):
- Expert interviewer persona with professional technical interview experience
- Generates ONE specific follow-up question based on candidate's answer
- Considers conversation context (last 2 Q&A pairs)
- Targets: vague responses, interesting technical choices, claims without examples, unique problem-solving approaches
- Output: Brief, conversational, focused question (1-2 sentences max)

**Feedback Generation** (`lib/actions/general.action.ts:25-38`):
- Evaluates transcript on 5 structured categories
- Uses strict scoring (0-100) with detailed comments
- Returns structured output validated against Zod schema

### Styling Patterns

- **Custom Utilities**: `dark-gradient`, `border-gradient`, `blue-gradient`, `flex-center`, `pattern`
- **Component Classes**: `.btn-call`, `.btn-disconnect`, `.btn-primary`, `.btn-secondary`, `.card`, `.form`, `.call-view`, `.transcript-border`
- **Theme**: Custom CSS variables for light/dark modes, using OKLCH color space
- **Responsive**: Mobile-first with `max-sm:` breakpoints

## Important Notes

- **Authentication**: Session-based with 7-day expiration. Passwords hashed with bcrypt (10 rounds)
- **Database**: SQLite file at `prisma/dev.db`. Use Prisma Studio for GUI management
- **JSON Fields**: techstack, questions, categoryScores, strengths, and areasForImprovement stored as JSON strings (use `JSON.parse/stringify`)
- **Vapi Integration**: Workflow mode for interview generation, inline assistant config for interview execution
- **Feedback**: Generated only after interview completion (CallStatus.FINISHED)
- **Tech Logos**: Fetched from jsDelivr CDN with fallback to `/tech.svg`
- **Interview Covers**: Randomly assigned from predefined list in constants

## AI Hiring Agent & Competency Matching

**Hiring Agent Persona** (`lib/hiring-agent.ts`):
- Expert technical recruiter with 15+ years of experience
- Deep expertise in identifying job competencies from descriptions
- Strong understanding of technical roles, skills, and career levels
- Experience hiring for top tech companies (Google, Amazon, Meta, OpenAI, Anthropic)

**Competency Database** (`constants/competencies.ts`):
- 33 standardized competencies across 7 categories:
  - Technical (10): Full-Stack Dev, Frontend, Backend, Cloud, Databases, DevOps, System Design, ML/AI, Security, Mobile
  - Leadership (4): Team Leadership, Technical Leadership, Project Management, Strategic Thinking
  - Communication (2): Technical Communication, Cross-functional Collaboration
  - Problem-Solving (3): Analytical Thinking, Innovation, Performance Optimization
  - Collaboration (2): Code Review & Quality, Mentorship & Knowledge Sharing
  - Adaptability (2): Learning Agility, Change Management
  - Domain Expertise (4): E-commerce, Fintech, Healthcare, Enterprise SaaS

**Analysis Process**:
1. User pastes job description
2. AI extracts: role, level, company, skills, responsibilities, qualifications
3. Matches job requirements to competency IDs from database
4. Recommends interview focus (technical/behavioral/mixed)
5. Suggests optimal question count based on role seniority
6. Stores analysis with job-interview relationship

## AWS Bedrock Integration

**Bedrock Converse API** (`lib/bedrock.ts`):
- Uses `@aws-sdk/client-bedrock-runtime` for AWS Bedrock access
- Default model: Claude 3.5 Sonnet (`anthropic.claude-3-5-sonnet-20241022-v2:0`)
- `generateText()`: For plain text generation (interview questions)
- `generateObject()`: For structured JSON output with Zod validation (job analysis, feedback)
- Handles JSON parsing and cleanup from LLM responses

**Required IAM Permissions**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    }
  ]
}
```

## Migration History

**From Firebase to SQLite**:
- Firestore → SQLite with Prisma ORM
- Firebase Auth → Session-based auth with bcrypt
- All Firebase dependencies removed

**From Google Gemini to AWS Bedrock**:
- Google Gemini API → AWS Bedrock Converse API
- Vercel AI SDK → Native AWS SDK
- All Google AI dependencies removed

**From Vapi Voice to Text Interviews**:
- Vapi AI voice agents → Text-based interview system
- WebSocket voice transcription → Direct text input
- All Vapi dependencies removed
- Simpler, more accessible interview experience
