import type { DashboardData } from './schemas';

export const MOCK_EXAMPLE_DATA: DashboardData = {
  profileSummary: "An ambitious, technology-driven profile matching the path of an AI & Full-Stack Systems Architect. This individual exhibits strong problem-solving inclinations, high numerical and analytical aptitude, and is best positioned in fast-growing software ecosystems with an emphasis on large language models (LLMs) and reliable cloud infrastructures.",
  userCategory: "student",
  careerPathways: [
    {
      title: "AI Systems Architect",
      category: "Research & Industry",
      reasoning: "Exceptional mathematical and code transferability scores with deep interest in deep learning models and distributed software networks.",
      matchPercentage: 98,
      salaryRange: "$140,000 - $210,000",
      marketDemand: "Exponentially Rising",
      requiredSkills: ["PyTorch", "Python", "Transformers", "MLOps", "LLMs", "Vector Databases"],
      sourceIds: ["src-1", "src-2"]
    },
    {
      title: "Senior Full-Stack Architect",
      category: "Creative & Engineering",
      reasoning: "Matches strong layout interests and dynamic UI execution alongside cloud database microservices.",
      matchPercentage: 94,
      salaryRange: "$120,000 - $180,000",
      marketDemand: "Consistently Stable",
      requiredSkills: ["Next.js", "TypeScript", "React", "PostgreSQL", "Docker", "AWS"],
      sourceIds: ["src-3"]
    }
  ],
  education: {
    degrees: [
      {
        level: "Bachelor",
        field: "Computer Science & Artificial Intelligence",
        duration: "4 Years",
        description: "Focus on machine learning models, database schema structures, and robust distributed cloud services.",
        applyUrl: "https://www.stanford.edu"
      }
    ],
    certifications: [
      {
        name: "Deep Learning Specialization",
        provider: "DeepLearning.AI",
        relevance: "Core theoretical and practical neural network knowledge, covering convolutional networks, sequence models, and transformer tuning.",
        courseUrl: "https://www.coursera.org/specializations/deep-learning",
        estimatedHours: "80 Hours",
        cost: "Free Audit"
      },
      {
        name: "Next.js Production-Ready Architect",
        provider: "Vercel Academy",
        relevance: "Teaches advanced server action architecture, routing optimization, and incremental static regeneration.",
        courseUrl: "https://nextjs.org/learn",
        estimatedHours: "25 Hours",
        cost: "Free"
      }
    ]
  },
  topUniversities: [
    {
      name: "Stanford University",
      location: "Stanford, CA",
      ranking: "#1 in Computer Science",
      averageFees: "$58,000/yr",
      topPrograms: ["B.S. in Computer Science (AI Track)", "M.S. in Artificial Intelligence"],
      websiteUrl: "https://www.stanford.edu",
      applicationDeadline: "January 5",
      scholarshipAvailable: true
    },
    {
      name: "Carnegie Mellon University",
      location: "Pittsburgh, PA",
      ranking: "#2 in Computer Science",
      averageFees: "$62,000/yr",
      topPrograms: ["B.S. in Artificial Intelligence", "M.S. in Machine Learning"],
      websiteUrl: "https://www.cmu.edu",
      applicationDeadline: "January 1",
      scholarshipAvailable: true
    }
  ],
  jobs: [
    {
      role: "Lead Machine Learning Engineer",
      relatedDegree: "B.S. or M.S. in Computer Science (AI Track)",
      entrySalary: "$130,000/yr",
      growthPath: "ML Engineer ➔ AI Architect ➔ VP of Artificial Intelligence",
      demandTrend: "rising",
      skillsRequired: ["PyTorch", "Python", "Transformers", "Kubernetes"],
      jobPortalLinks: [
        { portal: "LinkedIn", url: "https://www.linkedin.com/jobs/search/?keywords=AI%20Engineer" },
        { portal: "Indeed", url: "https://www.indeed.com/jobs?q=Machine+Learning+Engineer" }
      ],
      averageOpenings: "4,200 active openings as of 2026"
    },
    {
      role: "Lead Full-Stack Developer",
      relatedDegree: "B.S. in Computer Science",
      entrySalary: "$110,000/yr",
      growthPath: "Full-Stack Developer ➔ Systems Architect ➔ Chief Technology Officer",
      demandTrend: "rising",
      skillsRequired: ["Next.js", "TypeScript", "React", "PostgreSQL"],
      jobPortalLinks: [
        { portal: "LinkedIn", url: "https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Architect" }
      ],
      averageOpenings: "6,500 active openings as of 2026"
    }
  ],
  skillGaps: {
    currentSkills: ["JavaScript", "Python", "HTML/CSS", "Git", "Basic SQL"],
    neededSkills: ["Next.js", "TypeScript", "PyTorch", "Transformers", "Docker", "Kubernetes", "MLOps"],
    roadmap: [
      {
        year: "Year 1",
        title: "Mastering Next-Gen Client/Server Web Stacks",
        focusAreas: ["TypeScript Type-Safety", "Next.js Server Actions", "PostgreSQL schema designs"],
        milestones: [
          "Complete Next.js Production-Ready Architect Course",
          "Build a fully responsive real-time data visualizer with Prisma"
        ],
        resourceLinks: [
          { label: "Next.js Official Documentation Guide", url: "https://nextjs.org/docs" }
        ]
      },
      {
        year: "Year 2",
        title: "Deep Learning Foundations & Model Tuning",
        focusAreas: ["Neural Networks", "Tensor Manipulations", "Weights & Biases monitoring"],
        milestones: [
          "Complete Deep Learning Specialization",
          "Train and evaluate a custom Transformer from scratch on a subset of HuggingFace"
        ],
        resourceLinks: [
          { label: "PyTorch Official Getting Started Guide", url: "https://pytorch.org/get-started" }
        ]
      },
      {
        year: "Year 3",
        title: "Model Productionization & MLOps Orchestration",
        focusAreas: ["Docker Containers", "Kubernetes Clusters", "Quantization", "Model API deployment"],
        milestones: [
          "Package full-stack AI models into multi-container Docker applications",
          "Deploy an LLM API endpoint featuring secure session authorization"
        ]
      }
    ]
  },
  socialReviews: [
    {
      source: "Reddit",
      author: "u/ai_eng_guru",
      sentiment: "positive",
      content: "Building custom transformers in PyTorch is currently the most valuable skill set in the industry. Traditional software devs are pivoting fast because companies pay massive premiums for engineers who understand weights and fine-tuning rather than just calling OpenAI's API.",
      relatedTopic: "AI Systems Architecture",
      url: "https://reddit.com"
    },
    {
      source: "LinkedIn",
      author: "Sarah Jenkins (Recruitment Partner)",
      sentiment: "positive",
      content: "We are struggling to find engineers who understand both Next.js/React and deep learning pipelines. Candidates who can span both the client state and the machine learning model side are instantly fast-tracked to Lead Architect roles.",
      relatedTopic: "Lead ML & Web Engineering",
      url: "https://linkedin.com"
    }
  ],
  sources: [
    {
      id: "src-1",
      title: "Hiring Trends for AI and MLOps Engineers 2026",
      url: "https://www.linkedin.com",
      domain: "linkedin.com",
      snippet: "Surge in demands for engineers capable of maintaining active GPU cluster infrastructures and orchestrating MLOps environments."
    },
    {
      id: "src-2",
      title: "AI Salary and Compensation Survey 2025",
      url: "https://www.indeed.com",
      domain: "indeed.com",
      snippet: "Machine learning engineers and AI architects report a 22% average salary premium compared to standard systems engineers."
    },
    {
      id: "src-3",
      title: "The Shift to Next-Gen Server Architectures",
      url: "https://nextjs.org",
      domain: "nextjs.org",
      snippet: "Full-stack frameworks leveraging server actions and component co-location represent over 72% of new commercial web applications."
    }
  ]
};
