🚀 Functionalities

👤 User Authentication & Account Management
Register a new user with unique username and email validation
Email verification via secure verification link
Secure login with JWT authentication
Retrieve authenticated user session
Initiate password reset via email token
Secure password reset with token expiration handling

👥 Profile Management
Create a user profile with avatar upload
Update profile information and avatar
Retrieve the authenticated user’s profile
View a public profile by username
Support for social links and profile metadata

📝 Post Management
Create posts with automatic slug generation
Update posts with author-only permission checks
Upload post images
Associate posts with authenticated users
Automatic timestamps for creation and updates
❤️ Post Engagement
Like posts
Prevent duplicate likes from the same user
Track like counts
Store users who liked a post

🖼 File Uploads
Avatar uploads for user profiles
Image uploads for posts
Structured file storage with public URL access

🔐 Security & Validation
Protected routes using authentication middleware
Request validation middleware for data integrity
Author ownership verification for protected actions
Secure token-based email actions (verification & password reset)

📧 Email Automation
Account verification emails
Password reset emails
Password reset confirmation notifications

🧩 Additional Features
SEO-friendly slug generation for posts
Modular architecture (routes, middleware, validators)
Environment-based domain configuration

__________________

⚙️ Technical Details

🧱 Backend Stack

This project is built using a modern Node.js backend stack:

Runtime: Node.js (ES Modules)
Framework: Express
Database: MongoDB with Mongoose
Authentication: Passport + JWT
File Uploads: Multer
Email Service: SendGrid
Logging: Consola

🧩 Key Dependencies

Package	Purpose
express	Web server & routing
mongoose	MongoDB ODM
passport & passport-jwt	Authentication
jsonwebtoken	Token generation
bcryptjs	Password hashing
multer	File upload handling
express-validator	Request validation
@sendgrid/mail	Email delivery
dotenv	Environment variable management
cors	Cross-origin requests
mongoose-paginate-v2	Pagination support
consola	Logging

🗂 Project Architecture
.
├── apis/
│   ├── users.js
│   ├── profiles.js
│   └── posts.js
├── middlewares/
├── models/
├── uploads/
├── constants/
├── functions/
├── templates/
├── index.js
└── .env

🚀 Server Setup

The Express server:
Enables CORS
Parses JSON requests
Serves uploaded files statically
Initializes Passport authentication
Connects to MongoDB using Mongoose
Mounts modular route handlers

Entry point: index.js

Key responsibilities:
app.use("/users", userApis);
app.use("/profiles", profileApis);
app.use("/posts", postApis);

🌍 Environment Variables

Create a .env file in the project root:

SENDGRID_API=
APP_PORT=
APP_DB=
APP_DOMAIN=
APP_SECRET=
APP_HOST_EMAIL=

Variable Description

APP_PORT	Server port
APP_DB	MongoDB connection string
APP_DOMAIN	Base URL of the app
APP_SECRET	JWT secret key
SENDGRID_API	SendGrid API key
APP_HOST_EMAIL	Sender email address

🔐 Configuration Constants

The app loads environment variables via dotenv:

export const DOMAIN = process.env.APP_DOMAIN;
export const PORT = process.env.PORT || process.env.APP_PORT;
export const DB = process.env.APP_DB;
export const SENDGRID_API = process.env.SENDGRID_API;
export const SECRET = process.env.APP_SECRET;
export const APP_HOST_EMAIL = process.env.APP_HOST_EMAIL;

📁 Static File Hosting

Uploaded files are stored in:
/uploads
and served via:
http://<domain>/filename

🧪 Running the Application

Install dependencies:
npm install
Run in development mode:
npm run dev
Run in production:
npm start
