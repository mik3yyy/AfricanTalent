from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, TalentProfile, Company

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def require_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return None, (jsonify({"error": "Admin access required"}), 403)
    return user, None


# ─── Talent ───────────────────────────────────────────────────────────────────

@admin_bp.route("/talent", methods=["GET"])
@jwt_required()
def list_all_talent():
    _, err = require_admin()
    if err:
        return err

    status = request.args.get("status")
    query = TalentProfile.query
    if status:
        query = query.filter_by(application_status=status)
    profiles = query.order_by(TalentProfile.created_at.desc()).all()
    return jsonify({"talent": [p.to_dict() for p in profiles]})


@admin_bp.route("/talent/<string:talent_id>", methods=["GET"])
@jwt_required()
def get_talent(talent_id):
    _, err = require_admin()
    if err:
        return err

    profile = TalentProfile.query.get(talent_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"talent": profile.to_dict()})


@admin_bp.route("/talent/<string:talent_id>/status", methods=["PATCH"])
@jwt_required()
def update_status(talent_id):
    _, err = require_admin()
    if err:
        return err

    profile = TalentProfile.query.get(talent_id)
    if not profile:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ("pending", "approved", "rejected", "waitlist"):
        return jsonify({"error": "Invalid status"}), 400

    profile.application_status = new_status
    if "notes" in data:
        profile.admin_notes = data["notes"]
    if "rejectionReason" in data:
        profile.rejection_reason = data["rejectionReason"]

    db.session.commit()
    return jsonify({"talent": profile.to_dict()})


# ─── Companies ────────────────────────────────────────────────────────────────

@admin_bp.route("/companies", methods=["GET"])
@jwt_required()
def list_companies():
    _, err = require_admin()
    if err:
        return err

    companies = Company.query.order_by(Company.created_at.desc()).all()
    return jsonify({"companies": [c.to_dict() for c in companies]})


# ─── Stats ────────────────────────────────────────────────────────────────────

@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    _, err = require_admin()
    if err:
        return err

    total = TalentProfile.query.count()
    approved = TalentProfile.query.filter_by(application_status="approved").count()
    pending = TalentProfile.query.filter_by(application_status="pending").count()
    rejected = TalentProfile.query.filter_by(application_status="rejected").count()
    companies = Company.query.count()

    return jsonify({
        "talent": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "companies": companies,
    })
