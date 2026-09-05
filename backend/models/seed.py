from extensions import db
from .user import User
from .department import Department
from .complaint import Complaint


def seed_departments():
    departments = [
        ('Road Department', 'Road repairs, potholes, asphalt work'),
        ('Sanitation Department', 'Waste collection and cleanliness issues'),
        ('Water Department', 'Water leakages and supply problems'),
        ('Electrical Department', 'Streetlights and electrical infrastructure'),
        ('Drainage Department', 'Drainage, flooding, sewage issues'),
        ('Parks Department', 'Park and public landscape maintenance'),
        ('General Infrastructure', 'Cross-department civic maintenance tasks'),
    ]
    for name, description in departments:
        exists = Department.query.filter_by(name=name).first()
        if not exists:
            db.session.add(Department(name=name, description=description))
    db.session.commit()


def seed_users():
    admin_exists = User.query.filter_by(email='admin@civicconnect.ai').first()
    if not admin_exists:
        admin = User(name='System Admin', email='admin@civicconnect.ai', phone='9999999999', role='admin')
        admin.set_password('Admin@123')
        db.session.add(admin)

    staff_roles = [
        ('Rahul Verma', 'staff1@civicconnect.ai', '9876543210', 'staff'),
        ('Ananya Shah', 'staff2@civicconnect.ai', '9876543211', 'staff'),
        ('Neeraj Patel', 'staff3@civicconnect.ai', '9876543212', 'staff'),
    ]
    for name, email, phone, role in staff_roles:
        if not User.query.filter_by(email=email).first():
            user = User(name=name, email=email, phone=phone, role=role)
            user.set_password('Staff@123')
            db.session.add(user)

    citizens = [
        ('Amit Kumar', 'citizen1@example.com', '9000000001', 'citizen'),
        ('Priya Nair', 'citizen2@example.com', '9000000002', 'citizen'),
        ('Rohan Mehta', 'citizen3@example.com', '9000000003', 'citizen'),
        ('Sneha Iyer', 'citizen4@example.com', '9000000004', 'citizen'),
        ('Karan Singh', 'citizen5@example.com', '9000000005', 'citizen'),
        ('Meera Joshi', 'citizen6@example.com', '9000000006', 'citizen'),
        ('Vikram Rao', 'citizen7@example.com', '9000000007', 'citizen'),
        ('Divya Sen', 'citizen8@example.com', '9000000008', 'citizen'),
    ]
    for name, email, phone, role in citizens:
        if not User.query.filter_by(email=email).first():
            user = User(name=name, email=email, phone=phone, role=role)
            user.set_password('Citizen@123')
            db.session.add(user)
    db.session.commit()


def seed_complaints():
    if Complaint.query.first():
        return

    department_map = {
        'Pothole': 'Road Department',
        'Garbage': 'Sanitation Department',
        'Water Leakage': 'Water Department',
        'Streetlight': 'Electrical Department',
        'Drainage': 'Drainage Department',
        'Road Damage': 'Road Department',
        'Fallen Tree': 'Parks Department',
        'Infrastructure': 'General Infrastructure',
        'Other': 'General Infrastructure',
    }

    complaints = [
        ('Large pothole near school gate', 'There is a large pothole near the school gate causing risk for children and bikes.', 'Pothole', 28.6139, 77.2090, 'Near Sector 15, Noida', 'CRITICAL', 'VERIFIED', 'Road Department'),
        ('Garbage overflow at market', 'Garbage has not been collected for days and is spilling into the road.', 'Garbage', 28.6238, 77.2152, 'Main Market, Noida', 'HIGH', 'ASSIGNED', 'Sanitation Department'),
        ('Streetlight not working', 'The road light near the crossing is off, causing unsafe conditions at night.', 'Streetlight', 28.6180, 77.2300, 'Crossing 6, Noida', 'MEDIUM', 'IN_PROGRESS', 'Electrical Department'),
        ('Water pipe leakage', 'Water is leaking from pipeline and creating puddles on pavement.', 'Water Leakage', 28.6122, 77.2220, 'A block, Noida', 'HIGH', 'RESOLVED', 'Water Department'),
        ('Drain cover broken', 'Broken drain cover is dangerous for pedestrians and cyclists.', 'Drainage', 28.6098, 77.2367, 'Green Park Road', 'HIGH', 'VERIFIED', 'Drainage Department'),
        ('Road damaged after rain', 'Road surface is broken and getting worse after the recent rain.', 'Road Damage', 28.6047, 77.2401, 'Bharat Nagar', 'MEDIUM', 'SUBMITTED', 'Road Department'),
        ('Tree fell across footpath', 'A fallen tree blocks the pedestrian path and is a traffic hazard.', 'Fallen Tree', 28.6351, 77.2058, 'Park Avenue', 'CRITICAL', 'ASSIGNED', 'Parks Department'),
        ('Broken bench in public park', 'Public infrastructure in the park is damaged and needs repair.', 'Infrastructure', 28.6275, 77.2881, 'City Park', 'LOW', 'RESOLVED', 'General Infrastructure'),
        ('Open manhole near lane', 'An open manhole is visible near the main lane and could cause accidents.', 'Other', 28.6153, 77.2464, 'Lane 4, Sector 12', 'CRITICAL', 'VERIFIED', 'General Infrastructure'),
        ('Sewage water pooling', 'Sewage is collecting in a low area near the bus stop.', 'Drainage', 28.6062, 77.2145, 'Bus stop area, Sector 18', 'CRITICAL', 'ASSIGNED', 'Drainage Department'),
        ('Traffic sign damaged', 'A warning sign has fallen and needs replacement.', 'Infrastructure', 28.6389, 77.2272, 'Traffic Junction 3', 'MEDIUM', 'RESOLVED', 'General Infrastructure'),
        ('Dustbins overflowing', 'Bins near the mosque are overflowed and smell bad.', 'Garbage', 28.6320, 77.2485, 'Mosque Road', 'MEDIUM', 'IN_PROGRESS', 'Sanitation Department'),
        ('Broken Railings', 'The protective railing on the bridge is broken and unsafe.', 'Infrastructure', 28.6107, 77.2174, 'Bridge Road', 'HIGH', 'VERIFIED', 'General Infrastructure'),
        ('Water tank leakage', 'Water is leaking from a public tank near the housing block.', 'Water Leakage', 28.6203, 77.2565, 'Housing Block 3', 'MEDIUM', 'ASSIGNED', 'Water Department'),
        ('Streetlight flicker issue', 'One light near the market flickers all night and is unreliable.', 'Streetlight', 28.6245, 77.2048, 'Market Road', 'MEDIUM', 'SUBMITTED', 'Electrical Department'),
        ('Pothole on flyover ramp', 'The pothole on the flyover ramp has grown large and is hazardous.', 'Pothole', 28.6078, 77.2345, 'Flyover Ramp', 'CRITICAL', 'VERIFIED', 'Road Department'),
        ('Waste burning near colony', 'Residents report illegal waste burning causing smoke and pollution.', 'Garbage', 28.6318, 77.2417, 'Colony B', 'HIGH', 'ASSIGNED', 'Sanitation Department'),
        ('Water pipeline burst', 'Water supply line burst near the residential lane is flooding the area.', 'Water Leakage', 28.6189, 77.1998, 'Residential Lane 7', 'CRITICAL', 'IN_PROGRESS', 'Water Department'),
        ('Tree branch fallen', 'A large branch has fallen onto the footpath creating hazards.', 'Fallen Tree', 28.6302, 77.2304, 'Gulmohar Street', 'MEDIUM', 'SUBMITTED', 'Parks Department'),
        ('Drain clogged with plastic', 'The drain is clogged with plastic waste and water is backing up.', 'Drainage', 28.6141, 77.2462, 'Center Road', 'HIGH', 'VERIFIED', 'Drainage Department'),
    ]

    users = User.query.all()
    citizens = [u for u in users if u.role == 'citizen']
    staff = [u for u in users if u.role == 'staff']
    admin = User.query.filter_by(role='admin').first()
    departments = Department.query.all()
    dept_by_name = {d.name: d for d in departments}

    for idx, (title, desc, category, lat, lon, address, priority, status, dept_name) in enumerate(complaints, start=1):
        user = citizens[idx % len(citizens)] if citizens else admin
        dept = dept_by_name.get(dept_name)
        staff_member = staff[idx % len(staff)] if staff else None
        complaint = Complaint(
            complaint_code=f'CIV-2026-{idx:05d}',
            user_id=user.id,
            title=title,
            description=desc,
            category=category,
            latitude=lat,
            longitude=lon,
            address=address,
            priority=priority,
            status=status,
            department_id=dept.id if dept else None,
            staff_id=staff_member.id if staff_member else None,
        )
        db.session.add(complaint)
    db.session.commit()


def seed_data():
    seed_departments()
    seed_users()
    seed_complaints()
