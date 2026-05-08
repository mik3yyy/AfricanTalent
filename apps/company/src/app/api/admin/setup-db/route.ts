/**
 * One-time database setup endpoint.
 * POST /api/admin/setup-db  →  creates talent_directory table + seeds data.
 *
 * Requires Supabase project to have the `pg_net` extension or
 * the Supabase Management API personal access token.
 *
 * Since we can't run DDL through PostgREST, this route uses the
 * service role to upsert data and tells you what SQL to run first.
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS talent_directory (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  headline            TEXT NOT NULL,
  bio                 TEXT NOT NULL,
  location            TEXT NOT NULL,
  country             TEXT NOT NULL,
  profile_photo_url   TEXT,
  cover_media_url     TEXT,
  sectors             TEXT[]  DEFAULT '{}',
  primary_skills      TEXT[]  DEFAULT '{}',
  secondary_skills    TEXT[]  DEFAULT '{}',
  years_of_experience INTEGER DEFAULT 0,
  availability        TEXT    DEFAULT '1 month',
  employment_type     TEXT[]  DEFAULT '{}',
  compensation_min    INTEGER DEFAULT 0,
  compensation_max    INTEGER DEFAULT 0,
  github_url          TEXT,
  linkedin_url        TEXT,
  portfolio_url       TEXT,
  twitter_url         TEXT,
  dribbble_url        TEXT,
  resume_url          TEXT,
  featured            BOOLEAN DEFAULT false,
  email               TEXT,
  claimed_user_id     UUID,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE talent_directory ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'talent_directory' AND policyname = 'talent_directory_public_read') THEN
    CREATE POLICY "talent_directory_public_read" ON talent_directory FOR SELECT USING (true);
  END IF;
END $$;
`.trim();

// All talent profiles to seed
const TALENT_SEED = [
  { id:"michael-okpechi", name:"Michael Chibuikem Okpechi", headline:"Mobile Developer · Flutter, Swift & Kotlin", bio:"For me, mobile development isn't just a career, it's a brand. I'm fully embracing the current wave of AI as a tool to elevate mobile experiences and ship products that feel smarter, faster, and more human.", location:"Lagos, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754338062/IMG_4411_okdfur.jpg", cover_media_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754338917/okpechi_michael_ihhvbc.jpg", sectors:["mobile_development","software_engineering"], primary_skills:["Flutter","Swift","Kotlin","Dart"], secondary_skills:["iOS","Android","Firebase","REST APIs"], years_of_experience:4, availability:"2 weeks", employment_type:["Full-time","Contract"], compensation_min:1200, compensation_max:2000, github_url:"https://github.com/mik3yyy", linkedin_url:"https://www.linkedin.com/in/chibuikem-michael-okpechi/", featured:true, email:"mikeokpechi@gmail.com" },
  { id:"ebong-nsikak-abasi", name:"Ebong Nsikak-Abasi Nseyen", headline:"Fullstack Developer · AI, Cloud & Data Engineering", bio:"First Class Computer Science graduate with 3+ years of experience in full stack development, data science, cloud computing, and AI engineering.", location:"Uyo, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/_MG_9288.jpeg.jpg", cover_media_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1755649009/profile_images/IMG_4641.jpeg.jpg", sectors:["software_engineering","ai_ml","data_analytics"], primary_skills:["Python","Django","React","TypeScript"], secondary_skills:["NestJS","PostgreSQL","MongoDB","AWS","Docker"], years_of_experience:3, availability:"2 weeks", employment_type:["Full-time","Contract"], compensation_min:900, compensation_max:1500, github_url:"https://github.com/Nsiikak", linkedin_url:"https://www.linkedin.com/in/nsiikak-ebong/", featured:false, email:null },
  { id:"asoegwu-stephanie", name:"Asoegwu Stephanie Chidinma", headline:"UI/UX Designer · Product & Brand Design", bio:"UI/UX Designer with hands-on experience in product design, web development, brand identity, and educational content.", location:"Enugu, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Steph.jpg", cover_media_url:null, sectors:["design_ux"], primary_skills:["Figma","Product Design","Brand Design","UX Research"], secondary_skills:["Prototyping","Wireframing","HTML","CSS","Canva"], years_of_experience:3, availability:"Immediate", employment_type:["Full-time","Contract","Part-time"], compensation_min:700, compensation_max:1200, linkedin_url:"https://www.linkedin.com/in/asoegwu-stephanie/", featured:false, email:null },
  { id:"emelifonwu-william", name:"Emelifonwu William Somtochukwu", headline:"Software Engineer · Full Stack Web & Mobile", bio:"Software Engineer skilled in React Native, Next.js, Flutter, and Node.js delivering high-quality mobile and web solutions.", location:"Enugu, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/William.jpg", cover_media_url:null, sectors:["software_engineering","mobile_development"], primary_skills:["React Native","Next.js","Flutter","Node.js"], secondary_skills:["TypeScript","PostgreSQL","MongoDB","Docker","GraphQL"], years_of_experience:4, availability:"1 month", employment_type:["Full-time","Contract"], compensation_min:1000, compensation_max:1800, featured:false, email:null },
  { id:"ikeaba-tochukwu-adrian", name:"Ikeaba Tochukwu Adrian", headline:"DevOps & Cloud Engineer · AWS, Kubernetes & CI/CD", bio:"DevOps and cloud engineer with 4 years of experience building scalable infrastructure on AWS and Azure.", location:"Abuja, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Tochi.jpg", cover_media_url:null, sectors:["devops_infrastructure","software_engineering"], primary_skills:["AWS","Kubernetes","Terraform","Docker"], secondary_skills:["CI/CD","Jenkins","GitHub Actions","Linux","Python"], years_of_experience:4, availability:"2 weeks", employment_type:["Full-time","Contract"], compensation_min:1200, compensation_max:2200, featured:false, email:null },
  { id:"shepherd-umanah", name:"Shepherd Umanah", headline:"Product Manager · FinTech & B2B SaaS", bio:"Product Manager with 5 years of experience leading FinTech and B2B SaaS products from 0 to 1.", location:"Lagos, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Shepherd.jpg", cover_media_url:null, sectors:["product_management"], primary_skills:["Product Strategy","Roadmapping","User Research","Agile"], secondary_skills:["Figma","Jira","Data Analytics","SQL"], years_of_experience:5, availability:"1 month", employment_type:["Full-time"], compensation_min:1500, compensation_max:3000, featured:false, email:null },
  { id:"samuel-abolo", name:"Samuel Abolo", headline:"Frontend Developer · React, Next.js & TypeScript", bio:"Frontend developer who obsesses over performance, accessibility, and pixel-perfect implementation.", location:"Port Harcourt, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Samuel.jpg", cover_media_url:null, sectors:["web_development","software_engineering"], primary_skills:["React","Next.js","TypeScript","Tailwind CSS"], secondary_skills:["GraphQL","Storybook","Jest","Figma"], years_of_experience:4, availability:"Immediate", employment_type:["Full-time","Contract"], compensation_min:900, compensation_max:1600, featured:false, email:null },
  { id:"uchenna-ngozi", name:"Uchenna Ngozi", headline:"Data Scientist · ML, Analytics & BI", bio:"Data scientist with deep experience in machine learning, business intelligence, and statistical modelling.", location:"Ibadan, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Uchenna.jpg", cover_media_url:null, sectors:["data_analytics","ai_ml"], primary_skills:["Python","SQL","Machine Learning","Power BI"], secondary_skills:["TensorFlow","scikit-learn","Tableau","dbt"], years_of_experience:5, availability:"2 weeks", employment_type:["Full-time","Contract"], compensation_min:1100, compensation_max:2000, featured:false, email:null },
  { id:"medhat-mostafa-atya", name:"Medhat Mostafa Atya", headline:"AI/ML Engineer · LLMs, Computer Vision & MLOps", bio:"AI/ML engineer with expertise in large language models, computer vision pipelines, and MLOps.", location:"Cairo, Egypt", country:"Egypt", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Medhat.jpg", cover_media_url:null, sectors:["ai_ml","data_analytics"], primary_skills:["Python","PyTorch","LangChain","OpenCV"], secondary_skills:["MLflow","Kubernetes","AWS SageMaker","HuggingFace"], years_of_experience:5, availability:"2 weeks", employment_type:["Full-time","Contract"], compensation_min:1500, compensation_max:3000, featured:false, email:null },
  { id:"omorinsola-makinde", name:"Omorinsola Makinde", headline:"UX Researcher & Designer · Enterprise & Consumer", bio:"UX researcher and designer with 5 years of experience running mixed-methods studies that inform product decisions.", location:"Abuja, Nigeria", country:"Nigeria", profile_photo_url:"https://res.cloudinary.com/dwwzrtzb8/image/upload/v1754241298/profile_images/Omorinsola.jpg", cover_media_url:null, sectors:["design_ux","product_management"], primary_skills:["UX Research","Figma","Usability Testing","Information Architecture"], secondary_skills:["Prototyping","Survey Design","Miro"], years_of_experience:5, availability:"1 month", employment_type:["Full-time","Contract"], compensation_min:1000, compensation_max:1900, featured:false, email:null },
];

export async function POST(req: Request) {
  // Simple auth check
  const auth = req.headers.get("x-admin-key");
  if (auth !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Try to insert data — will fail with 404 if table doesn't exist yet
  const { error } = await supabase
    .from("talent_directory")
    .upsert(TALENT_SEED, { onConflict: "id" });

  if (error) {
    // Table doesn't exist — return the SQL for the user to run
    if (error.code === "42P01") {
      return NextResponse.json({
        error: "Table does not exist yet. Run this SQL in your Supabase dashboard SQL Editor first:",
        sql: MIGRATION_SQL,
      }, { status: 422 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, seeded: TALENT_SEED.length });
}

export async function GET() {
  return NextResponse.json({
    info: "POST to this endpoint with x-admin-key header to seed talent_directory.",
    sql_needed: MIGRATION_SQL,
  });
}
