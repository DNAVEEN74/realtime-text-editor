
# CollabEdit

## Description

**CollabEdit** is a real-time collaborative text editor that enables users to create and manage documents with ease. Users can sign up or log in to start creating unique documents, switch between previously created projects, and collaborate in real time by sharing a session ID. Contributors can join the session without needing an account, and all participants can download the document as a PDF. Sessions automatically expire when the document owner closes the browser tab.

## Demo

[Live link](https://collabeditfrontend.vercel.app/)

## Features

- User authentication (JWT-based signup, login, and logout)

- Real-time collaboration via WebSockets

- Document creation with unique titles

- Switch between existing projects

- Share session ID for collaborative editing (contributors don’t need accounts)

- Download documents as PDFs

- Session expiration upon document owner's tab closure


## Upcoming Features

- CRDT's (in development)


## Technologies Used

- **Frontend:** React.js, Axios, ReactQuill, Lucid

- **Backend:** Express.js, Node.js, WebSockets

- **Database:** MongoDB, Mongoose

- **Validation:** Zod

- **Authentication:** JWT


## Installation

1. Clone the repository:
```bash
git clone https://github.com/DNAVEEN74/realtime-text-editor.git
```

2. Navigate to the project directory:
```bash
cd realtime-text-editor
```

3. Install dependencies for both the frontend and backend:

For backend:
```bash
cd backend
npm install
```
For frontend:
```bash
cd frontend
npm install
```



## Running the Project

**Backend**

1. Set up environment variables: Create a .env file in the backend directory and add the following variables:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
2. Start the backend server:
```bash
node index.js
```
**Frontend**

3. Start the React development server:
```bash
npm run dev
```

4. Open your browser and go to: http://localhost:5173
