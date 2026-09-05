from datetime import datetime

from extensions import db


class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    complaint_code = db.Column(db.String(30), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(255), nullable=True)
    priority = db.Column(db.String(30), default='MEDIUM')
    status = db.Column(db.String(30), default='SUBMITTED')
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', foreign_keys=[user_id], backref='complaints')
    department = db.relationship('Department', backref='complaints')
    staff = db.relationship('User', foreign_keys=[staff_id])

    def to_dict(self, include_user=False, include_department=False):
        data = {
            'id': self.id,
            'complaint_code': self.complaint_code,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'address': self.address,
            'priority': self.priority,
            'status': self.status,
            'department_id': self.department_id,
            'staff_id': self.staff_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
        }
        if include_user:
            data['user'] = self.user.to_dict() if self.user else None
        if include_department and self.department:
            data['department'] = self.department.to_dict()
        return data
