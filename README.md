🏡 Real Estate Marketplace – MERN Stack

A full-stack real estate marketplace web app built with the MERN stack (MongoDB, Express, React, Node).
The app allows users to browse, list, and manage properties with secure authentication, image uploads, and modern UI/UX.

🚀 Features

🔑 Authentication & Authorization

JWT-based login & signup

Google Sign-In integration

🏘 Property Listings

Create, edit, delete property ads

Advanced search & filtering

🖼 Image Uploads

Integrated with Cloudinary for fast, scalable image storage

📊 User Dashboard

Manage personal listings

View favorites & history

⚡ State Management

Implemented with Redux Toolkit for seamless data flow

🛠 Tech Stack

Frontend

React.js (Vite/CRA)

Redux Toolkit

TailwindCSS

Backend

Node.js + Express.js

MongoDB (Mongoose)

Other Tools

JWT Authentication

Google OAuth

Cloudinary for image handling

📂 Installation & Setup
# Clone the repo
git clone https://github.com/naqvi110k/mern-state.git

# Navigate to project folder
mern-state

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Run backend
npm run dev

# Run frontend
npm start

⚡ Environment Variables

Create a .env file in the backend folder with the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

📜 License

This project is licensed under the MIT License.
