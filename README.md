# 🚀 AgroConnect — Bridge the Gap Between Farmers and Consumers

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-orange?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Security-JWT%20%7C%20Bcrypt-red?style=for-the-badge&logo=json-web-tokens"/>
</p>

---

## 🌟 Introduction

While building **AgroConnect**, our goal was clear: *Eliminate the middlemen and empower local farmers.* We wanted to create a transparent, high-performance ecosystem where farmers can showcase their hard-earned produce and consumers can buy fresh, localized goods with complete trust.

This isn't just a marketplace; it's a mission-driven platform designed to solve real-world friction in the agricultural supply chain. From real-time messaging to secure order orchestration, AgroConnect is built to cultivate direct connections.

---

## 🚀 How It Works: The Flow

1.  **Direct Onboarding**: Farmers and consumers register with role-based profiles for a tailored experience.
2.  **Product Cataloging**: Farmers rapidly list their produce with details, pricing, and locations.
3.  **Discovery & Connection**: Consumers browse localized farm goods and initiate direct conversations via the integrated messaging system.
4.  **Secure Ordering**: Seamlessly place order requests directly with the producer, ensuring freshness and fair pricing.
5.  **Growth Tracking**: An admin panel monitors the health of the marketplace, managing categories and users to ensure quality.

---

## 🔥 Why AgroConnect? (Core Features)

| Feature | Description |
| :--- | :--- |
| **🌾 Farmer Showrooms** | Personalized profiles where farmers can tell their story and showcase their background. |
| **🛒 Consumer Dashboard** | A centralized hub to browse local listings, search by category, and manage orders. |
| **📬 Direct Messaging** | Integrated real-time communication channel to build trust and negotiate between parties. |
| **⚙️ Admin Command Center** | Comprehensive panel to manage users, verify listings, and oversee system categories. |
| **📦 Order Engine** | A streamlined system for consumers to request products and farmers to manage incoming orders. |
| **📈 Localized Marketplace** | Data-driven search to help consumers find the freshest produce in their immediate vicinity. |

---

## 🛠️ Technologies Used

> **Tools and technologies used in this project**

*   **Frontend**: React JS + React Redux for state management + Tailwind CSS for a modern agri-styled UI.
*   **Backend**: Node.js & Express.js (Scalable RESTful API architecture).
*   **Database**: MongoDB with Mongoose for flexible and efficient data modeling.
*   **Security**: JWT (Stateless Authentication) + Bcrypt (Industry-standard password hashing).
*   **Hosting**: Deployed on Vercel for maximum availability and performance.

---

## 📂 Architecture Overview

```text
AgroConnect/
 ├── client/          # Frontend (React + Vite)
 │    ├── src/        # Feature-driven components, pages & redux slices
 │    └── public/     # Static assets (Logos, Icons)
 ├── server/          # Backend (Node.js + Express)
 │    ├── models/     # MongoDB Schemas (User, Product, Order)
 │    ├── routes/     # API Endpoints
 │    ├── controllers/ # Business Logic
 │    └── middleware/ # Security & Role-based Auth logic
 └── package.json     # Project Orchestration
```

---

## ⚙️ Installation & Setup

### 1. Repository Setup
```bash
git clone https://github.com/gauravpatil-06/AgroConnect.git
cd AgroConnect
```

### 2. Dependency Management
```bash
# Backend Installation
cd server
npm install

# Frontend Installation
cd ../client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=90d
```

Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Launching the App
```bash
# Start Backend (from server fold)
npm run dev

# Start Frontend (from client fold)
npm run dev
```

---

## 🛡️ Security & Reliability

*   **Role-Based Access Control (RBAC)**: Ensuring users only access features relevant to their role (Farmer/Consumer/Admin).
*   **Input Sanitation**: Robust validation layers to prevent common vulnerabilities like NoSQL injection.
*   **State Integrity**: Protected routes using custom middleware for secure session management.
*   **Encrypted Storage**: Sensitive user credentials never touch the database in plain text.

---

> "This project was built from scratch to solve the digital divide for farmers. We didn't just want a UI; we wanted a working system that actually changes how we consume food."

---

<div align="center">

**🌐 [Live Web App](https://agroconnect.vercel.app/)**

✨ **Empowering Farmers. Freshing Consumers.**

</div>
