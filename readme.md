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