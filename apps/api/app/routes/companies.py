import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Company

companies_bp = Blueprint("companies", __name__, url_prefix="/api/companies")


@companies_bp.route("/profile", methods=["POST", "PUT"])
@jwt_required()
def upsert_company():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "company":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    company = Company.query.filter_by(user_id=user_id).first()
    is_new = company is None

    if is_new:
        company = Company(user_id=user_id, email=user.email)
        db.session.add(company)

    company.company_name = data.get("companyName", company.company_name)
    company.website = data.get("website", company.website)
    company.industry = data.get("industry", company.industry)
    company.team_size = data.get("teamSize", company.team_size)
    company.contact_name = data.get("contactName", company.contact_name)
    company.job_title = data.get("jobTitle", company.job_title)
    company.city = data.get("city", company.city)
    company.country = data.get("country", company.country)

    db.session.commit()
    return jsonify({"company": company.to_dict()}), 201 if is_new else 200


@companies_bp.route("/submit", methods=["POST"])
def submit_viewer():
    """
    Called by the company Next.js app after sign-in / onboarding.
    Uses X-App-Secret instead of JWT — viewers auth via Supabase.
    Idempotent: upserts by email.
    """
    secret = request.headers.get("X-App-Secret", "")
    expected = os.getenv("APP_SECRET", "african-talent-app-secret-2026")
    if secret != expected:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    if not email:
        return jsonify({"error": "email required"}), 400

    company = Company.query.filter_by(email=email).first()
    is_new = company is None

    if is_new:
        company = Company(email=email)
        db.session.add(company)

    # Update fields if provided — never overwrite with empty string
    def pick(key, current):
        val = data.get(key)
        return val if val else current

    company.contact_name = pick("contactName", company.contact_name)
    company.job_title = pick("jobTitle", company.job_title)
    company.company_name = pick("companyName", company.company_name)
    company.city = pick("city", company.city)
    company.country = pick("country", company.country)

    db.session.commit()
    return jsonify({"ok": True, "company": company.to_dict()}), 201 if is_new else 200
