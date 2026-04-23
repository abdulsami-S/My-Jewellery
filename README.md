# 💎 My Jewellery — Full Stack Jewellery Web Application

A modern full-stack web application designed to showcase jewellery products with a clean UI, secure authentication, and real-time database integration. This project demonstrates frontend, backend, and deployment skills using industry-level tools.

---

## 🌐 Live Demo

🔗 https://jewellery-hub.up.railway.app

🔗 https://my-jewellery.vercel.app

---

## 🚀 Features

### 👤 User Side

* Browse jewellery products
* Clean and responsive UI
* Dynamic product display from database

### 🔐 Organizer/Admin Side

* Secure login system (bcrypt authentication)
* Organizer dashboard access
* Manage product data

### ⚙️ Backend Features

* REST API using FastAPI
* MongoDB Atlas integration
* Secure password hashing
* Error handling and validation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML, CSS, JavaScript

### Backend

* FastAPI (Python)
* MongoDB Atlas
* Pymongo
* Passlib (bcrypt)

### Deployment

* Railway (Backend Hosting)
* MongoDB Atlas (Cloud Database)

---

## 📂 Project Structure

```
My-Jewellery/
 ├── project/
 │   ├── backend/
 │   │   ├── server.py
 │   │   ├── create_organizer.py
 │   │   ├── requirements.txt
 │   │   └── .env
 │   ├── frontend/
 │   │   ├── src/
 │   │   ├── public/
 │   │   └── package.json
 │
 └── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/abdulsami-S/My-Jewellery.git
cd My-Jewellery/project
```

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
python server.py
```

### 3️⃣ Frontend Setup

```
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables (.env)

Create a `.env` file inside backend:

```
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/jewellery
DB_NAME=jewellery
```

---

## 📡 API Endpoints (Sample)

* `POST /api/organizer/login` → Organizer Login
* `GET /api/products` → Fetch Products
* `POST /api/products` → Add Product

---

## 🧠 What I Learned

* Full-stack application architecture
* Authentication using bcrypt hashing
* MongoDB cloud database integration
* Debugging deployment issues (Railway + MongoDB)
* Difference between local and production environments

---

## 📸 Screenshots (I Will This Add Later)

* Home Page
* Organizer Login
* Dashboard
* Product Listing
* etc..

---

## 🎯 Purpose

This project was built to gain hands-on experience in building and deploying a full-stack web application with real-world features like authentication, database integration, and cloud deployment.

---

## 👨‍💻 Author

**Abdul Sami**

🔗 GitHub: https://github.com/abdulsami-S

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
