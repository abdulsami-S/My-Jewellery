<div align="center">

# 💎 SAM Gold Works
### *Where Tradition Meets Elegance Since 1995*

**A premium full-stack jewellery web application — browse collections, see live gold/silver prices, and enquire with one tap.**

<br/>

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-my--jewellery.vercel.app-gold?style=for-the-badge)](https://my-jewellery.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-Railway-blueviolet?style=for-the-badge)](https://jewellery-hub.up.railway.app/api/)
[![Tech](https://img.shields.io/badge/React%20+%20FastAPI-Full%20Stack-orange?style=for-the-badge)](#-tech-stack)
[![DB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge)](#)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><b>🏠 Home Page</b></td>
    <td align="center"><b>💍 Collections</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/63e97047-3076-476e-9701-f381db35da85" width="480"/></td>
    <td><img src="https://github.com/user-attachments/assets/98fc03e7-2ac9-49fa-b4ae-d46918f42193" width="480"/></td>
  </tr>
  <tr>
    <td align="center"><b>📊 Metal Rates</b></td>
    <td align="center"><b>📬 Contact Page</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/e5ac646f-17cb-40c1-8065-91fe44e0485c" width="480"/></td>
    <td><img src="https://github.com/user-attachments/assets/e08deb94-69c2-42f3-834e-3128ac26e372" width="480"/></td>
  </tr>
  <tr>
    <td align="center"><b>🔐 Organizer Login</b></td>
    <td align="center"><b>🛠️ Admin Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/532ae729-7a43-4904-8fe6-d657b2c29738" width="480"/></td>
    <td><img src="https://github.com/user-attachments/assets/9c6a6193-daf8-4309-8231-af95d91fcc1e" width="480"/></td>
  </tr>
</table>

---

## 🤔 What Is This? (For Non-Tech Users)

Think of this as a **digital showroom** for a jewellery shop:

- 🛍️ **Customers** can browse jewellery, see today's gold/silver prices, and contact the shop via WhatsApp or a form — all from their phone or computer.
- 🔐 **The shop owner (organizer)** logs in with a password to manage products, update metal rates, and view customer enquiries.
- ☁️ **Everything is online** — no app to install, works on any device, data is stored securely in the cloud.

---

## ✨ Features

### For Customers (Public)
| Feature | Description |
|---------|-------------|
| 🏠 **Home Page** | Beautiful landing page with hero section and metal rate ticker |
| 💍 **Collections** | Browse all jewellery with filters (Gold/Silver/Diamond, category, occasion) |
| 💰 **Live Prices** | Each product shows a real-time price calculated from today's metal rates |
| 📊 **Metal Rates Page** | See today's Gold 22K, Gold 24K, Silver & Diamond rates with price formula |
| 🔍 **Product Detail** | Full image gallery, specifications, and transparent price breakdown |
| 📬 **Contact Form** | Send an enquiry directly to the shop |
| 💬 **WhatsApp Button** | One-tap to chat with the shop on WhatsApp |
| 📖 **About & Workshop** | Learn about the shop's 30-year history and crafting process |

### For the Shop Owner (Admin Dashboard)
| Feature | Description |
|---------|-------------|
| 🔐 **Secure Login** | Password-protected organizer dashboard |
| 📦 **Manage Products** | Add, edit, or delete jewellery products with images |
| 📈 **Update Metal Rates** | Set today's Gold/Silver/Diamond rates (prices update instantly for all visitors) |
| 📬 **View Enquiries** | See all customer messages with name, email, and phone |
| ⭐ **Testimonials** | Approve or reject customer reviews before they go live |
| 📊 **Analytics** | See total products, enquiries, and bestsellers at a glance |

---

## 🔄 How It Works — Workflow

```
👤 CUSTOMER VISITS WEBSITE
        │
        ▼
┌───────────────────┐
│   React Frontend  │  ◄── Vercel (auto-deployed)
│  (Browser / App)  │
└────────┬──────────┘
         │ Sends API requests
         ▼
┌───────────────────┐
│  FastAPI Backend  │  ◄── Railway (cloud server)
│   (Python API)    │
└────────┬──────────┘
         │ Reads / writes data
         ▼
┌───────────────────┐
│  MongoDB Atlas    │  ◄── Cloud database (always online)
│   (Database)      │
└───────────────────┘

Price Calculation Flow:
Metal Rate (₹/gram) × Weight (grams)
        = Metal Value
        + Making Charges (10%)
        + GST on Metal (3%)
        + GST on Making (5%)
        ─────────────────────
        = 💰 Final Price shown to customer
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend** | React.js + TailwindCSS | Fast, modern, responsive UI |
| **UI Components** | shadcn/ui (Radix) | Beautiful, accessible components |
| **Animations** | Framer Motion + Lenis | Smooth, premium feel |
| **Backend** | FastAPI (Python) | Fast, clean REST API |
| **Database** | MongoDB Atlas | Flexible, cloud-hosted NoSQL |
| **Auth** | Passlib + bcrypt | Secure password hashing |
| **Frontend Deploy** | Vercel | Auto-deploys on every GitHub push |
| **Backend Deploy** | Railway | Always-on server with env var support |

---

## 📂 Project Structure

```
My-Jewellery/
│
├── 📁 project/
│   │
│   ├── 📁 backend/
│   │   ├── server.py          ← Main API server (all routes & logic)
│   │   ├── create_organizer.py ← Script to create admin account
│   │   ├── requirements.txt   ← Python dependencies
│   │   └── .env               ← Secret keys (NOT uploaded to GitHub)
│   │
│   ├── 📁 frontend/
│   │   ├── 📁 src/
│   │   │   ├── 📁 pages/      ← All 8 website pages
│   │   │   ├── 📁 components/ ← Navbar, Footer, UI components
│   │   │   └── App.js         ← Main app with routing
│   │   ├── 📁 public/
│   │   │   └── index.html     ← Entry HTML file
│   │   └── package.json       ← Node.js dependencies
│   │
│   └── 📁 scripts/
│       └── seed_data.py       ← Populates database with sample data
│
└── README.md                  ← You are here!
```

---

## 🚀 Getting Started (Local Setup)

> **Prerequisites**: You need [Node.js](https://nodejs.org/) and [Python 3.9+](https://python.org/) installed.

### Step 1 — Clone the Project
```bash
git clone https://github.com/abdulsami-S/My-Jewellery.git
cd My-Jewellery/project
```

### Step 2 — Set Up the Backend
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/jewellery
DB_NAME=jewellery
```

Start the backend server:
```bash
python server.py
# API running at http://localhost:8000
```

### Step 3 — Set Up the Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

Start the frontend:
```bash
npm start
# Website running at http://localhost:3000
```

---

## 📡 Key API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| `GET` | `/api/products` | Get all jewellery products |
| `GET` | `/api/products/{id}/price` | Get full price breakdown for a product |
| `GET` | `/api/metal-rates` | Get today's gold/silver/diamond rates |
| `GET` | `/api/bestsellers` | Get top products by popularity |
| `POST` | `/api/enquiries` | Submit a customer enquiry |
| `POST` | `/api/organizer/login` | Admin login |
| `PUT` | `/api/metal-rates` | Update metal rates (admin) |

---

## ☁️ Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://my-jewellery.vercel.app |
| Backend | Railway | https://jewellery-hub.up.railway.app |
| Database | MongoDB Atlas | Cloud (private) |

> Vercel auto-deploys whenever code is pushed to the `main` branch on GitHub.

---

## 🧠 What I Learned Building This

- ✅ How to build a full-stack app from scratch and deploy it to the cloud
- ✅ How React routing and component-based architecture works
- ✅ How to design REST APIs with FastAPI and connect to MongoDB
- ✅ How to implement secure authentication with bcrypt password hashing
- ✅ How to calculate real-world jewellery pricing (metal rates + GST)
- ✅ How to debug deployment issues between local and production environments
- ✅ How Vercel and Railway continuous deployment pipelines work

---

## 🎯 Purpose

This project was built to gain hands-on experience in full-stack web development with real-world features — authentication, database integration, cloud deployment, and dynamic pricing logic. It simulates a production-ready business application for a local jewellery shop.

---

## 👨‍💻 Author

<div align="center">

**Abdul Sami**

[![GitHub](https://img.shields.io/badge/GitHub-abdulsami--S-black?style=for-the-badge&logo=github)](https://github.com/abdulsami-S)

*Crafted with ❤️ from Proddatur, Andhra Pradesh*

</div>

---

<div align="center">

## ⭐ If You Like This Project

**Give it a star on GitHub — it really helps!** ⭐

*© 2026 SAM Gold Works. All rights reserved.*

</div>
