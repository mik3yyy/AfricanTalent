import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, TalentProfile

talent_bp = Blueprint("talent", __name__, url_prefix="/api/talent")


@talent_bp.route("", methods=["GET"])
def list_talent():
    """Public endpoint — returns all approved talent. Optional ?email= for lookup."""
    email = request.args.get("email", "").lower().strip()
    query = TalentProfile.query.filter_by(application_status="approved")
    if email:
        query = query.filter_by(email=email)
    profiles = query.order_by(TalentProfile.featured.desc(), TalentProfile.created_at.asc()).all()
    return jsonify({"talent": [p.to_dict() for p in profiles]})


@talent_bp.route("/<string:talent_id>", methods=["GET"])
def get_talent(talent_id):
    profile = TalentProfile.query.get(talent_id)
    if not profile or profile.application_status != "approved":
        return jsonify({"error": "Not found"}), 404
    return jsonify({"talent": profile.to_dict()})


@talent_bp.route("/profile", methods=["POST", "PUT"])
@jwt_required()
def upsert_profile():
    """Talent submits/updates their onboarding profile."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "talent":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}

    profile = TalentProfile.query.filter_by(user_id=user_id).first()
    is_new = profile is None

    if is_new:
        slug_base = data.get("name", "").lower().replace(" ", "-")
        slug = slug_base
        counter = 1
        while TalentProfile.query.get(slug):
            slug = f"{slug_base}-{counter}"
            counter += 1
        profile = TalentProfile(id=slug, user_id=user_id, email=user.email)
        db.session.add(profile)

    profile.name = data.get("name", profile.name)
    profile.headline = data.get("headline", profile.headline)
    profile.bio = data.get("bio", profile.bio)
    profile.location = data.get("location", profile.location)
    profile.country = data.get("country", profile.country)
    profile.profile_photo_url = data.get("profilePhotoUrl", profile.profile_photo_url)
    profile.cover_media_url = data.get("coverMediaUrl", profile.cover_media_url)
    profile.resume_url = data.get("resumeUrl", profile.resume_url)
    profile.sectors = data.get("sectors", profile.sectors)
    profile.primary_skills = data.get("primarySkills", profile.primary_skills)
    profile.secondary_skills = data.get("secondarySkills", profile.secondary_skills)
    profile.years_of_experience = data.get("yearsOfExperience", profile.years_of_experience)
    profile.availability = data.get("availability", profile.availability)
    profile.employment_type = data.get("employmentType", profile.employment_type)
    profile.compensation_min = data.get("compensationMin", profile.compensation_min)
    profile.compensation_max = data.get("compensationMax", profile.compensation_max)

    links = data.get("portfolioLinks", {})
    profile.github_url = links.get("github", profile.github_url)
    profile.linkedin_url = links.get("linkedin", profile.linkedin_url)
    profile.portfolio_url = links.get("portfolio", profile.portfolio_url)
    profile.twitter_url = links.get("twitter", profile.twitter_url)
    profile.dribbble_url = links.get("dribbble", profile.dribbble_url)

    if is_new:
        profile.application_status = "pending"

    db.session.commit()
    return jsonify({"talent": profile.to_dict()}), 201 if is_new else 200


@talent_bp.route("/submit", methods=["POST"])
def submit_from_talent_app():
    """
    Called by the talent Next.js app after a user completes onboarding.
    Uses a shared app secret instead of JWT (talent users auth via Supabase).
    """
    secret = request.headers.get("X-App-Secret", "")
    expected = os.getenv("APP_SECRET", "african-talent-app-secret-2026")
    if secret != expected:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    if not email:
        return jsonify({"error": "email required"}), 400

    # Find existing profile by email (pre-loaded or prior submission)
    profile = TalentProfile.query.filter_by(email=email).first()
    is_new = profile is None

    # Build a slug id from name
    if is_new:
        name = data.get("name", email.split("@")[0])
        slug_base = name.lower().replace(" ", "-").replace(".", "-")
        slug = slug_base
        counter = 1
        while TalentProfile.query.get(slug):
            slug = f"{slug_base}-{counter}"
            counter += 1
        profile = TalentProfile(id=slug, email=email)
        db.session.add(profile)

    # Map onboarding data fields to model
    name = data.get("name") or data.get("fullName")
    if name:
        profile.name = name

    employment_raw = data.get("employmentType", "")
    if isinstance(employment_raw, list):
        emp_list = employment_raw
    else:
        emp_map = {"full_time": ["Full-time"], "contract": ["Contract"], "part_time": ["Part-time"], "both": ["Full-time", "Contract"]}
        emp_list = emp_map.get(employment_raw, [employment_raw] if employment_raw else [])

    profile.headline = data.get("headline", profile.headline or "")
    profile.bio = data.get("bio", profile.bio or "")
    profile.location = data.get("countryName") or data.get("location") or profile.location or ""
    profile.country = data.get("countryName") or data.get("country") or profile.country or ""
    profile.profile_photo_url = data.get("profilePhotoUrl") or profile.profile_photo_url
    profile.cover_media_url = data.get("coverMediaUrl") or profile.cover_media_url
    profile.resume_url = data.get("resumeUrl") or profile.resume_url
    profile.sectors = data.get("sectors") or profile.sectors or []
    profile.primary_skills = data.get("primarySkills") or data.get("skills") or profile.primary_skills or []
    profile.secondary_skills = data.get("secondarySkills") or profile.secondary_skills or []
    profile.years_of_experience = data.get("yearsOfExperience") or profile.years_of_experience or 0
    profile.availability = data.get("availability") or profile.availability or "1 month"
    profile.employment_type = emp_list or profile.employment_type or []
    profile.compensation_min = data.get("compensationMin") or profile.compensation_min or 0
    profile.compensation_max = data.get("compensationMax") or profile.compensation_max or 0
    profile.github_url = data.get("githubUrl") or profile.github_url
    profile.linkedin_url = data.get("linkedinUrl") or profile.linkedin_url
    profile.portfolio_url = data.get("websiteUrl") or data.get("portfolioUrl") or profile.portfolio_url
    profile.twitter_url = data.get("twitterUrl") or profile.twitter_url
    profile.dribbble_url = data.get("dribbbleUrl") or profile.dribbble_url

    if is_new or profile.application_status not in ("approved", "waitlist"):
        profile.application_status = "pending"

    db.session.commit()
    return jsonify({"ok": True, "talent": profile.to_dict()}), 201 if is_new else 200
