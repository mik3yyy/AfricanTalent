import json
from datetime import datetime
from ..extensions import db


class TalentProfile(db.Model):
    __tablename__ = "talent_profiles"

    id = db.Column(db.String(100), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    email = db.Column(db.String(255), nullable=True)

    name = db.Column(db.String(255), nullable=False)
    headline = db.Column(db.String(500), nullable=False, default="")
    bio = db.Column(db.Text, nullable=False, default="")
    location = db.Column(db.String(255), nullable=False, default="")
    country = db.Column(db.String(100), nullable=False, default="")

    profile_photo_url = db.Column(db.Text, nullable=True)
    cover_media_url = db.Column(db.Text, nullable=True)
    resume_url = db.Column(db.Text, nullable=True)

    # JSON-stored arrays
    _sectors = db.Column("sectors", db.Text, default="[]")
    _primary_skills = db.Column("primary_skills", db.Text, default="[]")
    _secondary_skills = db.Column("secondary_skills", db.Text, default="[]")
    _employment_type = db.Column("employment_type", db.Text, default="[]")

    years_of_experience = db.Column(db.Integer, default=0)
    availability = db.Column(db.String(50), default="1 month")
    compensation_min = db.Column(db.Integer, default=0)
    compensation_max = db.Column(db.Integer, default=0)

    github_url = db.Column(db.Text, nullable=True)
    linkedin_url = db.Column(db.Text, nullable=True)
    portfolio_url = db.Column(db.Text, nullable=True)
    twitter_url = db.Column(db.Text, nullable=True)
    dribbble_url = db.Column(db.Text, nullable=True)

    featured = db.Column(db.Boolean, default=False)
    application_status = db.Column(db.String(20), default="approved")
    admin_notes = db.Column(db.Text, nullable=True)
    rejection_reason = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="talent_profile")

    @property
    def sectors(self):
        return json.loads(self._sectors or "[]")

    @sectors.setter
    def sectors(self, value):
        self._sectors = json.dumps(value or [])

    @property
    def primary_skills(self):
        return json.loads(self._primary_skills or "[]")

    @primary_skills.setter
    def primary_skills(self, value):
        self._primary_skills = json.dumps(value or [])

    @property
    def secondary_skills(self):
        return json.loads(self._secondary_skills or "[]")

    @secondary_skills.setter
    def secondary_skills(self, value):
        self._secondary_skills = json.dumps(value or [])

    @property
    def employment_type(self):
        return json.loads(self._employment_type or "[]")

    @employment_type.setter
    def employment_type(self, value):
        self._employment_type = json.dumps(value or [])

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "email": self.email,
            "name": self.name,
            "headline": self.headline,
            "bio": self.bio,
            "location": self.location,
            "country": self.country,
            "profilePhotoUrl": self.profile_photo_url or "",
            "coverMediaUrl": self.cover_media_url or None,
            "sectors": self.sectors,
            "primarySkills": self.primary_skills,
            "secondarySkills": self.secondary_skills,
            "yearsOfExperience": self.years_of_experience,
            "availability": self.availability,
            "employmentType": self.employment_type,
            "compensationMin": self.compensation_min,
            "compensationMax": self.compensation_max,
            "portfolioLinks": {
                "github": self.github_url or None,
                "linkedin": self.linkedin_url or None,
                "portfolio": self.portfolio_url or None,
                "twitter": self.twitter_url or None,
                "dribbble": self.dribbble_url or None,
            },
            "resumeUrl": self.resume_url or None,
            "featured": self.featured,
            "applicationStatus": self.application_status,
            "adminNotes": self.admin_notes,
            "rejectionReason": self.rejection_reason,
            "createdAt": self.created_at.isoformat(),
        }
