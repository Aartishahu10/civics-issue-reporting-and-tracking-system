from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ai.classifier import analyze_sentiment, classify_issue_from_text, civic_chat_response, detect_duplicate, predict_priority
from models import Complaint, User

ai_bp = Blueprint('ai', __name__)


@ai_bp.post('/classify')
def classify():
    data = request.get_json(silent=True) or {}
    description = data.get('description', '')
    category_hint = data.get('category')
    result = classify_issue_from_text(description, category_hint)
    return jsonify({'success': True, 'data': result})


@ai_bp.post('/priority')
def priority():
    data = request.get_json(silent=True) or {}
    category = data.get('category', 'Other')
    description = data.get('description', '')
    location = data.get('location', {})
    similar_count = data.get('similar_count', 0)
    result = predict_priority(category, description, location.get('name', ''), similar_count)
    return jsonify({'success': True, 'data': result})


@ai_bp.post('/duplicate')
def duplicate():
    data = request.get_json(silent=True) or {}
    location = data.get('location', {})
    category = data.get('category', 'Other')
    description = data.get('description', '')
    complaints = Complaint.query.all()
    result = detect_duplicate(location, category, description, complaints)
    return jsonify({'success': True, 'data': result})


@ai_bp.post('/sentiment')
def sentiment():
    data = request.get_json(silent=True) or {}
    text = data.get('description', '')
    return jsonify({'success': True, 'data': analyze_sentiment(text)})


@ai_bp.post('/chat')
@jwt_required()
def chat():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    latest = None
    if user:
        latest = Complaint.query.filter_by(user_id=user.id).order_by(Complaint.created_at.desc()).first()
    data = request.get_json(silent=True) or {}
    question = data.get('question', '')
    response = civic_chat_response(question, latest)
    return jsonify({'success': True, 'data': {'reply': response}})
