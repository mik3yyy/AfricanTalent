from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Cohort

cohorts_bp = Blueprint("cohorts", __name__)


def require_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return None, (jsonify({"error": "Admin access required"}), 403)
    return user, None


def get_or_create_default():
    cohort = Cohort.query.order_by(Cohort.id.desc()).first()
    if not cohort:
        cohort = Cohort(name="Cohort 1", is_open=False, max_size=500)
        db.session.add(cohort)
        db.session.commit()
    return cohort


# ─── Public ──────────────────────────────────────────────────────────────────

@cohorts_bp.route("/api/cohorts/active", methods=["GET"])
def get_active_cohort():
    """Public — returns current cohort name and open/close status."""
    cohort = get_or_create_default()
    return jsonify({"cohort": cohort.to_dict()})


# ─── Admin ───────────────────────────────────────────────────────────────────

@cohorts_bp.route("/api/admin/cohorts", methods=["GET"])
@jwt_required()
def list_cohorts():
    _, err = require_admin()
    if err:
        return err
    cohorts = Cohort.query.order_by(Cohort.id.desc()).all()
    return jsonify({"cohorts": [c.to_dict() for c in cohorts]})


@cohorts_bp.route("/api/admin/cohorts", methods=["POST"])
@jwt_required()
def create_cohort():
    _, err = require_admin()
    if err:
        return err
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name required"}), 400
    cohort = Cohort(
        name=name,
        is_open=bool(data.get("isOpen", False)),
        max_size=int(data.get("maxSize", 500)),
    )
    db.session.add(cohort)
    db.session.commit()
    return jsonify({"cohort": cohort.to_dict()}), 201


@cohorts_bp.route("/api/admin/cohorts/<int:cohort_id>", methods=["PATCH"])
@jwt_required()
def update_cohort(cohort_id):
    _, err = require_admin()
    if err:
        return err
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json() or {}
    if "name" in data:
        cohort.name = data["name"].strip() or cohort.name
    if "isOpen" in data:
        cohort.is_open = bool(data["isOpen"])
    if "maxSize" in data:
        cohort.max_size = int(data["maxSize"])
    db.session.commit()
    return jsonify({"cohort": cohort.to_dict()})


@cohorts_bp.route("/api/admin/cohorts/<int:cohort_id>", methods=["DELETE"])
@jwt_required()
def delete_cohort(cohort_id):
    _, err = require_admin()
    if err:
        return err
    cohort = Cohort.query.get(cohort_id)
    if not cohort:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(cohort)
    db.session.commit()
    return jsonify({"ok": True})
