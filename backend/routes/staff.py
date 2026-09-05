from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Complaint, ComplaintUpdate, Notification, User

staff_bp = Blueprint('staff', __name__)


def current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)


@staff_bp.get('/tasks')
@jwt_required()
def tasks():
    user = current_user()
    if user.role != 'staff':
        return jsonify({'success': False, 'message': 'Staff access required'}), 403
    complaints = Complaint.query.filter_by(staff_id=user.id).order_by(Complaint.created_at.desc()).all()
    return jsonify({'success': True, 'data': [complaint.to_dict(include_user=True, include_department=True) for complaint in complaints]})


@staff_bp.put('/tasks/<int:complaint_id>')
@jwt_required()
def update_task(complaint_id):
    user = current_user()
    if user.role != 'staff':
        return jsonify({'success': False, 'message': 'Staff access required'}), 403
    complaint = Complaint.query.get_or_404(complaint_id)
    if complaint.staff_id != user.id:
        return jsonify({'success': False, 'message': 'This task is not assigned to you'}), 403

    data = request.get_json(silent=True) or {}
    status = data.get('status')
    if status:
        old_status = complaint.status
        complaint.status = status
        if status == 'RESOLVED':
            complaint.resolved_at = datetime.utcnow()
        db.session.add(ComplaintUpdate(complaint_id=complaint.id, updated_by=user.id, old_status=old_status, new_status=status, remarks=data.get('remarks') or 'Task updated'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Task updated successfully', 'data': complaint.to_dict()})


@staff_bp.post('/tasks/<int:complaint_id>/resolution')
@jwt_required()
def add_resolution(complaint_id):
    user = current_user()
    if user.role != 'staff':
        return jsonify({'success': False, 'message': 'Staff access required'}), 403
    complaint = Complaint.query.get_or_404(complaint_id)
    if complaint.staff_id != user.id:
        return jsonify({'success': False, 'message': 'This task is not assigned to you'}), 403

    data = request.get_json(silent=True) or {}
    remarks = (data.get('remarks') or '').strip()
    if not remarks:
        return jsonify({'success': False, 'message': 'Resolution remarks are required'}), 400

    complaint.status = 'RESOLVED'
    complaint.resolved_at = datetime.utcnow()
    db.session.add(ComplaintUpdate(complaint_id=complaint.id, updated_by=user.id, old_status='IN_PROGRESS', new_status='RESOLVED', remarks=remarks, image_url=data.get('image_url')))
    db.session.add(Notification(user_id=complaint.user_id, complaint_id=complaint.id, message=f'Your complaint {complaint.complaint_code} has been resolved.'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Resolution submitted successfully', 'data': complaint.to_dict()})
