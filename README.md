# 🪑 FurniRent – Furniture Rental Website

FurniRent is a full-stack furniture rental web application designed to make renting furniture simple and convenient. Users can create an account, browse available furniture, view details, rent furniture, and manage their rentals. Administrators can manage furniture, users, and rental orders through a dedicated dashboard.

The project is built using **React, Node.js, Express.js, MongoDB, and Mongoose**, with authentication and role-based authorization for secure access.

---

## ✨ Features

### 👤 User Features

* User registration and login
* Secure authentication using JWT
* Browse available furniture
* View furniture details
* Rent furniture
* Select rental dates
* View rental history
* Track rental status
* User-specific access to rental information
* Password reset functionality

### 👨‍💼 Admin Features

* Secure admin authentication
* Admin dashboard
* View furniture inventory
* Add new furniture
* Update furniture details
* Delete furniture
* Manage rental orders
* View customer information
* Monitor furniture availability
* Manage rental status

### 🔐 Security

* JWT-based authentication
* Role-based authorization
* Protected routes
* Environment variables for sensitive configuration
* Password protection
* Backend authentication middleware

---

## 🛠️ Technologies Used

### Frontend

| Technology | Purpose                             |
| ---------- | ----------------------------------- |
| React      | Building the user interface         |
| Vite       | Frontend development and build tool |
| JavaScript | Application logic                   |
| HTML5      | Page structure                      |
| CSS3       | Styling and responsive design       |

### Backend

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| Node.js            | Server-side JavaScript runtime  |
| Express.js         | REST API and server framework   |
| Mongoose           | MongoDB object modeling         |
| JWT                | Authentication                  |
| dotenv             | Environment variable management |
| CORS               | Cross-origin resource sharing   |
| Helmet             | Security-related HTTP headers   |
| Express Rate Limit | API request protection          |

### Database

**MongoDB**

MongoDB is used to store:

* User accounts
* Furniture information
* Rental records
* Rental status and dates

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MongoDB Atlas

---

## 🏗️ Application Architecture

FurniRent follows a full-stack architecture:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                          HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      + Node.js      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Mongoose       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    └─────────────────────┘
```

---

## 📁 Project Structure

```text
FurniRent/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── furnitureController.js
│   │   └── rentalController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Furniture.js
│   │   └── Rental.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── furnitureRoutes.js
│   │   └── rentalRoutes.js
│   │
│   ├── seed/
│   │   └── seedFurniture.js
│   │
│   ├── resetAdminPassword.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── FurnitureCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── images/
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Furniture.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyRentals.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RentFurniture.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── frontend-old/
│   └── Previous frontend version
│
├── .gitignore
└── README.md
```

---

## 🔄 How FurniRent Works

### 1. User Registration

A new user creates an account by providing the required details.

### 2. Authentication

The backend validates the user's credentials and provides an authentication token.

### 3. Browse Furniture

Authenticated or public users can view the available furniture items.

### 4. Select Furniture

The user selects a furniture item and views its details, price, and availability.

### 5. Create Rental

The user selects the required rental dates and submits the rental request.

### 6. Backend Processing

The Express.js backend validates the request and stores the rental information in MongoDB.

### 7. Rental Management

Users can view their rental history and rental status.

### 8. Admin Management

Administrators can manage furniture and monitor rental orders through the admin dashboard.

---

## 🔌 REST API

The backend exposes RESTful API endpoints for communication between the frontend and backend.

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Furniture

```text
GET    /api/furniture
GET    /api/furniture/:id
POST   /api/furniture
PUT    /api/furniture/:id
DELETE /api/furniture/:id
```

### Rentals

```text
GET    /api/rentals
POST   /api/rentals
PUT    /api/rentals/:id
DELETE /api/rentals/:id
```

> Some endpoints require authentication or administrator authorization.

---

## 🗄️ Database Models

### User

Stores user account information and roles.

```text
User
├── name
├── email
├── password
└── role
```

Possible roles include:

```text
user
admin
```

### Furniture

Stores furniture inventory information.

```text
Furniture
├── name
├── description
├── category
├── pricePerDay
├── image
└── available
```

### Rental

Stores rental information.

```text
Rental
├── user
├── furniture
├── startDate
├── endDate
├── totalAmount
└── status
```

Rental statuses include:

```text
pending
confirmed
active
completed
cancelled
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git
* Visual Studio Code

---

### 1. Clone the Repository

```bash
git clone https://github.com/ayesha-siddiqa-codes/FurniRent.git
```

Move into the project directory:

```bash
cd FurniRent
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit your `.env` file to GitHub. Keep passwords, database credentials, and secret keys private.

---

### 3. Start the Backend

Run:

```bash
npm start
```

The backend should start on:

```text
http://localhost:5000
```

---

### 4. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, usually similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

## 🔑 Authentication Flow

FurniRent uses token-based authentication.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Express Authentication API
 │
 ▼
Credentials Validated
 │
 ▼
JWT Token Generated
 │
 ▼
Frontend Stores Authentication State
 │
 ▼
Protected API Requests
 │
 ▼
Authentication Middleware
 │
 ▼
Authorized Resource
```

Role-based authorization ensures that administrative operations are only available to authorized administrators.

---

## 🖥️ Screenshots

Screenshots can be added here to demonstrate the application interface.

### Home Page

*Add screenshot here*

### Furniture Listing

*Add screenshot here*

### Login / Registration

*Add screenshot here*

### Rental Page

*Add screenshot here*

### My Rentals

*Add screenshot here*

### Admin Dashboard

*Add screenshot here*

---

## 🚀 Future Enhancements

The following features can be added in future versions:

* Online payment integration
* Advanced furniture search
* Category-based filtering
* Sorting and pagination
* Email notifications
* Rental reminder notifications
* User profile management
* Reviews and ratings
* Wishlist functionality
* Improved admin analytics
* Rental availability calendar
* Cloud image storage
* Production deployment
* Responsive design improvements

---

## 🎯 Project Goals

The main goals of FurniRent are to:

* Provide a convenient furniture rental platform
* Demonstrate full-stack web development skills
* Implement frontend and backend communication
* Practice REST API development
* Work with MongoDB and Mongoose
* Implement authentication and authorization
* Build role-based functionality
* Understand real-world CRUD operations
* Develop a complete end-to-end web application

---

## 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* Full-stack web development
* React component development
* REST API design
* CRUD operations
* MongoDB database integration
* Mongoose schemas and models
* JWT authentication
* Role-based authorization
* Protected routes
* Backend middleware
* API integration
* Git and GitHub
* Project structure and organization

---

## 👩‍💻 Author

**Ayesha Siddiqa**

Full-Stack Web Development Project

GitHub: [@ayesha-siddiqa-codes](https://github.com/ayesha-siddiqa-codes)

---

## 📄 License

This project was created for educational and portfolio purposes.
