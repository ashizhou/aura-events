/**
 * Comprehensive Competencies Database
 * Used by the AI hiring agent to map job requirements to standardized competencies
 */

export interface Competency {
  id: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  keywords: string[]; // For matching against job descriptions
  relatedSkills: string[];
}

export type CompetencyCategory =
  | "technical"
  | "leadership"
  | "communication"
  | "problem-solving"
  | "collaboration"
  | "adaptability"
  | "domain-expertise";

export const COMPETENCIES_DATABASE: Competency[] = [
  // Technical Competencies
  {
    id: "tech-001",
    name: "Full-Stack Development",
    category: "technical",
    description: "Ability to develop both frontend and backend applications",
    keywords: [
      "full stack",
      "full-stack",
      "frontend",
      "backend",
      "end-to-end development",
    ],
    relatedSkills: [
      "React",
      "Node.js",
      "TypeScript",
      "databases",
      "APIs",
      "REST",
      "GraphQL",
    ],
  },
  {
    id: "tech-002",
    name: "Frontend Development",
    category: "technical",
    description: "Building user interfaces and client-side applications",
    keywords: [
      "frontend",
      "front-end",
      "UI",
      "user interface",
      "client-side",
      "web development",
    ],
    relatedSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Vue",
      "Angular",
      "TypeScript",
    ],
  },
  {
    id: "tech-003",
    name: "Backend Development",
    category: "technical",
    description: "Server-side development and API design",
    keywords: [
      "backend",
      "back-end",
      "server-side",
      "API",
      "microservices",
      "server",
    ],
    relatedSkills: [
      "Node.js",
      "Python",
      "Java",
      "Go",
      "databases",
      "REST",
      "GraphQL",
    ],
  },
  {
    id: "tech-004",
    name: "Cloud Architecture",
    category: "technical",
    description: "Designing and implementing cloud-based solutions",
    keywords: [
      "cloud",
      "AWS",
      "Azure",
      "GCP",
      "cloud architecture",
      "infrastructure",
      "serverless",
    ],
    relatedSkills: [
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
    ],
  },
  {
    id: "tech-005",
    name: "Database Design & Management",
    category: "technical",
    description: "Database architecture, optimization, and management",
    keywords: [
      "database",
      "SQL",
      "NoSQL",
      "data modeling",
      "database design",
      "data management",
    ],
    relatedSkills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "DynamoDB",
      "database optimization",
    ],
  },
  {
    id: "tech-006",
    name: "DevOps & Infrastructure",
    category: "technical",
    description: "Build, deployment, and operational excellence",
    keywords: [
      "DevOps",
      "CI/CD",
      "deployment",
      "infrastructure",
      "automation",
      "monitoring",
    ],
    relatedSkills: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI",
      "Terraform",
      "Ansible",
    ],
  },
  {
    id: "tech-007",
    name: "System Design",
    category: "technical",
    description: "Designing scalable and reliable distributed systems",
    keywords: [
      "system design",
      "architecture",
      "scalability",
      "distributed systems",
      "high availability",
    ],
    relatedSkills: [
      "microservices",
      "load balancing",
      "caching",
      "message queues",
      "databases",
    ],
  },
  {
    id: "tech-008",
    name: "Machine Learning & AI",
    category: "technical",
    description: "Developing and deploying ML models and AI systems",
    keywords: [
      "machine learning",
      "ML",
      "AI",
      "artificial intelligence",
      "deep learning",
      "data science",
    ],
    relatedSkills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "scikit-learn",
      "NLP",
      "computer vision",
    ],
  },
  {
    id: "tech-009",
    name: "Security & Compliance",
    category: "technical",
    description: "Application security and regulatory compliance",
    keywords: [
      "security",
      "cybersecurity",
      "compliance",
      "authentication",
      "authorization",
      "encryption",
    ],
    relatedSkills: [
      "OAuth",
      "JWT",
      "SSL/TLS",
      "penetration testing",
      "GDPR",
      "HIPAA",
    ],
  },
  {
    id: "tech-010",
    name: "Mobile Development",
    category: "technical",
    description: "Building native and cross-platform mobile applications",
    keywords: [
      "mobile",
      "iOS",
      "Android",
      "mobile development",
      "app development",
    ],
    relatedSkills: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "mobile UI/UX",
    ],
  },

  // Leadership Competencies
  {
    id: "lead-001",
    name: "Team Leadership",
    category: "leadership",
    description: "Leading and mentoring engineering teams",
    keywords: [
      "leadership",
      "team lead",
      "mentor",
      "coaching",
      "people management",
    ],
    relatedSkills: [
      "mentoring",
      "performance reviews",
      "team building",
      "conflict resolution",
    ],
  },
  {
    id: "lead-002",
    name: "Technical Leadership",
    category: "leadership",
    description: "Setting technical direction and standards",
    keywords: [
      "technical leadership",
      "architecture",
      "technical direction",
      "tech lead",
      "staff engineer",
    ],
    relatedSkills: [
      "architecture design",
      "code review",
      "best practices",
      "technical strategy",
    ],
  },
  {
    id: "lead-003",
    name: "Project Management",
    category: "leadership",
    description: "Planning, executing, and delivering projects",
    keywords: [
      "project management",
      "agile",
      "scrum",
      "planning",
      "execution",
      "delivery",
    ],
    relatedSkills: ["Agile", "Scrum", "Kanban", "Jira", "project planning"],
  },
  {
    id: "lead-004",
    name: "Strategic Thinking",
    category: "leadership",
    description: "Long-term planning and strategic decision-making",
    keywords: [
      "strategy",
      "strategic thinking",
      "vision",
      "roadmap",
      "long-term planning",
    ],
    relatedSkills: [
      "roadmap planning",
      "stakeholder management",
      "business acumen",
    ],
  },

  // Communication Competencies
  {
    id: "comm-001",
    name: "Technical Communication",
    category: "communication",
    description: "Explaining technical concepts to various audiences",
    keywords: [
      "communication",
      "technical writing",
      "documentation",
      "presentation",
      "stakeholder communication",
    ],
    relatedSkills: [
      "documentation",
      "presentations",
      "technical writing",
      "stakeholder management",
    ],
  },
  {
    id: "comm-002",
    name: "Cross-functional Collaboration",
    category: "communication",
    description: "Working effectively across different teams",
    keywords: [
      "cross-functional",
      "collaboration",
      "teamwork",
      "interdisciplinary",
      "stakeholder engagement",
    ],
    relatedSkills: ["stakeholder management", "negotiation", "influence"],
  },

  // Problem-Solving Competencies
  {
    id: "prob-001",
    name: "Analytical Thinking",
    category: "problem-solving",
    description: "Breaking down complex problems systematically",
    keywords: [
      "analytical",
      "analysis",
      "problem-solving",
      "critical thinking",
      "troubleshooting",
    ],
    relatedSkills: ["debugging", "root cause analysis", "data analysis"],
  },
  {
    id: "prob-002",
    name: "Innovation & Creativity",
    category: "problem-solving",
    description: "Developing novel solutions to challenges",
    keywords: [
      "innovation",
      "creative",
      "innovative solutions",
      "out-of-the-box thinking",
    ],
    relatedSkills: [
      "prototyping",
      "experimentation",
      "design thinking",
    ],
  },
  {
    id: "prob-003",
    name: "Performance Optimization",
    category: "problem-solving",
    description: "Identifying and resolving performance bottlenecks",
    keywords: [
      "optimization",
      "performance",
      "scalability",
      "efficiency",
      "bottleneck",
    ],
    relatedSkills: [
      "profiling",
      "caching",
      "algorithm optimization",
      "load testing",
    ],
  },

  // Collaboration Competencies
  {
    id: "collab-001",
    name: "Code Review & Quality",
    category: "collaboration",
    description: "Providing and receiving constructive code feedback",
    keywords: [
      "code review",
      "peer review",
      "quality assurance",
      "best practices",
    ],
    relatedSkills: ["code review", "testing", "quality standards", "Git"],
  },
  {
    id: "collab-002",
    name: "Mentorship & Knowledge Sharing",
    category: "collaboration",
    description: "Teaching and developing other engineers",
    keywords: [
      "mentorship",
      "mentoring",
      "teaching",
      "knowledge sharing",
      "training",
    ],
    relatedSkills: ["coaching", "documentation", "pair programming", "workshops"],
  },

  // Adaptability Competencies
  {
    id: "adapt-001",
    name: "Learning Agility",
    category: "adaptability",
    description: "Quickly learning new technologies and domains",
    keywords: [
      "learning",
      "adaptability",
      "quick learner",
      "continuous learning",
      "growth mindset",
    ],
    relatedSkills: ["self-learning", "research", "experimentation"],
  },
  {
    id: "adapt-002",
    name: "Change Management",
    category: "adaptability",
    description: "Managing and driving organizational change",
    keywords: [
      "change management",
      "transformation",
      "adoption",
      "organizational change",
    ],
    relatedSkills: ["stakeholder management", "communication", "training"],
  },

  // Domain Expertise
  {
    id: "domain-001",
    name: "E-commerce & Retail",
    category: "domain-expertise",
    description: "Experience in e-commerce and retail systems",
    keywords: [
      "e-commerce",
      "retail",
      "online shopping",
      "payment systems",
      "inventory",
    ],
    relatedSkills: [
      "payment processing",
      "inventory management",
      "order fulfillment",
    ],
  },
  {
    id: "domain-002",
    name: "Financial Technology",
    category: "domain-expertise",
    description: "Experience in fintech and financial services",
    keywords: [
      "fintech",
      "finance",
      "banking",
      "payments",
      "financial services",
    ],
    relatedSkills: ["payment processing", "compliance", "security", "fraud detection"],
  },
  {
    id: "domain-003",
    name: "Healthcare & Medical",
    category: "domain-expertise",
    description: "Experience in healthcare technology",
    keywords: ["healthcare", "medical", "health tech", "telemedicine", "EHR"],
    relatedSkills: ["HIPAA compliance", "medical data", "patient systems"],
  },
  {
    id: "domain-004",
    name: "Enterprise SaaS",
    category: "domain-expertise",
    description: "Building enterprise software as a service",
    keywords: ["SaaS", "B2B", "enterprise software", "multi-tenant"],
    relatedSkills: ["multi-tenancy", "RBAC", "enterprise integrations"],
  },
];

// Helper function to search competencies
export function findCompetenciesByKeywords(keywords: string[]): Competency[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  return COMPETENCIES_DATABASE.filter((competency) => {
    return competency.keywords.some((keyword) =>
      lowerKeywords.some((searchKeyword) =>
        keyword.toLowerCase().includes(searchKeyword) ||
        searchKeyword.includes(keyword.toLowerCase())
      )
    );
  });
}

// Get competencies by category
export function getCompetenciesByCategory(
  category: CompetencyCategory
): Competency[] {
  return COMPETENCIES_DATABASE.filter((c) => c.category === category);
}
