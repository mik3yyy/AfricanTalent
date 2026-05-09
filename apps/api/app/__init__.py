import os
from flask import Flask
from dotenv import load_dotenv
from .extensions import db, jwt, cors
from .routes import auth_bp, talent_bp, companies_bp, admin_bp, stats_bp, ai_bp, cohorts_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///african_talent.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False  # tokens don't expire in dev

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    app.register_blueprint(auth_bp)
    app.register_blueprint(talent_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(cohorts_bp)

    @app.route("/health")
    def health():
        return {"status": "ok", "service": "African Talent API"}

    with app.app_context():
        db.create_all()

    return app
