# 236417_LeThiNgocNhu
# Food Management System

## 1. Project Description

This project is a food management system developed for the Cloud Computing course. It allows users to view, search, add, update, and delete food items.

The system uses React for the frontend, Node.js and Express for the backend, and MongoDB Atlas for cloud database storage. Docker and Docker Hub are used for containerization and image storage, while Render is used for cloud deployment.

## 2. Technologies Used

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Version Control: Git, GitHub
- Containerization: Docker
- Image Registry: Docker Hub
- Cloud Deployment: Render

## 3. Project Structure

```text
MSSV_HoTen/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── .gitignore
└── README.md
```

## 4. Main Features

- Display a list of food items.
- View food details.
- Add new food items.
- Update food information.
- Delete food items.
- Search for food by name, category, or cuisine.
- Store and retrieve food data from MongoDB Atlas.

## 5. Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A MongoDB Atlas account

### Backend Setup

1. Open a terminal and navigate to the backend directory.

```bash
cd backend
```

2. Install the dependencies.

```bash
npm install
```

3. Create a `.env` file and configure the environment variables.

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

4. Start the backend server.

```bash
npm start
```

### Frontend Setup

1. Open another terminal and navigate to the frontend directory.

```bash
cd frontend
```

2. Install the dependencies.

```bash
npm install
```

3. Start the development server.

```bash
npm run dev
```

Configure the frontend API URL to point to the backend server.

## 6. Environment Variables and Security

- `PORT`: Port used by the backend server.
- `MONGODB_URI`: MongoDB Atlas connection string.

Sensitive information must be stored in environment variables and must not be committed to GitHub.

## 7. Author

- Student ID: Your Student ID
- Full Name: Your Full Name

## 8. Deployment

The GitHub repository URL, Docker Hub image URLs, frontend URL, and backend API URL will be added after deployment is completed.