from flask import Blueprint, jsonify
from ..models import TalentProfile, Company

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@stats_bp.route("", methods=["GET"])
def public_stats():
    """Public lightweight stats — no auth needed."""
    approved = TalentProfile.query.filter_by(application_status="approved").count()
    pending = TalentProfile.query.filter_by(application_status="pending").count()
    total = TalentProfile.query.count()
    companies = Company.query.count()

    return jsonify({
        "talent": total,
        "approved": approved,
        "pending": pending,
        "companies": companies,
    })
