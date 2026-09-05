CATEGORY_RULES = {
    'Pothole': ['pothole', 'road crack', 'broken asphalt', 'damaged road'],
    'Garbage': ['garbage', 'waste', 'trash', 'dumping'],
    'Streetlight': ['streetlight', 'lamp', 'light pole', 'broken light'],
    'Water Leakage': ['water leak', 'leakage', 'pipe burst', 'water pipeline'],
    'Drainage': ['drain', 'clogged', 'sewer', 'waterlogging'],
    'Road Damage': ['road damage', 'damaged road', 'road broken'],
    'Fallen Tree': ['fallen tree', 'tree branch', 'broken branch'],
    'Infrastructure': ['bench', 'rail', 'sign', 'public structure'],
    'Other': ['other', 'general issue']
}


def classify_issue_from_text(description, category_hint=None):
    text = (description or '').lower()
    if category_hint:
        matched = category_hint.lower()
        for key, keywords in CATEGORY_RULES.items():
            if matched == key.lower() or matched in [k.lower() for k in keywords]:
                return {'category': key, 'confidence': 0.88}

    best_category = 'Other'
    best_score = 0.0
    for category, keywords in CATEGORY_RULES.items():
        score = sum(1 for keyword in keywords if keyword in text)
        if score > best_score:
            best_score = score
            best_category = category

    confidence = 0.82 if best_score > 0 else 0.65
    return {'category': best_category, 'confidence': round(confidence, 2)}


def predict_priority(category, description, location, similar_count=0):
    text = (description or '').lower()
    severity = 0
    if any(word in text for word in ['injury', 'danger', 'serious', 'accident', 'risk', 'unsafe', 'sewage', 'flood', 'burst']):
        severity += 2
    if any(word in text for word in ['large', 'major', 'damaged', 'broken', 'overflow', 'blocked']):
        severity += 1

    category_weight = {
        'Pothole': 2,
        'Garbage': 1,
        'Streetlight': 1,
        'Water Leakage': 2,
        'Drainage': 2,
        'Road Damage': 2,
        'Fallen Tree': 2,
        'Infrastructure': 1,
        'Other': 1,
    }

    base = category_weight.get(category, 1) + severity + min(similar_count, 3)
    if base >= 6 or location in ['Main road', 'Highway', 'Flyover']:
        level = 'CRITICAL'
    elif base >= 4:
        level = 'HIGH'
    elif base >= 2:
        level = 'MEDIUM'
    else:
        level = 'LOW'

    reasons = [f'Category: {category}', f'Severity score: {base}', f'Similar reports: {similar_count}']
    return {'priority': level, 'reason': ' | '.join(reasons)}


def detect_duplicate(location, category, description, complaints=None):
    if not complaints:
        return {'duplicate': False}
    text = (description or '').lower()
    for complaint in complaints:
        distance = abs(float(complaint.latitude) - float(location.get('latitude', 0))) + abs(float(complaint.longitude) - float(location.get('longitude', 0)))
        if distance < 0.01 and complaint.category == category:
            return {
                'duplicate': True,
                'complaint_id': complaint.complaint_code,
                'distance_km': round(distance * 111, 2),
                'status': complaint.status,
                'supporters': len(complaint.supporters or []),
                'message': 'A similar issue has already been reported nearby.'
            }
        if description and complaint.description and description.lower() in complaint.description.lower():
            return {
                'duplicate': True,
                'complaint_id': complaint.complaint_code,
                'distance_km': round(0.5, 2),
                'status': complaint.status,
                'supporters': len(complaint.supporters or []),
                'message': 'A similar issue has already been reported nearby.'
            }
    return {'duplicate': False}


def analyze_sentiment(text):
    lower = (text or '').lower()
    negative_words = ['danger', 'serious', 'injured', 'unsafe', 'broken', 'damaged', 'overflow', 'burst', 'flood', 'accident']
    positive_words = ['good', 'fine', 'resolved', 'fixed', 'working']
    negative_count = sum(1 for word in negative_words if word in lower)
    positive_count = sum(1 for word in positive_words if word in lower)
    sentiment = 'Negative' if negative_count >= positive_count else 'Positive'
    urgency = 'High' if negative_count >= 2 else 'Medium'
    return {'sentiment': sentiment, 'urgency': urgency}


def civic_chat_response(question, latest_complaint=None):
    q = (question or '').lower()
    if 'pothole' in q:
        return 'To report a pothole, open the Report Issue page, choose the Pothole category, add the location, and upload a photo if available.'
    if 'track' in q or 'status' in q or 'latest complaint' in q:
        if latest_complaint:
            return f'Your latest complaint is {latest_complaint.complaint_code}, currently marked as {latest_complaint.status}.'
        return 'You can track your complaints from the dashboard or complaint list.'
    if 'in progress' in q:
        return 'In Progress means the responsible department or staff member has accepted the work and is actively resolving it.'
    if 'garbage' in q:
        return 'Report garbage issues from the Report Issue page by selecting the Garbage category and adding the exact location.'
    if 'not resolved' in q or 'unresolved' in q:
        return 'You can contact the assigned department through your complaint details page or raise a follow-up from the dashboard.'
    if 'how do i report' in q:
        return 'Click Report an Issue, fill in the form, upload an image, and choose your location. Your issue will be reviewed by authorities.'
    return 'I can help you with complaint reporting, tracking, and civic issue guidance. Ask about a pothole, garbage, status, or resolution.'
