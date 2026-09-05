from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Complaint, Feedback, Notification, User

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.post('/<int:complaint_id>/feedback')
@jwt_required()
def submit_feedback(complaint_id):
    user = User.query.get(int(get_jwt_identity()))
    complaint = Complaint.query.get_or_404(complaint_id)
    if complaint.user_id != user.id:
        return jsonify({'success': False, 'message': 'Only the complaint creator can provide feedback'}), 403

    data = request.get_json(silent=True) or {}
    rating = int(data.get('rating', 0))
    comment = (data.get('comment') or '').strip()
    if rating < 1 or rating > 5:
        return jsonify({'success': False, 'message': 'Rating must be between 1 and 5'}), 400

    feedback = Feedback(complaint_id=complaint.id, user_id=user.id, rating=rating, comment=comment)
    db.session.add(feedback)
    db.session.add(Notification(user_id=user.id, complaint_id=complaint.id, message=f'Thank you for your feedback on {complaint.complaint_code}.'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Feedback submitted successfully', 'data': feedback.to_dict()})


@feedback_bp.get('/<int:complaint_id>/feedback')
@jwt_required()
def get_feedback(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    user = User.query.get(int(get_jwt_identity()))
    if user.role not in ['admin', 'citizen'] and complaint.user_id != user.id:
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    feedback = Feedback.query.filter_by(complaint_id=complaint_id).all()
    return jsonify({'success': True, 'data': [entry.to_dict() for entry in feedback]})
