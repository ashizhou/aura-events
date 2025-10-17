# Job Analysis & Competency Extraction

This feature adds intelligent job description analysis powered by AWS Bedrock, enabling targeted interview preparation based on extracted competencies.

## Overview

The AI Hiring Agent analyzes job descriptions to extract:
- **Role & Level**: Job title and seniority (Intern → Principal)
- **Technical Skills**: All technologies and tools mentioned
- **Core Competencies**: Mapped to standardized competency framework
- **Responsibilities**: Key duties and expectations
- **Qualifications**: Required experience and education
- **Interview Recommendations**: Focus area and question count

## User Flow

```
1. Upload Job Description
   ↓
2. AI Analysis (AWS Bedrock)
   ↓
3. Competency Extraction & Matching
   ↓
4. Store Analysis Results
   ↓
5. Create Targeted Interview
   ↓
6. Practice with Voice Agent
   ↓
7. Receive AI Feedback
```

## Competency Framework

### 7 Categories, 33 Competencies

**Technical (10)**
- Full-Stack Development, Frontend, Backend
- Cloud Architecture, Database Design & Management
- DevOps & Infrastructure, System Design
- Machine Learning & AI, Security & Compliance, Mobile Development

**Leadership (4)**
- Team Leadership, Technical Leadership
- Project Management, Strategic Thinking

**Communication (2)**
- Technical Communication
- Cross-functional Collaboration

**Problem-Solving (3)**
- Analytical Thinking
- Innovation & Creativity
- Performance Optimization

**Collaboration (2)**
- Code Review & Quality
- Mentorship & Knowledge Sharing

**Adaptability (2)**
- Learning Agility
- Change Management

**Domain Expertise (4)**
- E-commerce & Retail
- Financial Technology
- Healthcare & Medical
- Enterprise SaaS

## How It Works

### 1. Job Description Analysis

The AI Hiring Agent (persona: senior technical recruiter) receives:
- Complete job description text
- Access to competencies database
- Context about standardized frameworks

It extracts structured data using AWS Bedrock with Zod validation:

```typescript
{
  role: "Senior Full-Stack Engineer",
  level: "Senior",
  company: "TechCorp",
  extractedSkills: ["React", "Node.js", "AWS", "PostgreSQL"],
  coreCompetencyIds: ["tech-001", "tech-004", "lead-002"],
  responsibilities: ["Build scalable APIs", "Lead technical design"],
  qualifications: ["5+ years experience", "CS degree or equivalent"],
  niceToHave: ["GraphQL experience", "Team leadership"],
  interviewFocus: "mixed",
  suggestedQuestionCount: 10
}
```

### 2. Competency Matching

The system:
1. Analyzes job description keywords
2. Matches to competency database IDs
3. Returns full competency objects with:
   - Name & category
   - Description
   - Related skills
   - Keywords for future matching

### 3. Targeted Interview Generation

Interview questions are enhanced with competency context:

```typescript
// Without job analysis
"Prepare questions for a Senior Full-Stack Engineer..."

// With job analysis
"Prepare questions for a Senior Full-Stack Engineer...
Key competencies: Full-Stack Development, Cloud Architecture, Technical Leadership.
Please ensure questions assess these competencies effectively."
```

## API Endpoints

### POST /api/analyze-job

Analyzes a job description and stores results.

**Request**:
```json
{
  "jobDescription": "We're looking for a Senior Full-Stack Engineer..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cuid...",
    "role": "Senior Full-Stack Engineer",
    "level": "Senior",
    "company": "TechCorp",
    "extractedSkills": ["React", "Node.js", "AWS"],
    "coreCompetencies": [
      {
        "id": "tech-001",
        "name": "Full-Stack Development",
        "category": "technical"
      }
    ],
    "responsibilities": [...],
    "qualifications": [...],
    "niceToHave": [...],
    "interviewFocus": "mixed",
    "suggestedQuestionCount": 10
  }
}
```

## UI Components

### `/analyze-job` Page

**Features**:
- Modern two-column layout (input | results)
- Real-time character count
- AI agent persona display
- Live analysis results
- Direct "Create Interview" CTA

**Design**:
- Follows OpenAI/Claude design patterns
- Dark mode with gradient cards
- Responsive grid layout
- Clear visual hierarchy
- Loading states with animations

### Dashboard Integration

**Job Analyses Section**:
- Card-based display of past analyses
- Shows: role, level, company, competency count
- Quick actions: "Create Interview", "View Details"
- Empty state with CTA to analyze first job

## Database Schema

```prisma
model JobAnalysis {
  id                  String   @id @default(cuid())
  userId              String
  jobDescription      String
  role                String
  level               String
  company             String?
  extractedSkills     String   // JSON array
  coreCompetencies    String   // JSON array
  responsibilities    String   // JSON array
  qualifications      String   // JSON array
  niceToHave          String   // JSON array
  analyzedAt          DateTime @default(now())

  user       User        @relation(...)
  interviews Interview[]

  @@index([userId])
  @@index([analyzedAt])
}
```

## Prompt Engineering

### System Prompt (Hiring Agent)
```
You are an expert technical recruiter and hiring manager with 15+ years of experience in the technology industry. You have:

- Deep expertise in identifying job competencies from descriptions
- Strong understanding of technical roles, skills, and career levels
- Ability to match job requirements to standardized competency frameworks
- Experience hiring for companies like Google, Amazon, Meta, OpenAI, and Anthropic

Your task is to analyze job descriptions and extract structured information that will be used to create tailored interview questions.

COMPETENCIES DATABASE:
[33 competencies with IDs, names, categories, descriptions]

IMPORTANT INSTRUCTIONS:
1. Carefully read the job description
2. Extract the exact role title and experience level
3. Identify all technical skills and technologies mentioned
4. Match the job requirements to competencies from the database above (use the competency IDs)
5. Extract key responsibilities and qualifications
6. Determine the appropriate interview focus (technical vs behavioral)
7. Suggest an appropriate number of interview questions based on role seniority
```

### User Prompt
```
Analyze the following job description and extract structured information:

JOB DESCRIPTION:
"""
[Job description text]
"""

Please provide a comprehensive analysis with:
1. Role title and experience level
2. All technical skills mentioned
3. Matching competency IDs from the database (select 3-8 most relevant)
4. Key responsibilities
5. Required qualifications
6. Nice-to-have skills
7. Interview focus recommendation
8. Suggested number of interview questions

Be thorough but concise. Focus on accuracy and relevance.
```

## Benefits

1. **Targeted Preparation**: Questions aligned with actual job requirements
2. **Competency-Based**: Focus on standardized, transferable skills
3. **Time-Saving**: Automatic extraction vs manual analysis
4. **Comprehensive**: Captures technical + behavioral requirements
5. **Reusable**: One analysis → multiple interview sessions
6. **Data-Driven**: Track which competencies appear most often

## Future Enhancements

- **Resume Matching**: Compare resume against job requirements
- **Gap Analysis**: Identify missing skills/competencies
- **Learning Paths**: Suggest resources to fill gaps
- **Market Analysis**: Compare requirements across similar roles
- **Salary Insights**: Estimate compensation based on requirements
