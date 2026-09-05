# CivicConnect AI – Smart Civic Issues Reporting and Tracking System

A full-stack civic issue reporting and tracking platform built with React + Vite, Flask, and MySQL. It includes AI-powered classification, priority prediction, chatbot support, complaint workflow, maps, admin dashboards, and staff task flows.

## Project structure

- frontend/
- backend/
- database/
- README.md

## Tech stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Recharts
- Leaflet
- Lucide React

### Backend
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- MySQL

## Backend setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Create a MySQL database named `civicconnect`.
3. Copy `.env.example` to `.env` and update values.
4. Run the app:
   ```bash
   python app.py
   ```

## Frontend setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```

## Database setup

1. Create MySQL database: `CREATE DATABASE civicconnect;`
2. Import schema and demo seed scripts from `database/`.

## Default demo credentials

- Admin: `admin@civicconnect.ai` / `Admin@123`
- Staff: `staff1@civicconnect.ai` / `Staff@123`
- Citizen: `citizen1@example.com` / `Citizen@123`

## API endpoints

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/me`
- `/api/complaints`
- `/api/complaints/:id`
- `/api/ai/classify`
- `/api/ai/priority`
- `/api/ai/duplicate`
- `/api/ai/sentiment`
- `/api/ai/chat`
- `/api/admin/statistics`
- `/api/admin/users`
- `/api/admin/departments`
- `/api/admin/analytics`

## Example workflow

1. Citizen registers and logs in.
2. Citizen reports an issue with image, description, and location.
3. AI classifies and predicts priority.
4. Admin verifies complaint and assigns department/staff.
5. Staff completes the task and marks it resolved.
6. Citizen leaves feedback after closure.

## Notes

- AI services use a local rule-based fallback when external models are unavailable.
- File uploads are stored in the local uploads folder.
- JWT access tokens are used for authenticated routes.
