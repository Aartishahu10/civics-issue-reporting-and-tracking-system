from datetime import datetime

from extensions import db


class ComplaintUpdate(db.Model):
    __tablename__ = 'complaint_updates'

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaints.id'), nullable=False)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    old_status = db.Column(db.String(50), nullable=True)
    new_status = db.Column(db.String(50), nullable=True)
    remarks = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    complaint = db.relationship('Complaint', backref='updates')
    updater = db.relationship('User', foreign_keys=[updated_by])

    def to_dict(self):
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'updated_by': self.updated_by,
            'old_status': self.old_status,
            'new_status': self.new_status,
            'remarks': self.remarks,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
