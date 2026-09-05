import os

os.chdir('c:/Users/HP/OneDrive/Desktop/civics issue repoting and tracking system/backend')

from app import app

client = app.test_client()

resp = client.post(
    '/api/auth/register',
    json={
        'name': 'Test Citizen',
        'email': 'testcitizen@example.com',
        'phone': '1111111111',
        'password': 'Password123',
        'confirm_password': 'Password123',
        'role': 'citizen',
    },
)
print('REGISTER', resp.status_code, resp.get_json())

login = client.post(
    '/api/auth/login',
    json={'email': 'admin@civicconnect.ai', 'password': 'Admin@123'},
)
print('LOGIN', login.status_code, login.get_json()['success'])
print('APP_OK', app is not None)
