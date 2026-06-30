# Complaint Management System

A full-stack Complaint Management System for students, built with **React (Vite)**, **FastAPI**, and **MongoDB**.

Students can register, log in, submit complaints, and track their status. Admins can view all complaints, update their status, and delete them.

---

## Tech Stack

- **Frontend:** React (Vite), React Router DOM, Axios
- **Backend:** FastAPI, Motor (async MongoDB driver), Pydantic, JWT auth, bcrypt
- **Database:** MongoDB

---

## Project Structure

```
complaint-management-system/
├── backend/
│   ├── app/
│   │   ├── database.py      # MongoDB connection
│   │   ├── main.py          # FastAPI app + CORS + routers
│   │   ├── auth.py          # JWT creation/validation, get_current_user
│   │   ├── models.py        # Mongo doc -> response dict helpers
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── utils.py         # bcrypt password hashing
│   │   ├── config.py        # Loads .env settings
│   │   └── routes/
│   │       ├── auth.py        # /register, /login
│   │       ├── complaints.py  # /complaints (create), /my-complaints
│   │       └── admin.py       # /admin/complaints (view all, update, delete)
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, ProtectedRoute, ComplaintForm, ComplaintTable
    │   ├── pages/          # Login, Register, Dashboard, SubmitComplaint, MyComplaints, Admin
    │   ├── services/api.js # Axios instance + all API calls
    │   ├── context/AuthContext.jsx  # Auth state via Context API
    │   ├── App.jsx         # Route definitions
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── .env
```

---

## Setup & Running

### 1. Backend

**Prerequisites:** Python 3.10+, MongoDB running locally (or a MongoDB Atlas connection string).

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Edit `.env` if needed (defaults assume MongoDB running on `localhost:27017`):

```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=complaint_management
JWT_SECRET_KEY=change_this_to_a_long_random_secret_key_in_production
```

⚠️ **Important:** Change `JWT_SECRET_KEY` to a long, random string before using this anywhere beyond your own machine.

Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs (Swagger UI) are at `http://localhost:8000/docs`.

### 2. Frontend

**Prerequisites:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`. It's already configured (via `.env`) to call the backend at `http://localhost:8000`.

---

## How It Works

### Student Flow
1. **Register** at `/register` with name, email, department, and password.
2. **Login** at `/login` — the backend returns a JWT, which is stored in `localStorage` and attached to every future API request automatically (via the Axios interceptor in `services/api.js`).
3. From the **Dashboard**, submit a new complaint or view **My Complaints** (only the logged-in student's own complaints, enforced server-side).
4. **Logout** clears the token and redirects to login.

### Admin Flow
- The **Admin** page (`/admin`) is directly accessible — no login required in this version, per the v1 spec.
- Admin can view all complaints, change status via a dropdown (Pending / In Progress / Resolved), and delete complaints.

### Authentication
- Passwords are hashed with **bcrypt** before being stored — plain-text passwords are never saved.
- JWT tokens are signed with `JWT_SECRET_KEY` and expire after `ACCESS_TOKEN_EXPIRE_MINUTES` (default 24 hours).
- Protected routes use the `get_current_user` dependency in `auth.py`, which decodes the token and fetches the matching user from MongoDB.
- On the frontend, `ProtectedRoute.jsx` redirects unauthenticated users to `/login`.

---

## API Reference

| Method | Endpoint                       | Auth Required | Description                          |
|--------|---------------------------------|----------------|---------------------------------------|
| POST   | `/register`                    | No             | Register a new student                |
| POST   | `/login`                       | No             | Login, returns JWT + user info        |
| POST   | `/complaints`                  | Yes (student)  | Submit a new complaint                |
| GET    | `/my-complaints`               | Yes (student)  | Get only the logged-in student's complaints |
| GET    | `/admin/complaints`            | No (v1)        | Get all complaints                    |
| PUT    | `/admin/complaints/{id}`       | No (v1)        | Update a complaint's status           |
| DELETE | `/admin/complaints/{id}`       | No (v1)        | Delete a complaint                    |

> **Note:** Admin endpoints are namespaced under `/admin/complaints` (rather than the bare `/complaints` path) to keep them clearly distinct from the student-facing `POST /complaints` and `GET /my-complaints` routes. This avoids any ambiguity and makes it straightforward to add admin authentication later (see below).

---

## Things to Double-Check Before Using This for Real

- **MongoDB connection:** Make sure MongoDB is actually running (`mongod`) or update `MONGO_URI` to point at your Atlas cluster.
- **JWT secret:** Replace the placeholder `JWT_SECRET_KEY` in `backend/.env` with a real random secret.
- **CORS:** `main.py` currently allows all origins (`allow_origins=["*"]`) for ease of local development — restrict this to your actual frontend domain before deploying.
- **Admin security:** As noted in the spec, the admin panel has no authentication in v1. Anyone with the `/admin` URL can manage complaints. Don't deploy this publicly without adding admin login first.

---

## Suggested Next Steps (from the original spec's "Optional Future Enhancements")

- Admin login with JWT + role-based authorization
- Search and filter complaints by status
- Student profile page
- Image attachments on complaints
- Email notifications on status changes
- Complaint categories
- Dashboard statistics
- Pagination
- Dark mode
