# YouTube Clone Backend

This is the backend for a YouTube-like video streaming platform, built using **Node.js** and **Express** with ES module imports. It provides APIs for user authentication, video uploads, comments, likes, and more.

## 📌 Features

- ✅ **User authentication** (JWT-based login & registration)
- 📹 **Video upload and streaming**
- 👍 **Like, comment, and subscribe functionality**
- 👤 **User profiles and video recommendations**
- 📄 **Swagger API documentation**

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Storage**: Local file system / Cloud storage (e.g., AWS S3)
- **Documentation**: Swagger

## 🚀 Installation

1. **Clone the repository**

  
   git clone https://github.com/yourusername/youtube-clone-backend.git
   cd youtube-clone-backend

##Install dependencies
npm install

Set up environment variables

Create a .env file in the root directory and add the following:

env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUD_STORAGE_KEY=your_cloud_storage_key (if applicable)


##Run the server
npm start

The backend will be running at http://localhost:5000.

##📖 API Documentation

Swagger documentation is available at:

##http://localhost:5000/api-docs

##📂 Folder Structure

📦 youtube-clone-backend
├── 📂 src
│   ├── 📂 controllers
│   ├── 📂 models
│   ├── 📂 routes
│   ├── 📂 middleware
│   ├── 📂 utils
│   ├── 📂 config
│   ├── 📄 index.js
│   └── 📄 app.js
├── 📄 .env
├── 📄 package.json
├── 📄 README.md

##🤝 Contributing
Feel free to fork the repository and submit pull requests!

##📜 License
This project is licensed under the MIT License.

