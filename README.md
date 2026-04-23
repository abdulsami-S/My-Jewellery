# 💎 My Jewellery — Full Stack Jewellery Web Application

A modern full-stack web application designed to showcase jewellery products with a clean UI, secure authentication, and real-time database integration. This project demonstrates frontend, backend, and deployment skills using industry-level tools.

---

## 🌐 Live Demo

🔗 https://my-jewellery.vercel.app 

🔗 https://jewellery-hub.up.railway.app


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
 <img width="1470" height="836" alt="image" src="https://github.com/user-attachments/assets/63e97047-3076-476e-9701-f381db35da85" />


* Organizer Login
<img width="1470" height="835" alt="image" src="https://github.com/user-attachments/assets/532ae729-7a43-4904-8fe6-d657b2c29738" />

 
* Dashboard
 <img width="1470" height="834" alt="image" src="https://github.com/user-attachments/assets/9c6a6193-daf8-4309-8231-af95d91fcc1e" />


* Product Listing
 <img width="1470" height="837" alt="image" src="https://github.com/user-attachments/assets/98fc03e7-2ac9-49fa-b4ae-d46918f42193" />

   
* Metal Rates
 <img width="1470" height="837" alt="image" src="https://github.com/user-attachments/assets/e5ac646f-17cb-40c1-8065-91fe44e0485c" />


* Contact Page
 <img width="1470" height="833" alt="image" src="https://github.com/user-attachments/assets/e08deb94-69c2-42f3-834e-3128ac26e372" />
 


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
