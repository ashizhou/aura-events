# Prepwise - AI Mock Interview Platform

An AI-powered interview preparation platform built with Next.js, AWS Bedrock, and SQLite. Analyze job descriptions, extract competencies, practice with text-based interviews, and receive detailed AI feedback.

## Features

✅ **Job Description Analysis** - AI hiring agent extracts competencies and requirements
✅ **Competency Framework** - 33 standardized competencies across 7 categories
✅ **Targeted Question Generation** - AWS Bedrock creates role-specific questions
✅ **Text-Based Interviews** - Answer at your own pace with no time limits
✅ **Intelligent Follow-ups** - AI generates contextual follow-up questions based on your answers
✅ **AI Feedback** - Detailed performance analysis across 5 categories
✅ **Local Database** - SQLite with Prisma ORM, no cloud dependencies
✅ **Session Auth** - Secure authentication with bcrypt

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS v4, shadcn/ui
- **Backend**: Next.js API routes, Server Actions
- **Database**: SQLite with Prisma ORM
- **Auth**: Session-based with bcrypt password hashing
- **AI**: AWS Bedrock (Claude 3.5 Sonnet via Converse API)
- **Validation**: Zod schemas

## Quick Start

### Prerequisites

- Node.js 18+
- AWS account with Bedrock access
- Claude model access in AWS Bedrock

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ai_mock_interviews-main

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AWS credentials

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit http://localhost:3000

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Usage Flow

1. **Sign Up / Sign In** - Create an account or log in
2. **Analyze Job** - Paste a job description to extract competencies
3. **Create Interview** - Generate targeted questions based on analysis
4. **Take Interview** - Answer questions in text format at your own pace
5. **Get Feedback** - Receive AI-powered performance analysis

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (root)/              # Main application pages
│   │   ├── analyze-job/     # Job description analysis
│   │   ├── interview/       # Interview pages
│   │   └── page.tsx         # Dashboard
│   └── api/                 # API routes
├── components/              # React components
│   ├── TextInterview.tsx    # Interview component
│   └── ui/                  # UI primitives
├── constants/
│   ├── competencies.ts      # Competencies database
│   └── index.ts             # App constants
├── lib/
│   ├── bedrock.ts           # AWS Bedrock client
│   ├── hiring-agent.ts      # Job analysis AI agent
│   ├── prisma.ts            # Prisma client
│   ├── session.ts           # Session management
│   └── actions/             # Server actions
└── prisma/
    └── schema.prisma        # Database schema
```

## Key Features Details

### Job Analysis with AI Hiring Agent

The AI agent (persona: senior technical recruiter) analyzes job descriptions to extract:
- Role and seniority level
- Technical skills and technologies
- Core competencies (mapped to 33-competency framework)
- Responsibilities and qualifications
- Interview focus recommendation

### Competency Framework

33 competencies across 7 categories:
- **Technical** (10): Full-Stack, Frontend, Backend, Cloud, Databases, DevOps, System Design, ML/AI, Security, Mobile
- **Leadership** (4): Team, Technical, Project Management, Strategic Thinking
- **Communication** (2): Technical Communication, Cross-functional Collaboration
- **Problem-Solving** (3): Analytical Thinking, Innovation, Performance Optimization
- **Collaboration** (2): Code Review, Mentorship
- **Adaptability** (2): Learning Agility, Change Management
- **Domain Expertise** (4): E-commerce, Fintech, Healthcare, SaaS

### Text-Based Interview System

- Question-by-question progression
- Chat-style interface
- No time limits
- **Intelligent Follow-up Questions**:
  - Automatically generated based on answer quality and content
  - Triggered by brief answers (< 30 words) or technical keywords
  - Maximum 2 follow-ups per main question
  - Visual indicators (🔍 icon) and special styling
  - Option to skip and move to next question
- Progress tracking
- Ctrl+Enter quick submission
- Automatic transcript generation (includes follow-ups for comprehensive feedback)

### AI-Powered Feedback

Evaluation across 5 categories (0-100 scoring):
- Communication Skills
- Technical Knowledge
- Problem Solving
- Cultural & Role Fit
- Confidence & Clarity

Includes: strengths, areas for improvement, final assessment

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

## AWS Bedrock Setup

1. Go to AWS Console → Bedrock → Model access
2. Request access to Claude 3.5 Sonnet
3. Create IAM user with `bedrock:InvokeModel` permission
4. Generate access keys
5. Add to `.env` file

See [README_BEDROCK.md](./README_BEDROCK.md) for detailed setup guide.

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Architecture and technical details
- [README_BEDROCK.md](./README_BEDROCK.md) - AWS Bedrock setup guide
- [README_JOB_ANALYSIS.md](./README_JOB_ANALYSIS.md) - Job analysis feature details

## Migration History

This project has been migrated from:
- **Firebase** → SQLite with Prisma ORM
- **Google Gemini** → AWS Bedrock (Claude)
- **Vapi Voice Agents** → Text-based interviews

All dependencies are now local or AWS-based, with no Firebase or Google AI services required.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
