from datetime import datetime
from ..extensions import db


class Cohort(db.Model):
    __tablename__ = "cohorts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    is_open = db.Column(db.Boolean, default=False, nullable=False)
    max_size = db.Column(db.Integer, default=500)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        from ..models import TalentProfile
        approved = TalentProfile.query.filter_by(application_status="approved").count()
        pending = TalentProfile.query.filter_by(application_status="pending").count()
        return {
            "id": self.id,
            "name": self.name,
            "isOpen": self.is_open,
            "maxSize": self.max_size,
            "approved": approved,
            "pending": pending,
            "createdAt": self.created_at.isoformat(),
        }
