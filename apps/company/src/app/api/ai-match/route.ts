import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

type ApiProfile = {
  id: string; name: string; headline: string; bio: string;
  location: string; country: string;
  profilePhotoUrl: string; coverMediaUrl?: string;
  sectors: string[]; primarySkills: string[]; secondarySkills: string[];
  yearsOfExperience: number; availability: string; employmentType: string[];
  compensationMin: number; compensationMax: number;
  portfolioLinks: { github?: string; linkedin?: string; portfolio?: string; twitter?: string; dribbble?: string };
  resumeUrl?: string; featured: boolean;
};

async function getAllTalentFromApi(): Promise<ApiProfile[]> {
  try {
    const res = await fetch(`${API_URL}/api/talent`, { cache: "no-store" });
    if (!res.ok) return [];
    const { talent } = await res.json() as { talent: ApiProfile[] };
    return talent ?? [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { jd } = await req.json() as { jd: string };
    if (!jd?.trim()) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const allTalent = await getAllTalentFromApi();

    const compact = allTalent.map((t) => ({
      id: t.id,
      name: t.name,
      headline: t.headline,
      sectors: t.sectors,
      primarySkills: t.primarySkills,
      secondarySkills: t.secondarySkills,
      yearsOfExperience: t.yearsOfExperience,
      employmentType: t.employmentType,
      location: t.location,
      country: t.country,
    }));

    const prompt = `You are a talent matching assistant for an African talent marketplace. Given a job description and a list of talent profiles, return the top matching candidates ranked by relevance.

Job Description:
${jd}

Talent Directory (JSON):
${JSON.stringify(compact, null, 2)}

Respond with ONLY valid JSON in this exact format, nothing else:
{
  "matches": [
    { "id": "talent-id", "reason": "One concise sentence explaining why they are a strong match" }
  ]
}

Return up to 6 best matches, ranked by relevance. Only include candidates that genuinely match key requirements. Make the reason specific and compelling — mention actual skills or experience from their profile.`;

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "AI matching not configured. Please add GROQ_API_KEY to environment variables." }, { status: 503 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI service error. Try again shortly." }, { status: 502 });
    }

    const groqData = await response.json() as { choices: Array<{ message: { content: string } }> };
    const text = groqData.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text) as { matches: Array<{ id: string; reason: string }> };
    const matchIds = parsed.matches.map((m) => m.id);
    const profileMap = Object.fromEntries(allTalent.map((p) => [p.id, p]));

    const results = parsed.matches
      .map((m) => {
        const p = profileMap[m.id];
        if (!p) return null;
        return { talent: p, reason: m.reason };
      })
      .filter(Boolean);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("AI match error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
