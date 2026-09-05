from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime

from extensions import db
from models import Complaint, Department, User, Feedback, Notification

admin_bp = Blueprint('admin', __name__)


def current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)


@admin_bp.get('/statistics')
@jwt_required()
def statistics():
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Admin access required'}), 403

    complaints = Complaint.query.all()
    status_counts = {}
    for complaint in complaints:
        status_counts[complaint.status] = status_counts.get(complaint.status, 0) + 1

    critical = sum(1 for complaint in complaints if complaint.priority == 'CRITICAL')
    resolved = [c for c in complaints if c.resolved_at]
    avg_resolution = 0
    if resolved:
        durations = []
        for complaint in resolved:
            if complaint.created_at and complaint.resolved_at:
                durations.append((complaint.resolved_at - complaint.created_at).total_seconds() / 86400)
        avg_resolution = round(sum(durations) / len(durations), 2)

    return jsonify({'success': True, 'data': {
        'total_complaints': len(complaints),
        'pending': status_counts.get('SUBMITTED', 0) + status_counts.get('VERIFIED', 0) + status_counts.get('ASSIGNED', 0),
        'verified': status_counts.get('VERIFIED', 0),
        'in_progress': status_counts.get('IN_PROGRESS', 0),
        'resolved': status_counts.get('RESOLVED', 0) + status_counts.get('CLOSED', 0),
        'critical_issues': critical,
        'average_resolution_time_days': avg_resolution,
    }})


@admin_bp.get('/users')
@jwt_required()
def list_users():
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Admin access required'}), 403
    return jsonify({'success': True, 'data': [u.to_dict() for u in User.query.order_by(User.id.asc()).all()]})


@admin_bp.get('/departments')
@jwt_required()
def list_departments():
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Admin access required'}), 403
    return jsonify({'success': True, 'data': [d.to_dict() for d in Department.query.order_by(Department.id.asc()).all()]})


@admin_bp.get('/analytics')
@jwt_required()
def analytics():
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Admin access required'}), 403

    complaints = Complaint.query.all()
    category_counts = {}
    status_counts = {}
    priority_counts = {}
    for complaint in complaints:
        category_counts[complaint.category] = category_counts.get(complaint.category, 0) + 1
        status_counts[complaint.status] = status_counts.get(complaint.status, 0) + 1
        priority_counts[complaint.priority] = priority_counts.get(complaint.priority, 0) + 1

    feedback = Feedback.query.all()
    rating_avg = 0
    if feedback:
        rating_avg = round(sum(item.rating for item in feedback) / len(feedback), 2)

    return jsonify({'success': True, 'data': {
        'complaints_by_category': [{'name': key, 'value': value} for key, value in category_counts.items()],
        'complaints_by_status': [{'name': key, 'value': value} for key, value in status_counts.items()],
        'complaints_by_priority': [{'name': key, 'value': value} for key, value in priority_counts.items()],
        'average_rating': rating_avg,
        'hotspots': [
            {'name': 'Area A', 'value': 120},
            {'name': 'Area B', 'value': 87},
            {'name': 'Area C', 'value': 54},
        ],
    }})
