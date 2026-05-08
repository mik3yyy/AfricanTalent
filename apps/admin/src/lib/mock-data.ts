export type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlist";
export type SubscriptionTier = "standard" | "featured";
export type CompanyPlan = "scout" | "recruiter" | "enterprise";
export type MemberStatus = "active" | "suspended" | "inactive";
export type CompanyStatus = "active" | "trial" | "suspended" | "cancelled";

export interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  country: string;
  experience: string; // "2 years", "5+ years"
  appliedDate: string;
  status: ApplicationStatus;
  avatar: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  whyJoin: string;
  skills: string[];
  bio: string;
  yearsExperience: number;
  portfolioProjects: PortfolioProject[];
  adminNotes?: string;
  rejectionReason?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  country: string;
  subscriptionTier: SubscriptionTier;
  status: MemberStatus;
  profileViews: number;
  joinedDate: string;
  avatar: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio: string;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  website: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  contactsUsed: number;
  contactLimit: number;
  joinedDate: string;
  logo?: string;
  industry: string;
  teamSize: string;
  primaryContact: string;
  email: string;
  country: string;
  talentsHired: number;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  location: string;
  joinedDate: string;
  referral?: string;
}

export interface Cohort {
  id: string;
  number: number;
  name: string;
  maxSize: number;
  applicantsCount: number;
  approvedCount: number;
  openDate: string;
  closeDate: string;
  isOpen: boolean;
  status: "active" | "closed" | "upcoming";
}

// ─── Mock Applications (20) ─────────────────────────────────────────────────

export const mockApplications: Application[] = [
  {
    id: "app-001",
    name: "Amara Osei",
    email: "amara.osei@gmail.com",
    role: "Full-Stack Engineer",
    location: "Accra, Ghana",
    country: "Ghana",
    experience: "5 years",
    yearsExperience: 5,
    appliedDate: "2025-04-28T09:15:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/amaraosei",
    linkedinUrl: "https://linkedin.com/in/amaraosei",
    portfolioUrl: "https://amaraosei.dev",
    whyJoin:
      "I want to connect with global companies that value remote-first culture. After 5 years building products for West African fintech startups, I am ready to take my skills to a global stage while staying rooted in Africa.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    bio: "Full-stack engineer specializing in fintech and e-commerce platforms. I have led engineering teams at two Y Combinator-backed startups and shipped products used by over 200,000 users.",
    portfolioProjects: [
      {
        id: "proj-001",
        title: "PesaPay — Mobile Money API",
        description: "Built a unified API aggregating 6 mobile money providers across West Africa. Processed $2M+ in transactions.",
        url: "https://pesapay.io",
        technologies: ["Node.js", "PostgreSQL", "Redis", "AWS Lambda"],
      },
      {
        id: "proj-002",
        title: "MarketPlace Ghana",
        description: "An e-commerce platform for Ghanaian artisans with integrated mobile payment and delivery tracking.",
        url: "https://marketplacegh.com",
        technologies: ["React", "Next.js", "Stripe", "Prisma"],
      },
    ],
  },
  {
    id: "app-002",
    name: "Ngozi Adeyemi",
    email: "ngozi.adeyemi@outlook.com",
    role: "Product Designer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    experience: "4 years",
    yearsExperience: 4,
    appliedDate: "2025-04-27T14:30:00Z",
    status: "approved",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/ngoziadeyemi",
    portfolioUrl: "https://ngozi.design",
    whyJoin:
      "I believe African designers bring a unique perspective that global products desperately need. I want to work with companies that appreciate user-centered design and cultural nuance.",
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "Framer", "Notion"],
    bio: "Product designer with a focus on mobile-first experiences for emerging markets. Previously at Flutterwave and Paystack.",
    portfolioProjects: [
      {
        id: "proj-003",
        title: "Flutterwave Checkout Redesign",
        description: "Led the redesign of Flutterwave's checkout flow, improving conversion by 23% across 34 African countries.",
        technologies: ["Figma", "Principle", "User Testing"],
      },
      {
        id: "proj-004",
        title: "Agro-Connect Design System",
        description: "Built a complete design system for an agri-tech platform serving 50,000+ smallholder farmers.",
        technologies: ["Figma", "Storybook", "React"],
      },
    ],
    rejectionReason: undefined,
  },
  {
    id: "app-003",
    name: "Kofi Mensah",
    email: "kofi.mensah@protonmail.com",
    role: "Backend Engineer",
    location: "Kumasi, Ghana",
    country: "Ghana",
    experience: "3 years",
    yearsExperience: 3,
    appliedDate: "2025-04-26T11:00:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/kofimensah",
    whyJoin:
      "Remote work has given me the freedom to build products I am proud of while living in Kumasi. I want to continue doing that with world-class teams.",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Redis", "Kubernetes"],
    bio: "Backend engineer specializing in high-throughput APIs and microservices. Open-source contributor to the Django ecosystem.",
    portfolioProjects: [
      {
        id: "proj-005",
        title: "LogiTrack API",
        description: "REST API for a logistics company handling 10,000+ shipments daily. Reduced query time by 60% through caching.",
        technologies: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
      },
    ],
  },
  {
    id: "app-004",
    name: "Fatima Al-Hassan",
    email: "fatima.alhassan@gmail.com",
    role: "Data Scientist",
    location: "Nairobi, Kenya",
    country: "Kenya",
    experience: "6 years",
    yearsExperience: 6,
    appliedDate: "2025-04-25T08:45:00Z",
    status: "approved",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/fatimaalhassan",
    portfolioUrl: "https://fatima.ml",
    whyJoin:
      "The African tech scene produces some of the most creative data scientists in the world. Platforms like this are essential for bridging the visibility gap.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Spark", "Tableau"],
    bio: "Data scientist with expertise in NLP and computer vision for African language models. PhD candidate at University of Nairobi.",
    portfolioProjects: [
      {
        id: "proj-006",
        title: "SwahiliNLP",
        description: "Open-source NLP toolkit for Swahili with 50,000+ GitHub stars. Used by researchers at Google and Microsoft.",
        url: "https://github.com/swahilinlp",
        technologies: ["Python", "PyTorch", "HuggingFace"],
      },
    ],
  },
  {
    id: "app-005",
    name: "Emeka Okonkwo",
    email: "emeka.okonkwo@gmail.com",
    role: "DevOps Engineer",
    location: "Port Harcourt, Nigeria",
    country: "Nigeria",
    experience: "4 years",
    yearsExperience: 4,
    appliedDate: "2025-04-24T16:20:00Z",
    status: "waitlist",
    avatar: "",
    githubUrl: "https://github.com/emekaops",
    linkedinUrl: "https://linkedin.com/in/emekaokonkwo",
    whyJoin:
      "Infrastructure work is invisible until it breaks. I want to work with teams that value proactive reliability engineering and understand the value of good DevOps culture.",
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Prometheus", "Grafana"],
    bio: "DevOps engineer focused on cloud-native infrastructure and site reliability. Certified AWS Solutions Architect and Kubernetes Administrator.",
    portfolioProjects: [
      {
        id: "proj-007",
        title: "Zero-Downtime Migration",
        description: "Migrated a monolith serving 500K users to microservices on EKS with zero downtime over 3 months.",
        technologies: ["AWS EKS", "Terraform", "ArgoCD"],
      },
    ],
  },
  {
    id: "app-006",
    name: "Aisha Diallo",
    email: "aisha.diallo@gmail.com",
    role: "Mobile Engineer (iOS)",
    location: "Dakar, Senegal",
    country: "Senegal",
    experience: "5 years",
    yearsExperience: 5,
    appliedDate: "2025-04-23T10:30:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/aishadiallo",
    portfolioUrl: "https://aishadiallo.dev",
    whyJoin:
      "I want to bring West African design sensibilities to iOS apps used globally. Senegal has incredible tech talent that the world has not discovered yet.",
    skills: ["Swift", "SwiftUI", "UIKit", "Core Data", "Combine", "Xcode"],
    bio: "iOS engineer with 5 apps on the App Store. Focused on performance optimization and beautiful UI animations.",
    portfolioProjects: [
      {
        id: "proj-008",
        title: "WaveTransfer iOS",
        description: "Peer-to-peer money transfer app for Senegal. 200,000+ downloads, rated 4.8 on App Store.",
        technologies: ["Swift", "SwiftUI", "Core Data", "Combine"],
      },
    ],
  },
  {
    id: "app-007",
    name: "David Kariuki",
    email: "david.kariuki@outlook.com",
    role: "Full-Stack Engineer",
    location: "Nairobi, Kenya",
    country: "Kenya",
    experience: "7 years",
    yearsExperience: 7,
    appliedDate: "2025-04-22T13:15:00Z",
    status: "rejected",
    avatar: "",
    githubUrl: "https://github.com/davidkariuki",
    linkedinUrl: "https://linkedin.com/in/davidkariuki",
    whyJoin:
      "I have been building for East African markets for 7 years. I am ready to apply those learnings to global products.",
    skills: ["React", "Vue.js", "Laravel", "MySQL", "Docker", "GCP"],
    bio: "Senior full-stack engineer with deep expertise in East African payment systems and USSD integrations.",
    portfolioProjects: [
      {
        id: "proj-009",
        title: "M-Pesa Integration SDK",
        description: "Open-source SDK for M-Pesa integration used by 1,000+ Kenyan developers.",
        url: "https://github.com/mpesa-sdk",
        technologies: ["PHP", "Laravel", "Redis"],
      },
    ],
    rejectionReason: "Portfolio does not demonstrate sufficient experience with modern frontend frameworks.",
  },
  {
    id: "app-008",
    name: "Blessing Nwosu",
    email: "blessing.nwosu@gmail.com",
    role: "Product Manager",
    location: "Abuja, Nigeria",
    country: "Nigeria",
    experience: "6 years",
    yearsExperience: 6,
    appliedDate: "2025-04-21T09:00:00Z",
    status: "pending",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/blessingnwosu",
    whyJoin:
      "Product management in Africa requires resourcefulness that most global PMs never develop. I bring that scrappiness alongside world-class product thinking.",
    skills: ["Product Strategy", "Agile", "JIRA", "SQL", "Mixpanel", "Figma"],
    bio: "Product manager with experience leading 0-to-1 products at Nigerian startups. Previously at Konga and Andela.",
    portfolioProjects: [
      {
        id: "proj-010",
        title: "Konga Seller Platform",
        description: "Led the product for Konga's seller onboarding platform, increasing seller acquisition by 40% YoY.",
        technologies: ["JIRA", "Mixpanel", "SQL"],
      },
    ],
  },
  {
    id: "app-009",
    name: "Chisom Eze",
    email: "chisom.eze@gmail.com",
    role: "Frontend Engineer",
    location: "Enugu, Nigeria",
    country: "Nigeria",
    experience: "3 years",
    yearsExperience: 3,
    appliedDate: "2025-04-20T15:45:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/chisomeze",
    portfolioUrl: "https://chisom.dev",
    whyJoin:
      "I want to work on products that millions of people use daily. The platform's focus on curation means I will be working with companies that truly value quality.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Storybook"],
    bio: "Frontend engineer passionate about accessibility and web performance. Creator of React components used by 3,000+ developers.",
    portfolioProjects: [
      {
        id: "proj-011",
        title: "AccessibleUI Library",
        description: "Open-source React component library with WCAG 2.1 AA compliance out of the box.",
        url: "https://accessibleui.dev",
        technologies: ["React", "TypeScript", "Storybook"],
      },
    ],
  },
  {
    id: "app-010",
    name: "Moussa Traoré",
    email: "moussa.traore@gmail.com",
    role: "Backend Engineer",
    location: "Abidjan, Côte d'Ivoire",
    country: "Côte d'Ivoire",
    experience: "5 years",
    yearsExperience: 5,
    appliedDate: "2025-04-19T11:20:00Z",
    status: "approved",
    avatar: "",
    githubUrl: "https://github.com/moussatraore",
    whyJoin:
      "Francophone Africa is severely underrepresented in global tech. I want to be part of changing that narrative.",
    skills: ["Go", "gRPC", "PostgreSQL", "Kafka", "Docker", "AWS"],
    bio: "Backend engineer specializing in high-performance Go services. Built systems processing 1M+ events per day.",
    portfolioProjects: [
      {
        id: "proj-012",
        title: "EventStream Platform",
        description: "Real-time event processing platform for West African telecom companies. Handles 1M+ events/day.",
        technologies: ["Go", "Kafka", "PostgreSQL", "Kubernetes"],
      },
    ],
  },
  {
    id: "app-011",
    name: "Zanele Mokoena",
    email: "zanele.mokoena@gmail.com",
    role: "UX Researcher",
    location: "Johannesburg, South Africa",
    country: "South Africa",
    experience: "4 years",
    yearsExperience: 4,
    appliedDate: "2025-04-18T14:00:00Z",
    status: "pending",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/zanelemokoena",
    portfolioUrl: "https://zanele.research",
    whyJoin:
      "UX research in Africa surfaces insights that completely change product assumptions. I want to bring that depth to global companies.",
    skills: ["User Interviews", "Usability Testing", "Survey Design", "Figma", "Dovetail", "SQL"],
    bio: "UX researcher specializing in inclusive design for diverse African markets. MA in Human-Computer Interaction from UCT.",
    portfolioProjects: [
      {
        id: "proj-013",
        title: "Low-Bandwidth UX Patterns",
        description: "Published research on designing for 2G/3G environments, cited by Google's Android team.",
        technologies: ["Research", "Figma", "Dovetail"],
      },
    ],
  },
  {
    id: "app-012",
    name: "Seun Adesanya",
    email: "seun.adesanya@protonmail.com",
    role: "Machine Learning Engineer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    experience: "4 years",
    yearsExperience: 4,
    appliedDate: "2025-04-17T10:10:00Z",
    status: "waitlist",
    avatar: "",
    githubUrl: "https://github.com/seunadesanya",
    portfolioUrl: "https://seun.ai",
    whyJoin:
      "I am building ML models that understand African accents and languages. I want to work with teams that are building the future, not just optimizing the past.",
    skills: ["Python", "PyTorch", "MLflow", "Kubernetes", "GCP", "HuggingFace"],
    bio: "ML engineer focused on speech recognition and NLP for African languages. MSc in Machine Learning from Stellenbosch University.",
    portfolioProjects: [
      {
        id: "proj-014",
        title: "YorubaASR",
        description: "Automatic speech recognition model for Yoruba language with 94% word accuracy.",
        url: "https://github.com/yorubasr",
        technologies: ["PyTorch", "Wav2Vec2", "HuggingFace"],
      },
    ],
  },
  {
    id: "app-013",
    name: "Amina Coulibaly",
    email: "amina.coulibaly@gmail.com",
    role: "Product Designer",
    location: "Bamako, Mali",
    country: "Mali",
    experience: "3 years",
    yearsExperience: 3,
    appliedDate: "2025-04-16T09:30:00Z",
    status: "pending",
    avatar: "",
    portfolioUrl: "https://amina.design",
    whyJoin:
      "Good design should be accessible to everyone, everywhere. I design for the next billion users, not just Silicon Valley.",
    skills: ["Figma", "Adobe XD", "Illustration", "Motion Design", "Webflow"],
    bio: "Product designer with a background in traditional Malian art. Brings cultural richness to digital product design.",
    portfolioProjects: [
      {
        id: "proj-015",
        title: "AfriPay Design System",
        description: "Comprehensive design system for a pan-African payment platform with cultural design tokens.",
        technologies: ["Figma", "Storybook"],
      },
    ],
  },
  {
    id: "app-014",
    name: "Taiwo Akande",
    email: "taiwo.akande@outlook.com",
    role: "Security Engineer",
    location: "Ibadan, Nigeria",
    country: "Nigeria",
    experience: "6 years",
    yearsExperience: 6,
    appliedDate: "2025-04-15T16:00:00Z",
    status: "approved",
    avatar: "",
    githubUrl: "https://github.com/taiwoakande",
    linkedinUrl: "https://linkedin.com/in/taiwoakande",
    whyJoin:
      "Cybersecurity talent in Africa is world-class but overlooked. I want to work with global companies protecting critical infrastructure.",
    skills: ["Penetration Testing", "AWS Security", "SIEM", "Python", "Burp Suite", "Metasploit"],
    bio: "Security engineer and ethical hacker. OSCP and CISSP certified. Found critical vulnerabilities in Fortune 500 companies.",
    portfolioProjects: [
      {
        id: "proj-016",
        title: "AfriSOC Platform",
        description: "Security Operations Center platform for African financial institutions. Monitors 50+ banks.",
        technologies: ["Python", "Elasticsearch", "Grafana"],
      },
    ],
  },
  {
    id: "app-015",
    name: "Gbenga Fashola",
    email: "gbenga.fashola@gmail.com",
    role: "Full-Stack Engineer",
    location: "Ibadan, Nigeria",
    country: "Nigeria",
    experience: "2 years",
    yearsExperience: 2,
    appliedDate: "2025-04-14T11:45:00Z",
    status: "rejected",
    avatar: "",
    githubUrl: "https://github.com/gbengafashola",
    whyJoin: "I want to accelerate my career by working with experienced global teams.",
    skills: ["React", "Node.js", "MongoDB", "Express.js"],
    bio: "Junior full-stack engineer passionate about web development.",
    portfolioProjects: [
      {
        id: "proj-017",
        title: "Personal Blog",
        description: "A blog built with React and Node.js.",
        technologies: ["React", "Node.js", "MongoDB"],
      },
    ],
    rejectionReason: "Insufficient professional experience. Recommend reapplying after 2 more years of industry experience.",
  },
  {
    id: "app-016",
    name: "Nkechi Okafor",
    email: "nkechi.okafor@gmail.com",
    role: "Mobile Engineer (Android)",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    experience: "5 years",
    yearsExperience: 5,
    appliedDate: "2025-04-13T08:20:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/nkechiokafor",
    portfolioUrl: "https://nkechi.dev",
    whyJoin:
      "Android has 95% market share in Africa. I want to build experiences optimized for how Africans actually use their phones.",
    skills: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines", "Firebase", "Room"],
    bio: "Android engineer with a focus on offline-first apps for low-connectivity environments.",
    portfolioProjects: [
      {
        id: "proj-018",
        title: "OfflineMarket Android",
        description: "E-commerce app that works fully offline with background sync. 500,000+ downloads.",
        technologies: ["Kotlin", "Room", "WorkManager", "Firebase"],
      },
    ],
  },
  {
    id: "app-017",
    name: "Ibrahim Sow",
    email: "ibrahim.sow@gmail.com",
    role: "Cloud Architect",
    location: "Dakar, Senegal",
    country: "Senegal",
    experience: "8 years",
    yearsExperience: 8,
    appliedDate: "2025-04-12T13:30:00Z",
    status: "approved",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/ibrahimsow",
    whyJoin:
      "Eight years ago I left Senegal to work in France. I am coming back and want to prove you can build world-class infrastructure from Dakar.",
    skills: ["AWS", "GCP", "Azure", "Terraform", "Architecture Design", "Cost Optimization"],
    bio: "Cloud architect with certifications across AWS, GCP, and Azure. Designed infrastructure for companies processing $100M+ annually.",
    portfolioProjects: [
      {
        id: "proj-019",
        title: "Multi-Cloud ERP Migration",
        description: "Led migration of a French enterprise ERP to multi-cloud, saving €2M/year in infrastructure costs.",
        technologies: ["AWS", "GCP", "Terraform", "Kubernetes"],
      },
    ],
  },
  {
    id: "app-018",
    name: "Adaeze Nnamdi",
    email: "adaeze.nnamdi@gmail.com",
    role: "Data Engineer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    experience: "4 years",
    yearsExperience: 4,
    appliedDate: "2025-04-11T10:00:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/adaezennamdi",
    linkedinUrl: "https://linkedin.com/in/adaezennamdi",
    whyJoin:
      "Data is Africa's untapped resource. I want to help global companies understand African markets through better data engineering.",
    skills: ["dbt", "Airflow", "Spark", "BigQuery", "Python", "Snowflake"],
    bio: "Data engineer specializing in building scalable data platforms. Previously at Interswitch.",
    portfolioProjects: [
      {
        id: "proj-020",
        title: "Interswitch Data Platform",
        description: "Built the central data platform processing 5M+ daily transactions for Nigeria's largest payment processor.",
        technologies: ["dbt", "Airflow", "BigQuery", "Python"],
      },
    ],
  },
  {
    id: "app-019",
    name: "Kwame Asante",
    email: "kwame.asante@gmail.com",
    role: "Backend Engineer",
    location: "Accra, Ghana",
    country: "Ghana",
    experience: "6 years",
    yearsExperience: 6,
    appliedDate: "2025-04-10T14:15:00Z",
    status: "waitlist",
    avatar: "",
    githubUrl: "https://github.com/kwameasante",
    portfolioUrl: "https://kwameasante.dev",
    whyJoin:
      "Ghana's startup ecosystem has matured enormously. I am ready to bring my experience to global teams while contributing back to the ecosystem.",
    skills: ["Rust", "Go", "PostgreSQL", "gRPC", "Kafka", "AWS"],
    bio: "Systems engineer with expertise in high-performance backend services. Rust enthusiast building the future of African fintech.",
    portfolioProjects: [
      {
        id: "proj-021",
        title: "FintechCore Rust Engine",
        description: "Transaction processing engine in Rust handling 500K TPS with sub-millisecond latency.",
        technologies: ["Rust", "PostgreSQL", "Kafka"],
      },
    ],
  },
  {
    id: "app-020",
    name: "Olumide Adeyemo",
    email: "olumide.adeyemo@gmail.com",
    role: "Technical Lead",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    experience: "9 years",
    yearsExperience: 9,
    appliedDate: "2025-04-09T09:45:00Z",
    status: "pending",
    avatar: "",
    githubUrl: "https://github.com/olumideadeyemo",
    linkedinUrl: "https://linkedin.com/in/olumideadeyemo",
    portfolioUrl: "https://olumide.io",
    whyJoin:
      "I have led engineering teams of up to 25 people. I want to bring that leadership experience to global teams while mentoring the next generation of African engineers.",
    skills: ["Engineering Leadership", "System Design", "React", "Node.js", "AWS", "PostgreSQL"],
    bio: "Technical leader and software architect with 9 years of experience. Former VP of Engineering at a Nigerian unicorn.",
    portfolioProjects: [
      {
        id: "proj-022",
        title: "Kuda Bank Platform",
        description: "Architected and led development of Kuda Bank's core banking platform serving 6M+ customers.",
        technologies: ["Node.js", "PostgreSQL", "Kubernetes", "AWS"],
      },
      {
        id: "proj-023",
        title: "Engineering Org Scaling",
        description: "Scaled engineering team from 5 to 40 engineers, implementing remote-first processes.",
        technologies: ["Confluence", "JIRA", "GitHub"],
      },
    ],
  },
];

// ─── Mock Members (10) ───────────────────────────────────────────────────────

export const mockMembers: Member[] = [
  {
    id: "mem-001",
    name: "Ngozi Adeyemi",
    email: "ngozi.adeyemi@outlook.com",
    role: "Product Designer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    subscriptionTier: "featured",
    status: "active",
    profileViews: 342,
    joinedDate: "2025-03-15T00:00:00Z",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/ngoziadeyemi",
    bio: "Product designer with a focus on mobile-first experiences for emerging markets.",
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "Framer"],
  },
  {
    id: "mem-002",
    name: "Fatima Al-Hassan",
    email: "fatima.alhassan@gmail.com",
    role: "Data Scientist",
    location: "Nairobi, Kenya",
    country: "Kenya",
    subscriptionTier: "featured",
    status: "active",
    profileViews: 518,
    joinedDate: "2025-03-10T00:00:00Z",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/fatimaalhassan",
    bio: "Data scientist specializing in NLP and computer vision for African languages.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Spark"],
  },
  {
    id: "mem-003",
    name: "Moussa Traoré",
    email: "moussa.traore@gmail.com",
    role: "Backend Engineer",
    location: "Abidjan, Côte d'Ivoire",
    country: "Côte d'Ivoire",
    subscriptionTier: "standard",
    status: "active",
    profileViews: 189,
    joinedDate: "2025-03-20T00:00:00Z",
    avatar: "",
    bio: "Backend engineer specializing in high-performance Go services.",
    skills: ["Go", "gRPC", "PostgreSQL", "Kafka", "Docker"],
  },
  {
    id: "mem-004",
    name: "Taiwo Akande",
    email: "taiwo.akande@outlook.com",
    role: "Security Engineer",
    location: "Ibadan, Nigeria",
    country: "Nigeria",
    subscriptionTier: "featured",
    status: "active",
    profileViews: 276,
    joinedDate: "2025-03-05T00:00:00Z",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/taiwoakande",
    bio: "Security engineer and ethical hacker. OSCP and CISSP certified.",
    skills: ["Penetration Testing", "AWS Security", "SIEM", "Python"],
  },
  {
    id: "mem-005",
    name: "Ibrahim Sow",
    email: "ibrahim.sow@gmail.com",
    role: "Cloud Architect",
    location: "Dakar, Senegal",
    country: "Senegal",
    subscriptionTier: "featured",
    status: "active",
    profileViews: 423,
    joinedDate: "2025-03-01T00:00:00Z",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/ibrahimsow",
    bio: "Cloud architect with certifications across AWS, GCP, and Azure.",
    skills: ["AWS", "GCP", "Azure", "Terraform", "Architecture Design"],
  },
  {
    id: "mem-006",
    name: "Chiamaka Obi",
    email: "chiamaka.obi@gmail.com",
    role: "Full-Stack Engineer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    subscriptionTier: "standard",
    status: "active",
    profileViews: 145,
    joinedDate: "2025-02-28T00:00:00Z",
    avatar: "",
    githubUrl: "https://github.com/chiamakaobi",
    bio: "Full-stack engineer with expertise in React and Node.js.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: "mem-007",
    name: "Yaw Darko",
    email: "yaw.darko@gmail.com",
    role: "Mobile Engineer (Android)",
    location: "Accra, Ghana",
    country: "Ghana",
    subscriptionTier: "standard",
    status: "suspended",
    profileViews: 67,
    joinedDate: "2025-02-15T00:00:00Z",
    avatar: "",
    bio: "Android engineer focused on offline-first applications.",
    skills: ["Kotlin", "Jetpack Compose", "Room", "Firebase"],
  },
  {
    id: "mem-008",
    name: "Mariam Touré",
    email: "mariam.toure@gmail.com",
    role: "Product Manager",
    location: "Conakry, Guinea",
    country: "Guinea",
    subscriptionTier: "featured",
    status: "active",
    profileViews: 311,
    joinedDate: "2025-02-10T00:00:00Z",
    avatar: "",
    linkedinUrl: "https://linkedin.com/in/mariamtoure",
    bio: "Product manager with 7 years building products for West African markets.",
    skills: ["Product Strategy", "Agile", "SQL", "Mixpanel", "Figma"],
  },
  {
    id: "mem-009",
    name: "Chukwuemeka Eze",
    email: "chukwuemeka.eze@gmail.com",
    role: "DevOps Engineer",
    location: "Enugu, Nigeria",
    country: "Nigeria",
    subscriptionTier: "standard",
    status: "active",
    profileViews: 198,
    joinedDate: "2025-01-30T00:00:00Z",
    avatar: "",
    githubUrl: "https://github.com/chukwuemekaeze",
    bio: "DevOps engineer specializing in cloud-native infrastructure.",
    skills: ["AWS", "Terraform", "Kubernetes", "Prometheus", "Grafana"],
  },
  {
    id: "mem-010",
    name: "Adwoa Asante",
    email: "adwoa.asante@gmail.com",
    role: "UX Designer",
    location: "Kumasi, Ghana",
    country: "Ghana",
    subscriptionTier: "standard",
    status: "active",
    profileViews: 224,
    joinedDate: "2025-01-25T00:00:00Z",
    avatar: "",
    portfolioUrl: "https://adwoa.design",
    bio: "UX designer passionate about accessible, culturally-aware design.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Webflow"],
  },
];

// ─── Mock Companies (8) ──────────────────────────────────────────────────────

export const mockCompanies: Company[] = [
  {
    id: "com-001",
    name: "Stripe",
    website: "https://stripe.com",
    plan: "enterprise",
    status: "active",
    contactsUsed: 47,
    contactLimit: -1,
    joinedDate: "2025-01-15T00:00:00Z",
    industry: "Fintech",
    teamSize: "1000+",
    primaryContact: "Sarah Chen",
    email: "sarah.chen@stripe.com",
    country: "United States",
    talentsHired: 3,
  },
  {
    id: "com-002",
    name: "Shopify",
    website: "https://shopify.com",
    plan: "recruiter",
    status: "active",
    contactsUsed: 28,
    contactLimit: -1,
    joinedDate: "2025-01-22T00:00:00Z",
    industry: "E-commerce",
    teamSize: "5000+",
    primaryContact: "Marcus Johnson",
    email: "marcus.johnson@shopify.com",
    country: "Canada",
    talentsHired: 2,
  },
  {
    id: "com-003",
    name: "Remote.com",
    website: "https://remote.com",
    plan: "enterprise",
    status: "active",
    contactsUsed: 89,
    contactLimit: -1,
    joinedDate: "2025-02-01T00:00:00Z",
    industry: "HR Tech",
    teamSize: "500-1000",
    primaryContact: "Amelia Torres",
    email: "amelia.torres@remote.com",
    country: "Netherlands",
    talentsHired: 7,
  },
  {
    id: "com-004",
    name: "Deel",
    website: "https://deel.com",
    plan: "recruiter",
    status: "active",
    contactsUsed: 15,
    contactLimit: -1,
    joinedDate: "2025-02-10T00:00:00Z",
    industry: "HR Tech",
    teamSize: "1000-5000",
    primaryContact: "David Park",
    email: "david.park@deel.com",
    country: "United States",
    talentsHired: 1,
  },
  {
    id: "com-005",
    name: "Vercel",
    website: "https://vercel.com",
    plan: "scout",
    status: "trial",
    contactsUsed: 3,
    contactLimit: 10,
    joinedDate: "2025-04-20T00:00:00Z",
    industry: "Developer Tools",
    teamSize: "100-500",
    primaryContact: "Alex Kim",
    email: "alex.kim@vercel.com",
    country: "United States",
    talentsHired: 0,
  },
  {
    id: "com-006",
    name: "Loom",
    website: "https://loom.com",
    plan: "scout",
    status: "trial",
    contactsUsed: 7,
    contactLimit: 10,
    joinedDate: "2025-04-18T00:00:00Z",
    industry: "Productivity",
    teamSize: "100-500",
    primaryContact: "James Wilson",
    email: "james.wilson@loom.com",
    country: "United States",
    talentsHired: 0,
  },
  {
    id: "com-007",
    name: "GitLab",
    website: "https://gitlab.com",
    plan: "enterprise",
    status: "active",
    contactsUsed: 62,
    contactLimit: -1,
    joinedDate: "2025-02-20T00:00:00Z",
    industry: "Developer Tools",
    teamSize: "1000-5000",
    primaryContact: "Priya Sharma",
    email: "priya.sharma@gitlab.com",
    country: "United States",
    talentsHired: 4,
  },
  {
    id: "com-008",
    name: "Chipper Cash",
    website: "https://chippercash.com",
    plan: "recruiter",
    status: "suspended",
    contactsUsed: 22,
    contactLimit: -1,
    joinedDate: "2025-03-01T00:00:00Z",
    industry: "Fintech",
    teamSize: "100-500",
    primaryContact: "Noah Oduya",
    email: "noah.oduya@chippercash.com",
    country: "United States",
    talentsHired: 1,
  },
];

// ─── Mock Waitlist ───────────────────────────────────────────────────────────

export const mockWaitlist: WaitlistEntry[] = [
  { id: "wl-001", email: "tunde.bello@gmail.com", role: "Full-Stack Engineer", location: "Lagos, Nigeria", joinedDate: "2025-04-29T10:00:00Z", referral: "Twitter" },
  { id: "wl-002", email: "grace.mwangi@gmail.com", role: "Product Manager", location: "Nairobi, Kenya", joinedDate: "2025-04-28T14:30:00Z" },
  { id: "wl-003", email: "kolade.ojo@outlook.com", role: "Backend Engineer", location: "Ibadan, Nigeria", joinedDate: "2025-04-27T09:15:00Z", referral: "LinkedIn" },
  { id: "wl-004", email: "amara.camara@gmail.com", role: "Data Scientist", location: "Dakar, Senegal", joinedDate: "2025-04-26T16:45:00Z" },
  { id: "wl-005", email: "peter.njoroge@gmail.com", role: "DevOps Engineer", location: "Nairobi, Kenya", joinedDate: "2025-04-25T11:20:00Z", referral: "Twitter" },
  { id: "wl-006", email: "chidinma.okeke@gmail.com", role: "Product Designer", location: "Lagos, Nigeria", joinedDate: "2025-04-24T08:00:00Z" },
  { id: "wl-007", email: "seydou.dembele@gmail.com", role: "Mobile Engineer (iOS)", location: "Bamako, Mali", joinedDate: "2025-04-23T15:30:00Z" },
  { id: "wl-008", email: "blessing.agbo@gmail.com", role: "Frontend Engineer", location: "Abuja, Nigeria", joinedDate: "2025-04-22T12:00:00Z", referral: "Community" },
  { id: "wl-009", email: "abebe.bekele@gmail.com", role: "Machine Learning Engineer", location: "Addis Ababa, Ethiopia", joinedDate: "2025-04-21T10:45:00Z" },
  { id: "wl-010", email: "nomvula.dlamini@gmail.com", role: "UX Researcher", location: "Cape Town, South Africa", joinedDate: "2025-04-20T14:00:00Z", referral: "LinkedIn" },
  { id: "wl-011", email: "rashid.hassan@gmail.com", role: "Backend Engineer", location: "Khartoum, Sudan", joinedDate: "2025-04-19T09:30:00Z" },
  { id: "wl-012", email: "yewande.adebola@gmail.com", role: "Technical Lead", location: "Lagos, Nigeria", joinedDate: "2025-04-18T11:15:00Z", referral: "Twitter" },
  { id: "wl-013", email: "ibrahim.camara@gmail.com", role: "Cloud Architect", location: "Conakry, Guinea", joinedDate: "2025-04-17T16:00:00Z" },
  { id: "wl-014", email: "akosua.boateng@gmail.com", role: "Product Designer", location: "Accra, Ghana", joinedDate: "2025-04-16T13:45:00Z", referral: "Community" },
  { id: "wl-015", email: "frank.acheampong@gmail.com", role: "Security Engineer", location: "Tema, Ghana", joinedDate: "2025-04-15T10:00:00Z" },
];

// ─── Mock Cohorts ────────────────────────────────────────────────────────────

export const mockCohorts: Cohort[] = [
  {
    id: "cohort-001",
    number: 1,
    name: "Cohort 1 — Founding Class",
    maxSize: 500,
    applicantsCount: 127,
    approvedCount: 10,
    openDate: "2025-04-01T00:00:00Z",
    closeDate: "2025-05-31T00:00:00Z",
    isOpen: true,
    status: "active",
  },
];

// ─── Mock Activity Feed ──────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: "signup" | "application" | "approval" | "rejection" | "company" | "contact";
  description: string;
  timestamp: string;
  meta?: string;
}

export const mockActivity: ActivityItem[] = [
  { id: "act-001", type: "application", description: "Olumide Adeyemo applied as Technical Lead", timestamp: "2025-04-29T09:45:00Z", meta: "Lagos, Nigeria" },
  { id: "act-002", type: "company", description: "Vercel joined as Scout plan company", timestamp: "2025-04-28T16:30:00Z", meta: "Trial" },
  { id: "act-003", type: "application", description: "Adaeze Nnamdi applied as Data Engineer", timestamp: "2025-04-28T10:00:00Z", meta: "Lagos, Nigeria" },
  { id: "act-004", type: "approval", description: "Ibrahim Sow approved and added to Cohort 1", timestamp: "2025-04-27T14:15:00Z", meta: "Cloud Architect" },
  { id: "act-005", type: "company", description: "Loom joined as Scout plan company", timestamp: "2025-04-27T11:00:00Z", meta: "Trial" },
  { id: "act-006", type: "signup", description: "15 new waitlist signups this week", timestamp: "2025-04-27T08:00:00Z" },
  { id: "act-007", type: "application", description: "Nkechi Okafor applied as Android Engineer", timestamp: "2025-04-26T13:30:00Z", meta: "Lagos, Nigeria" },
  { id: "act-008", type: "contact", description: "Stripe contacted Fatima Al-Hassan", timestamp: "2025-04-26T10:45:00Z" },
  { id: "act-009", type: "rejection", description: "Gbenga Fashola application rejected", timestamp: "2025-04-25T16:00:00Z", meta: "Insufficient experience" },
  { id: "act-010", type: "approval", description: "Taiwo Akande approved and added to Cohort 1", timestamp: "2025-04-25T11:30:00Z", meta: "Security Engineer" },
];

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export const mockKPIs = {
  totalApplications: 127,
  approvedMembers: 10,
  activeCompanies: 6,
  totalRevenueMRR: 4284,
  pendingReview: 9,
  companiesOnTrial: 2,
  waitlistCount: 15,
  rejectedApplications: 2,
  waitlistedApplications: 3,
};

// ─── Analytics Mock Data ─────────────────────────────────────────────────────

export const mockSignupsOverTime = [
  { month: "Nov 2024", signups: 0 },
  { month: "Dec 2024", signups: 0 },
  { month: "Jan 2025", signups: 12 },
  { month: "Feb 2025", signups: 31 },
  { month: "Mar 2025", signups: 44 },
  { month: "Apr 2025", signups: 40 },
];

export const mockRevenueByMonth = [
  { month: "Jan 2025", mrr: 0, companies: 0 },
  { month: "Feb 2025", mrr: 597, companies: 2 },
  { month: "Mar 2025", mrr: 2088, companies: 5 },
  { month: "Apr 2025", mrr: 4284, companies: 8 },
];

export const mockConversionFunnel = [
  { stage: "Waitlist", count: 142, pct: 100 },
  { stage: "Applied", count: 127, pct: 89 },
  { stage: "Approved", count: 10, pct: 7 },
  { stage: "Active", count: 9, pct: 6 },
];

export const mockGeographicData = [
  { country: "Nigeria", count: 71, pct: 56 },
  { country: "Ghana", count: 21, pct: 17 },
  { country: "Kenya", count: 14, pct: 11 },
  { country: "Senegal", count: 8, pct: 6 },
  { country: "South Africa", count: 6, pct: 5 },
  { country: "Other", count: 7, pct: 5 },
];

export const mockRoleDistribution = [
  { role: "Full-Stack Engineer", count: 35 },
  { role: "Backend Engineer", count: 28 },
  { role: "Product Designer", count: 18 },
  { role: "Frontend Engineer", count: 14 },
  { role: "Data Scientist / ML", count: 12 },
  { role: "Product Manager", count: 10 },
  { role: "DevOps / Cloud", count: 10 },
];
