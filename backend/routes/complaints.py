import os
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ai.classifier import classify_issue_from_text, detect_duplicate, predict_priority
from extensions import db
from models import Complaint, ComplaintUpdate, Notification, Supporter, User
from utils.file_utils import save_uploaded_file

complaints_bp = Blueprint('complaints', __name__)


def current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)


@complaints_bp.route('', methods=['POST'], strict_slashes=False)
@complaints_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_complaint():
    user = current_user()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    data = request.form.to_dict()
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip()
    category = (data.get('category') or '').strip()
    latitude = float(data.get('latitude', 0))
    longitude = float(data.get('longitude', 0))
    address = (data.get('address') or '').strip()

    if not title or not description or not category:
        return jsonify({'success': False, 'message': 'Title, description and category are required'}), 400

    image_url = None
    if 'image' in request.files:
        file_storage = request.files['image']
        if file_storage.filename:
            try:
                image_url = save_uploaded_file(file_storage)
            except ValueError as exc:
                return jsonify({'success': False, 'message': str(exc)}), 400

    existing = Complaint.query.order_by(Complaint.id.desc()).first()
    complaint_code = f'CIV-{datetime.utcnow().year}-{(existing.id + 1) if existing else 1:05d}'

    complaint = Complaint(
        complaint_code=complaint_code,
        user_id=user.id,
        title=title,
        description=description,
        category=category,
        image_url=image_url,
        latitude=latitude,
        longitude=longitude,
        address=address,
        priority='MEDIUM',
        status='SUBMITTED',
    )
    db.session.add(complaint)
    db.session.commit()

    notification = Notification(user_id=user.id, complaint_id=complaint.id, message=f'Your complaint {complaint.complaint_code} has been submitted.')
    db.session.add(notification)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Complaint created successfully', 'data': complaint.to_dict()})


@complaints_bp.route('', methods=['GET'], strict_slashes=False)
@complaints_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def list_complaints():
    user = current_user()
    if user.role == 'admin':
        complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()
    elif user.role == 'staff':
        complaints = Complaint.query.filter((Complaint.staff_id == user.id) | (Complaint.department_id.isnot(None))).order_by(Complaint.created_at.desc()).all()
    else:
        complaints = Complaint.query.filter_by(user_id=user.id).order_by(Complaint.created_at.desc()).all()

    return jsonify({'success': True, 'data': [complaint.to_dict(include_user=True, include_department=True) for complaint in complaints]})


@complaints_bp.get('/<int:complaint_id>')
@jwt_required()
def get_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    user = current_user()
    if user.role not in ['admin', 'staff'] and complaint.user_id != user.id:
        return jsonify({'success': False, 'message': 'Access denied'}), 403

    return jsonify({'success': True, 'data': complaint.to_dict(include_user=True, include_department=True)})


@complaints_bp.put('/<int:complaint_id>')
@jwt_required()
def update_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    user = current_user()
    if complaint.user_id != user.id and user.role != 'admin':
        return jsonify({'success': False, 'message': 'Access denied'}), 403

    data = request.get_json(silent=True) or {}
    if 'title' in data:
        complaint.title = data['title']
    if 'description' in data:
        complaint.description = data['description']
    if 'category' in data:
        complaint.category = data['category']
    if 'priority' in data:
        complaint.priority = data['priority']
    if 'status' in data:
        complaint.status = data['status']
    if 'address' in data:
        complaint.address = data['address']
    if 'latitude' in data:
        complaint.latitude = float(data['latitude'])
    if 'longitude' in data:
        complaint.longitude = float(data['longitude'])
    db.session.commit()
    return jsonify({'success': True, 'message': 'Complaint updated successfully', 'data': complaint.to_dict()})


@complaints_bp.delete('/<int:complaint_id>')
@jwt_required()
def delete_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    user = current_user()
    if user.role != 'admin' and complaint.user_id != user.id:
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    db.session.delete(complaint)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Complaint deleted successfully'})


@complaints_bp.put('/<int:complaint_id>/verify')
@jwt_required()
def verify_complaint(complaint_id):
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Only admins can verify complaints'}), 403
    complaint = Complaint.query.get_or_404(complaint_id)
    complaint.status = 'VERIFIED'
    complaint.updated_at = datetime.utcnow()
    db.session.add(ComplaintUpdate(complaint_id=complaint.id, updated_by=user.id, old_status='SUBMITTED', new_status='VERIFIED', remarks='Verified by admin'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Complaint verified successfully', 'data': complaint.to_dict()})


@complaints_bp.put('/<int:complaint_id>/assign')
@jwt_required()
def assign_complaint(complaint_id):
    user = current_user()
    if user.role != 'admin':
        return jsonify({'success': False, 'message': 'Only admins can assign complaints'}), 403
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.get_json(silent=True) or {}
    department_id = data.get('department_id')
    staff_id = data.get('staff_id')
    if department_id:
        complaint.department_id = int(department_id)
    if staff_id:
        complaint.staff_id = int(staff_id)
    complaint.status = 'ASSIGNED'
    db.session.add(ComplaintUpdate(complaint_id=complaint.id, updated_by=user.id, old_status=complaint.status, new_status='ASSIGNED', remarks='Assigned to department and staff'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Complaint assigned successfully', 'data': complaint.to_dict()})


@complaints_bp.put('/<int:complaint_id>/status')
@jwt_required()
def update_status(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    user = current_user()
    if user.role not in ['admin', 'staff'] and complaint.user_id != user.id:
        return jsonify({'success': False, 'message': 'Access denied'}), 403

    data = request.get_json(silent=True) or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'success': False, 'message': 'Status is required'}), 400

    old_status = complaint.status
    complaint.status = new_status
    if new_status == 'RESOLVED':
        complaint.resolved_at = datetime.utcnow()
    db.session.add(ComplaintUpdate(complaint_id=complaint.id, updated_by=user.id, old_status=old_status, new_status=new_status, remarks=data.get('remarks') or 'Status update'))
    db.session.commit()
    return jsonify({'success': True, 'message': 'Status updated successfully', 'data': complaint.to_dict()})
