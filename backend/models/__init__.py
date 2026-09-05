from .user import User
from .department import Department
from .complaint import Complaint
from .complaint_update import ComplaintUpdate
from .feedback import Feedback
from .notification import Notification
from .supporter import Supporter
from extensions import db


def init_db():
    from .seed import seed_data
    seed_data()
