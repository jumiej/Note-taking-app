# 📝 Note-Taking API

A RESTful API for a note-taking application built with **Node.js**, **Express**, **TypeScript**, and **MongoDB Atlas**. Features full user authentication with JWT tokens.

## 🌐 Live API

Base URL: `https://note-taking-app-hcyn.onrender.com`

---

## 🛠️ Tech Stack

| Technology               | Purpose          |
| ------------------------ | ---------------- |
| Node.js + Express        | Server framework |
| TypeScript               | Type safety      |
| MongoDB Atlas + Mongoose | Database         |
| JWT (jsonwebtoken)       | Authentication   |
| bcryptjs                 | Password hashing |
| Render                   | Deployment       |

---

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts              # MongoDB connection
├── controllers/
│   ├── authController.ts  # Register & login logic
│   └── noteController.ts  # Note CRUD logic
├── errors/
│   └── AppError.ts        # Custom error class
├── interfaces/
│   └── index.ts           # TypeScript interfaces
├── middleware/
│   ├── auth.ts            # JWT protection middleware
│   ├── logger.ts          # Request logging middleware
│   └── validate.ts        # Input validation middleware
├── models/
│   ├── User.ts            # User mongoose model
│   └── Note.ts            # Note mongoose model
├── routes/
│   ├── authRoutes.ts      # Auth endpoints
│   └── noteRoutes.ts      # Note endpoints
└── server.ts              # Entry point
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jumiej/Note-taking-app.git

# Navigate into project
cd Note-taking-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

---

## 🔐 Authentication

This API uses **JWT Bearer Token** authentication.

1. Register or Login to get a token
2. Include the token in all note requests:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📌 API Endpoints

### Auth Endpoints (Public)

#### Register a New User

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "Jumie",
  "email": "jumie@gmail.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "6a25f25a388ee256a96d6c1d",
    "name": "Jumie",
    "email": "jumie@gmail.com"
  }
}
```

---

#### Login

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "jumie@gmail.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "6a25f25a388ee256a96d6c1d",
    "name": "Jumie",
    "email": "jumie@gmail.com"
  }
}
```

---

### Note Endpoints (Protected 🔒)

> All note endpoints require `Authorization: Bearer TOKEN` header

#### Get All Notes

```
GET /api/notes
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6a1af9ec2b5c308ba278280d",
      "title": "My Work Note",
      "content": "Finish the API project",
      "category": {
        "name": "work",
        "color": "blue"
      },
      "user": "6a25f25a388ee256a96d6c1d",
      "createdAt": "2026-06-07T10:30:00.000Z",
      "updatedAt": "2026-06-07T10:30:00.000Z"
    }
  ]
}
```

---

#### Get Note by ID

```
GET /api/notes/:id
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "6a1af9ec2b5c308ba278280d",
    "title": "My Work Note",
    "content": "Finish the API project",
    "category": {
      "name": "work",
      "color": "blue"
    },
    "user": "6a25f25a388ee256a96d6c1d",
    "createdAt": "2026-06-07T10:30:00.000Z",
    "updatedAt": "2026-06-07T10:30:00.000Z"
  }
}
```

---

#### Get Notes by Category

```
GET /api/notes/categories/:categoryId
```

**Available Categories:** `work` `personal` `study` `health` `finance` `other`

**Example:** `GET /api/notes/categories/work`

**Success Response (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

#### Create a Note

```
POST /api/notes
```

**Request Body:**

```json
{
  "title": "My Work Note",
  "content": "Finish the API project",
  "category": {
    "name": "work",
    "color": "blue"
  }
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "6a1af9ec2b5c308ba278280d",
    "title": "My Work Note",
    "content": "Finish the API project",
    "category": {
      "name": "work",
      "color": "blue"
    },
    "user": "6a25f25a388ee256a96d6c1d",
    "createdAt": "2026-06-07T10:30:00.000Z",
    "updatedAt": "2026-06-07T10:30:00.000Z"
  }
}
```

---

#### Update a Note

```
PUT /api/notes/:id
```

**Request Body (all fields optional):**

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "category": {
    "name": "personal",
    "color": "green"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "6a1af9ec2b5c308ba278280d",
    "title": "Updated Title",
    ...
  }
}
```

---

#### Delete a Note

```
DELETE /api/notes/:id
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

| Status Code | Meaning                                 |
| ----------- | --------------------------------------- |
| 400         | Bad Request — invalid input             |
| 401         | Unauthorized — missing or invalid token |
| 404         | Not Found — resource doesn't exist      |
| 500         | Server Error — something went wrong     |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire after **7 days**
- Users can only access **their own notes**
- Passwords never returned in responses
- Input validation on all endpoints

---

## 📮 Testing with Postman

1. Import the collection or create requests manually
2. Create an environment with variable `base_url` = your API URL
3. Register → copy the token
4. Add token to note requests under **Authorization → Bearer Token**
5. Use `{{token}}` variable by adding this script to your Login request under **Scripts → Post-response:**

---

## 👨‍💻 Author

**Jumie** — Built as part of Learnable 2025/2026 program
