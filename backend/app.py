from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.complaints import complaints_bp
from routes.admin import admin_bp
from routes.ai import ai_bp
from routes.staff import staff_bp
from routes.feedback import feedback_bp
from config import Config
from extensions import db, jwt
from models import init_db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(complaints_bp, url_prefix='/api/complaints')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')
    app.register_blueprint(feedback_bp, url_prefix='/api/complaints')

    with app.app_context():
        db.create_all()
        init_db()

    @app.get('/')
    def index():
        return {'status': 'ok', 'service': 'CivicConnect AI API'}

    return app


app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
