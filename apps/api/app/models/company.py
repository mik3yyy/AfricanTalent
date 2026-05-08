from datetime import datetime
from ..extensions import db


class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    email = db.Column(db.String(255), nullable=True)

    company_name = db.Column(db.String(255), nullable=True)
    website = db.Column(db.String(500), nullable=True)
    industry = db.Column(db.String(100), nullable=True)
    team_size = db.Column(db.String(50), nullable=True)
    contact_name = db.Column(db.String(255), nullable=True)
    job_title = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)

    plan = db.Column(db.String(20), default="free")
    status = db.Column(db.String(20), default="active")
    contacts_used = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="company")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "email": self.email,
            "companyName": self.company_name,
            "website": self.website,
            "industry": self.industry,
            "teamSize": self.team_size,
            "contactName": self.contact_name,
            "jobTitle": self.job_title,
            "city": self.city,
            "country": self.country,
            "plan": self.plan,
            "status": self.status,
            "contactsUsed": self.contacts_used,
            "joinedDate": self.created_at.isoformat(),
        }
