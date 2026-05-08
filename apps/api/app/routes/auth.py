from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, TalentProfile, Company

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    password = data.get("password") or ""
    role = data.get("role") or "talent"  # talent | company

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    if role not in ("talent", "company"):
        return jsonify({"error": "Invalid role"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    # Auto-link talent profile if email matches a pre-loaded profile
    if role == "talent":
        existing = TalentProfile.query.filter_by(email=email, user_id=None).first()
        if existing:
            existing.user_id = user.id
            existing.application_status = "approved"

    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    extra = {}
    if user.role == "talent" and user.talent_profile:
        extra["profile"] = user.talent_profile.to_dict()
    elif user.role == "company" and user.company:
        extra["company"] = user.company.to_dict()

    return jsonify({"user": user.to_dict(), **extra})
