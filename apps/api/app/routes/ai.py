import os
import json
import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import TalentProfile

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


@ai_bp.route("/match", methods=["POST"])
@jwt_required()
def match():
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        return jsonify({"error": "GROQ_API_KEY not configured"}), 500

    data = request.get_json() or {}
    role = data.get("role", "")
    description = data.get("description", "")
    skills = data.get("skills", [])
    budget_min = data.get("budgetMin", 0)
    budget_max = data.get("budgetMax", 9999)

    profiles = (
        TalentProfile.query
        .filter_by(application_status="approved")
        .all()
    )

    talent_list = [
        {
            "id": p.id,
            "name": p.name,
            "headline": p.headline,
            "sectors": p.sectors,
            "primarySkills": p.primary_skills,
            "secondarySkills": p.secondary_skills,
            "yearsOfExperience": p.years_of_experience,
            "compensationMin": p.compensation_min,
            "compensationMax": p.compensation_max,
            "availability": p.availability,
            "country": p.country,
        }
        for p in profiles
    ]

    system_prompt = (
        "You are an expert African tech talent recruiter. "
        "Given a job requirement and a list of candidates, return the top 5 best matches. "
        "Respond ONLY with valid JSON in this exact format: "
        '{"matches": [{"id": "...", "matchScore": 95, "whyTheyMatch": "...concise reason..."}]}'
    )

    user_prompt = (
        f"Job requirement:\n"
        f"Role: {role}\n"
        f"Description: {description}\n"
        f"Required skills: {', '.join(skills)}\n"
        f"Budget: ${budget_min}–${budget_max}/month\n\n"
        f"Candidates:\n{json.dumps(talent_list, indent=2)}\n\n"
        "Return the top 5 matches as JSON."
    )

    try:
        resp = requests.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.3,
                "max_tokens": 1024,
            },
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        matches_raw = parsed.get("matches", [])

        profile_map = {p.id: p for p in profiles}
        enriched = []
        for m in matches_raw:
            p = profile_map.get(m.get("id"))
            if p:
                enriched.append({**p.to_dict(), "matchScore": m.get("matchScore", 0), "whyTheyMatch": m.get("whyTheyMatch", "")})

        return jsonify({"matches": enriched})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
