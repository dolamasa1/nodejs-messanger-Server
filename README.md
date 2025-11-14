🚀 Node.js Messenger Server
A high-performance, real-time messaging platform built with Node.js and Express, featuring comprehensive API endpoints, WebSocket communication, and robust security implementation.

https://img.shields.io/badge/Node.js-18+-green
https://img.shields.io/badge/Express-4.x-blue
https://img.shields.io/badge/Socket.IO-4.x-yellow
https://img.shields.io/badge/MySQL-8.0-orange
https://img.shields.io/badge/Status-Production%2520Ready-brightgreen

📖 Overview
Node.js Messenger Server is a sophisticated, production-ready messaging platform that provides:

💬 Real-time messaging with WebSocket support

🔐 JWT authentication with httpOnly cookies

👥 Group chat with member management

📁 File sharing with multiple media types

👤 User presence and online status tracking

🏥 Health monitoring with detailed system status

🛠️ Technology Stack
Layer	Technology	Purpose
Runtime	Node.js 18+	JavaScript runtime
Framework	Express 4.x	REST API server
Real-time	Socket.IO 4.x	WebSocket communication
Database	MySQL 8.0 + mysql2	Data persistence with connection pooling
Authentication	JWT + bcryptjs	Secure user authentication
File Upload	Multer	File handling middleware
Image Processing	Sharp + BlurHash	Image optimization and previews
Security	CORS, httpOnly cookies	Cross-origin and XSS protection
🚀 Quick Start
Prerequisites
Node.js 18 or higher

MySQL 8.0 or higher

npm or yarn package manager

1. Database Setup
sql
CREATE DATABASE messenger_db;
CREATE USER 'messenger_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON messenger_db.* TO 'messenger_user'@'localhost';
FLUSH PRIVILEGES;
2. Environment Configuration
Create .env file:

env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=messenger_db
DB_USER=messenger_user
DB_PASSWORD=password
JWT_SECRET_KEY=your-super-secret-jwt-key-here
VERSION=1
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
3. Installation & Run
bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-restart
npm run dev
Application will be available at: http://localhost:5000

📡 API Endpoints
🔐 Authentication Endpoints
Method	Endpoint	Description	Auth Required
POST	/api/auth/login	User login (query params or JSON body)	❌
POST	/api/auth/register	User registration	❌
POST	/api/auth/logout	User logout	✅
GET	/api/auth/verify	Verify JWT token	✅
👥 User Management
Method	Endpoint	Description	Auth Required
GET	/api/user/	Get all users/groups with search	✅
GET	/api/user/find	Find user/group by ID	✅
GET	/api/user/profile	Get user profile by ID	✅
GET	/api/user/get	Get user by UUID	✅
GET	/api/user/check-exists	Check if user exists by ID	✅
💬 Messaging
Method	Endpoint	Description	Auth Required
GET	/api/message/message	Get messages (user/group)	✅
POST	/api/message/send	Send message (JSON body or query params)	✅
POST	/api/message/upload	Upload file message	✅
GET	/api/message/download	Download files	✅
👤 Profile Management
Method	Endpoint	Description	Auth Required
GET	/api/profile/	Get my profile	✅
PUT	/api/profile/image	Update profile image	✅
PUT	/api/profile/user	Update username	✅
PUT	/api/profile/phone	Update phone number	✅
PUT	/api/profile/gender	Update gender	✅
PUT	/api/profile/bio	Update bio	✅
👥 Group Management
Method	Endpoint	Description	Auth Required
GET	/api/group/check	Check group details	✅
POST	/api/group/create	Create new group	✅
POST	/api/group/join	Join existing group	✅
GET	/api/group/member	Get group members	✅
🩺 Health & Monitoring
Method	Endpoint	Description	Auth Required
GET	/api/check/	Version compatibility check	❌
GET	/api/health/	Basic health status	❌
GET	/api/health/detailed	Detailed system status	❌
🔌 Real-time Communication
⚡ Socket.IO Events
Connection Setup
javascript
const socket = io('http://localhost:5000', {
  extraHeaders: {
    Authorization: 'Bearer YOUR_JWT_TOKEN',
    // Or use cookies - token is automatically sent via httpOnly cookie
  }
});
Client Events (Emit)
javascript
// Send message
socket.emit('message', {
  type: 'user',        // 'user' or 'group'
  target: 123,         // user ID or group ID
  message_type: 't',   // 't'=text, 'p'=photo, 'v'=voice, 'f'=file
  message: 'Hello!',
  reference_id: null,  // file ID for file messages
  from_name: 'John Doe'
}, (createDate) => {
  // Callback with message creation timestamp
  console.log('Message created at:', createDate);
});
Server Events (Listen)
javascript
// Receive new message
socket.on('message', (data) => {
  console.log('New message received:', data);
});

// User status changes
socket.on('user_status', (userId, isOnline) => {
  console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'}`);
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
Message Types
Text messages: message_type: 't'

Photo messages: message_type: 'p'

Voice messages: message_type: 'v'

File messages: message_type: 'f'

🗃️ Database Schema
Core Tables
user - User accounts and profiles

message - Text and file messages

groups - Chat groups

member - Group membership

files - File storage metadata

Key Relationships
text
User 1───N Message (as sender)
User 1───N Member (group membership)  
Group 1───N Message
Group 1───N Member
Message 1──1 Files (optional, for file messages)
🔒 Security Implementation
JWT Authentication with 15-day expiration

HttpOnly Cookies for secure token storage (XSS protection)

Bearer Token Support via Authorization header

BCrypt Password Hashing (salt rounds: 10)

CORS Protection with configurable origins

SQL Injection Prevention via parameterized queries

File Upload Validation with type checking

Input Sanitization and validation

📁 Project Structure
text
messenger-server/
├── 📁 config/
│   └── db.js                 # Database configuration with connection pooling
├── 📁 controllers/           # Route controllers
│   ├── AuthController.js
│   ├── UserController.js
│   ├── MessageController.js
│   ├── ProfileController.js
│   └── GroupController.js
├── 📁 models/               # Data models and business logic
│   ├── Auth.js
│   ├── User.js
│   ├── Message.js
│   ├── Profile.js
│   ├── Group.js
│   ├── JwtVerify.js         # JWT middleware
│   └── 📁 utils/
│       └── Utils.js         # Image processing, BlurHash, file utilities
├── 📁 routes/               # Express routes
│   ├── AuthRoutes.js
│   ├── UserRoutes.js
│   ├── MessageRoutes.js
│   ├── ProfileRoutes.js
│   ├── GroupRoutes.js
│   ├── Check.js
│   └── HealthRoutes.js      # Health monitoring endpoints
├── 📁 socket/               # Socket.IO implementation
│   ├── SocketService.js     # Socket event handlers
│   └── UserData.js          # Online users tracking
├── 📁 upload/               # File storage
│   ├── profile/
│   ├── photo/
│   ├── voice/
│   └── file/
├── 🚀 server.js             # Application entry point
└── 📄 .env                  # Environment configuration
🧪 Testing & Health Checks
Quick Health Check
bash
# Basic health status
curl http://localhost:5000/api/health

# Detailed system status
curl http://localhost:5000/api/health/detailed

# Version compatibility check
curl http://localhost:5000/api/check -H "version: 1"
API Testing Sequence
bash
# 1. Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "version: 1" \
  -d '{
    "user_name": "testuser",
    "password": "password123", 
    "first_name": "Test",
    "last_name": "User",
    "gender": "M"
  }'

# 2. Login (returns httpOnly cookie)
curl -X POST "http://localhost:5000/api/auth/login?user=testuser&password=password123" \
  -H "version: 1" -c cookies.txt

# 3. Send Message (using stored cookies)
curl -X POST http://localhost:5000/api/message/send \
  -H "Content-Type: application/json" \
  -H "version: 1" \
  -b cookies.txt \
  -d '{
    "type": "user",
    "target": 2,
    "message": "Hello from API test!"
  }'

# 4. Check user exists
curl "http://localhost:5000/api/user/check-exists?userId=2" \
  -H "version: 1" \
  -b cookies.txt
🔧 Key Features
🎯 Authentication System
Dual login support: Query parameters and JSON body

Version checking: Client version compatibility

Secure cookies: HttpOnly with strict same-site policy

Token verification: Automatic JWT validation middleware

💬 Messaging System
Dual message sending: Support for both query params and JSON body

File attachments: Images, voice messages, documents

Group messaging: Broadcast to multiple users

Message history: Paginated message retrieval

📁 File Management
Organized storage: Separate directories by file type

UUID filenames: Secure file naming

BlurHash previews: Fast image preview generation

Permission checking: Secure file download authorization

👥 User & Group Management
User search: Find users by name or phone number

Profile management: Complete user profile system

Group creation: With profile images and descriptions

Member management: Join groups and manage members

🏥 Health Monitoring
Database health checks: Connection pool status

System metrics: Memory usage, uptime, environment info

Version compatibility: Client-server version validation

🚀 Deployment
Production Environment Variables
env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
JWT_SECRET_KEY=your-very-secure-jwt-secret-key
VERSION=1
FRONTEND_URL=https://your-frontend-domain.com
Production Recommendations
Use PM2 for process management: pm2 start server.js

Configure reverse proxy (Nginx) for SSL termination

Enable database connection pooling (already implemented)

Set up proper logging and monitoring

Configure firewall and security groups

Use environment-specific configuration

📊 Performance Features
✅ Implemented Optimizations
Connection pooling with mysql2 (limit: 10 connections)

Image preview generation with BlurHash for fast loading

Efficient file storage with metadata tracking

Socket.IO room management for targeted messaging

Pagination on all list endpoints

CORS optimization with preflight caching

🔄 Real-time Features
User presence tracking: Online/offline status

Instant messaging: WebSocket-based delivery

Group notifications: Broadcast to all group members

Connection health: Automatic reconnection handling

🐛 Troubleshooting
Common Issues
Database Connection Failed

bash
# Check database is running
sudo systemctl status mysql

# Verify credentials in .env file
# Test connection manually
mysql -u your_user -p -h your_host your_database
CORS Issues

Verify FRONTEND_URL in environment variables

Check client origin matches allowed origins

Ensure credentials are included in client requests

File Upload Problems

Check upload/ directory permissions

Verify multer configuration for file types

Check disk space availability

Socket Connection Issues

Verify JWT token is valid and not expired

Check CORS configuration for WebSocket origins

Ensure client includes credentials in connection

Logs and Debugging
The server provides comprehensive logging:

Request/response logging with timing

Database connection events

Authentication attempts

Socket connection status

Error tracking with stack traces

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow existing code style and structure

Add comprehensive logging

Include error handling for all operations

Update documentation for new features

Test both REST API and Socket.IO functionality

📄 License
MIT License - see LICENSE file for details.

👨‍💻 Developer
Ahmed Adel
📧 Email: ahmed.adel.elmoghraby@gmail.com
🌐 GitHub: dolamasa1

🔮 Roadmap
Next Version (v1.1)
Message read receipts and delivery confirmations

Advanced search with message content

Push notifications integration

Message encryption for enhanced security

Admin dashboard for user management

Future Enhancements
Redis caching for frequent queries

Microservices architecture

Kubernetes deployment configurations

Advanced analytics and monitoring

Multi-tenant support

⚠️ Important Notes
Production Ready: All core features are implemented and stable

Security Focused: Comprehensive security measures in place

Scalable Architecture: Connection pooling and efficient resource usage

Comprehensive Logging: Detailed logging for debugging and monitoring

Health Monitoring: Built-in health checks and system status reporting

This project represents a production-grade Node.js backend with real-time messaging capabilities, suitable for enterprise applications.

Built with ❤️ using Node.js and Express - Enterprise-ready messaging platform