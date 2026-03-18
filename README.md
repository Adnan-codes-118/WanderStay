# 🏨 WanderStay

WanderStay is a full-stack web application inspired by Airbnb that allows users to explore, create, and manage property listings. It includes real-world features such as authentication, search functionality, image uploads, and a review & rating system.

---

## 🚀 Live Demo

👉 https://wanderstay-en1r.onrender.com/listings

---

## 🎯 Features

* 🏡 Browse and explore property listings
* 🔍 Search listings by location or keywords
* ⭐ Add and view user reviews & ratings
* ➕ Create, edit, and delete listings
* 🖼️ Image upload with cloud storage integration
* 📍 Location-based listings using geocoding
* 🔐 User authentication & authorization
* 🛡️ Route protection using middleware
* 📂 MVC architecture for scalable development

---

## ⭐ Reviews & Search System

### 🔍 Search

* Dynamic search functionality for filtering listings
* Helps users quickly find relevant properties

### ⭐ Reviews & Ratings

* Users can post ratings and feedback
* Improves trust and usability of listings
* Managed using MongoDB relationships

---

## 🛠️ Tech Stack

### 🌐 Frontend

* EJS (Embedded JavaScript Templates)
* CSS / Bootstrap

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB
* Mongoose

### ☁️ Services

* Cloudinary (image storage)
* Geocoding API

---

## 📂 Project Structure

```id="m3l3mh"
WanderStay/
│── app.js                 # Main server entry point
│── controller/            # Business logic
│── models/                # Database schemas
│── routes/                # Route definitions
│── views/                 # EJS templates
│── public/                # Static assets (CSS, JS)
│── utils/                 # Helper functions
│── init/                  # Database initialization / seed data
│── middleware.js          # Custom middleware
│── cloudConfig.js         # Cloudinary configuration
│── schema.js              # Validation schemas
│── geocode-migrate.js     # Script for geolocation migration
│── package.json
```

---

## ⚙️ Installation & Setup

1. Clone the repository:

```id="r9kg66"
git clone https://github.com/Adnan-codes-118/WanderStay.git
```

2. Navigate to the project folder:

```id="mq3rs1"
cd WanderStay
```

3. Install dependencies:

```id="a9h8o6"
npm install
```

4. Create a `.env` file and add:

```id="ddxf2y"
MONGO_URL=your_mongodb_connection
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

5. Run the application:

```id="72jckf"
node app.js
```

6. Open in browser:

```id="q4re86"
http://localhost:3000
```

---

## 🔐 Key Functionalities

* Secure authentication and authorization
* Full CRUD operations for listings
* Cloud-based image upload system
* Location handling using geocoding
* Search and filtering system
* Review and rating feature

---

## 🧑‍💻 Author

**Adnan**
🔗 GitHub: https://github.com/Adnan-codes-118

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
