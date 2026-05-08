from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=True)
    role = db.Column(db.String(20), nullable=False, default="talent")  # talent | company | admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    talent_profile = db.relationship("TalentProfile", back_populates="user", uselist=False)
    company = db.relationship("Company", back_populates="user", uselist=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha256")

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "createdAt": self.created_at.isoformat(),
        }
