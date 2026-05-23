# DevPulse 🚀

> Internal Tech Issue & Feature Tracker — A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🌐 Live URL

```

```

## ✨ Features

- User registration and authentication with JWT
- Role-based access control (contributor / maintainer)
- Create, view, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Secure password hashing with bcrypt
- PostgreSQL database with raw SQL queries (no ORM)

## 🛠️ Tech Stack

| Technology   | Usage                    |
| ------------ | ------------------------ |
| Node.js      | Runtime environment      |
| TypeScript   | Type-safe development    |
| Express.js   | Web framework            |
| PostgreSQL   | Relational database      |
| pg           | Native PostgreSQL driver |
| bcryptjs     | Password hashing         |
| jsonwebtoken | JWT authentication       |
| NeonDB       | Cloud PostgreSQL hosting |

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/zesanahmed/devPulse.git
cd devPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the development server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 🗄️ Database Schema

### Table: `users`

| Column     | Type         | Description                     |
| ---------- | ------------ | ------------------------------- |
| id         | SERIAL PK    | Auto-incrementing unique ID     |
| name       | VARCHAR(255) | Full name of the user           |
| email      | VARCHAR(255) | Unique email address            |
| password   | VARCHAR(255) | Hashed password (never exposed) |
| role       | VARCHAR(20)  | `contributor` or `maintainer`   |
| created_at | TIMESTAMP    | Account creation time           |
| updated_at | TIMESTAMP    | Last update time                |

### Table: `issues`

| Column      | Type         | Description                          |
| ----------- | ------------ | ------------------------------------ |
| id          | SERIAL PK    | Auto-incrementing unique ID          |
| title       | VARCHAR(150) | Short headline of the issue          |
| description | TEXT         | Detailed explanation                 |
| type        | VARCHAR(20)  | `bug` or `feature_request`           |
| status      | VARCHAR(20)  | `open`, `in_progress`, or `resolved` |
| reporter_id | INTEGER      | ID of the user who created the issue |
| created_at  | TIMESTAMP    | Issue creation time                  |
| updated_at  | TIMESTAMP    | Last update time                     |

## 🌐 API Endpoints

### Auth Module

| Method | Endpoint         | Access | Description             |
| ------ | ---------------- | ------ | ----------------------- |
| POST   | /api/auth/signup | Public | Register a new user     |
| POST   | /api/auth/login  | Public | Login and get JWT token |

### Issues Module

| Method | Endpoint               | Access                | Description          |
| ------ | ---------------------- | --------------------- | -------------------- |
| POST   | /api/issues            | Authenticated         | Create a new issue   |
| GET    | /api/issues            | Public                | Get all issues       |
| GET    | /api/issues/:id        | Public                | Get a single issue   |
| PATCH  | /api/issues/:id        | Maintainer / Own+Open | Update issue details |
| PATCH  | /api/issues/:id/status | Maintainer only       | Update issue status  |
| DELETE | /api/issues/:id        | Maintainer only       | Delete an issue      |
