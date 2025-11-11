# 🚀 Node.js Messenger Server

A high-performance, real-time messaging platform built with Node.js and Express, designed for both production use and as a comprehensive study case for technology stack comparisons.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-yellow)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

## 📖 Overview

**Node.js Messenger Server** is a sophisticated messaging platform that serves dual purposes:
- 🏢 **Production-Ready**: Feature-rich messaging backend for real-world applications
- 🔬 **Research Platform**: Comparative study case for backend technology performance analysis

**Developed by**: Ahmed Adel

---

## 🎯 Dual Purpose Architecture

### 🏢 Production Features
- **Real-time messaging** with Socket.IO implementation
- **JWT authentication** with secure httpOnly cookies
- **Group chat** with member management
- **File sharing** (images, documents, voice messages)
- **User presence** and online status tracking

### 🔬 Research & Comparison
- **Performance benchmarking** against Spring Boot implementations
- **Technology stack analysis** for scalability studies
- **Real-time communication** implementation comparisons
- **API design patterns** for educational purposes

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express 4.x | REST API server |
| **Real-time** | Socket.IO 4.x | WebSocket communication |
| **Database** | MySQL 8.0 | Data persistence |
| **Authentication** | JWT + bcryptjs | Secure user authentication |
| **File Upload** | Multer | File handling middleware |
| **Image Processing** | Sharp + BlurHash | Image optimization and previews |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### 1. Database Setup
```sql
CREATE DATABASE messenger_db;
CREATE USER 'messenger_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON messenger_db.* TO 'messenger_user'@'localhost';
```

### 2. Environment Configuration
Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=messenger_db
DB_USER=messenger_user
DB_PASSWORD=password
JWT_SECRET_KEY=your-super-secret-jwt-key-here
VERSION=1
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-restart
npm run dev
```

Application will be available at: `http://localhost:5000`

---

## 📡 API Endpoints

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | User login | ❌ |
| `POST` | `/api/auth/register` | User registration | ❌ |

### 👥 User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/` | Get all users (with search) | ✅ |
| `GET` | `/api/user/find` | Find user/group by ID | ✅ |
| `GET` | `/api/user/profile` | Get user profile by ID | ✅ |
| `GET` | `/api/user/get` | Get user by UUID | ✅ |

### 💬 Messaging
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/message/message` | Get messages (user/group) | ✅ |
| `POST` | `/api/message/upload` | Upload file message | ✅ |
| `GET` | `/api/message/download` | Download files | ✅ |

### 👤 Profile Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/profile/` | Get my profile | ✅ |
| `PUT` | `/api/profile/image` | Update profile image | ✅ |
| `PUT` | `/api/profile/user` | Update username | ✅ |
| `PUT` | `/api/profile/phone` | Update phone number | ✅ |
| `PUT` | `/api/profile/gender` | Update gender | ✅ |
| `PUT` | `/api/profile/bio` | Update bio | ✅ |

### 👥 Group Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/group/check` | Check group details | ✅ |
| `POST` | `/api/group/create` | Create new group | ✅ |
| `POST` | `/api/group/join` | Join existing group | ✅ |
| `GET` | `/api/group/member` | Get group members | ✅ |

### 🩺 Health & Monitoring
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/check/` | Version compatibility check | ❌ |

---

## 🔌 Real-time Communication

### ⚡ Socket.IO Events

#### Connection
```javascript
const socket = io('http://localhost:5000', {
  extraHeaders: {
    Cookie: 'accessToken=YOUR_JWT_TOKEN'
  }
});
```

#### Emit Events (Client → Server)
```javascript
// Send message
socket.emit('message', {
  type: 'user',        // 'user' or 'group'
  target: 123,         // user ID or group ID
  message_type: 't',   // 't'=text, 'p'=photo, 'v'=voice, 'f'=file
  message: 'Hello!',
  reference_id: null,  // file ID for file messages
  from_name: 'John Doe'
});

// Automatic events:
// - 'disconnect' when user disconnects
```

#### Listen Events (Server → Client)
```javascript
// Receive new message
socket.on('message', (data) => {
  console.log('New message:', data);
});

// User status changes
socket.on('user_status', (userId, isOnline) => {
  console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'}`);
});
```

**Note**: Real-time features are currently in development and being tested for performance comparison studies.

---

## 🗃️ Database Schema

### Core Tables
- **user** - User accounts and profiles
- **message** - Text and file messages
- **groups** - Chat groups
- **member** - Group membership
- **files** - File storage metadata

### Key Relationships
```
User 1───N Message (as sender)
User 1───N Member (group membership)  
Group 1───N Message
Group 1───N Member
Message 1──1 Files (optional, for file messages)
```

---

## 🔒 Security Implementation

- **JWT Authentication** with 15-day expiration
- **HttpOnly Cookies** for secure token storage
- **BCrypt Password Hashing** (salt rounds: 10)
- **Basic Auth** for API protection
- **SQL Injection Prevention** via parameterized queries
- **File Upload Validation** with type checking

---

## 📊 Related Research Projects

This project is part of a comprehensive technology comparison study:

### 1. 🚀 API Performance Benchmark Suite
**Repository**: [https://github.com/dolamasa1/API-Performance-Benchmark](https://github.com/dolamasa1/API-Performance-Benchmark)

A sophisticated performance testing dashboard that compares:
- **Spring Boot vs Node.js Express** backends
- **Dual middleware testing engines** (Go & JavaScript)
- **Advanced timing metrics** separating HTTP time from language processing
- **Real-time performance analytics** with percentile calculations

### 2. 🔄 Java Swing Client Implementation  
**Forked Repository**: Java Messenger Client

A complementary client implementation featuring:
- **Java Swing GUI** with FlatLaf styling
- **Socket.IO client** for real-time communication
- **Multi-format file support** including voice messages
- **REST API integration** for user management

These projects together form a complete ecosystem for studying different technology stacks in messaging applications.

---

## 🚧 Current Development Status

### ✅ Implemented & Stable
- [x] RESTful API with comprehensive endpoints
- [x] JWT authentication with httpOnly cookies
- [x] User and group management
- [x] File upload/download functionality
- [x] Real-time messaging with Socket.IO
- [x] Image processing with BlurHash previews
- [x] Basic error handling and validation

### 🔄 In Development
- [ ] Advanced message status (read receipts, delivery confirmations)
- [ ] Performance optimization and caching
- [ ] Comprehensive test coverage
- [ ] API documentation
- [ ] Rate limiting and security enhancements

### 📋 Planned Features
- [ ] Message encryption for enhanced security
- [ ] Advanced search functionality
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Docker containerization
- [ ] Redis caching implementation

---

## 🧪 Testing & Benchmarking

### Quick Testing Sequence
```bash
# 1. Version Check
curl http://localhost:5000/api/check -H "version: 1"

# 2. Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "version: 1" \
  -d '{"user_name":"testuser","password":"password123","first_name":"Test","last_name":"User","gender":"M"}'

# 3. Login (returns httpOnly cookie)
curl -X POST "http://localhost:5000/api/auth/login?user=testuser&password=password123" \
  -H "version: 1"

# 4. Get Users (uses cookie automatically)
curl -H "version: 1" http://localhost:5000/api/user/
```

### Performance Testing
This project is designed to be used with the **API Performance Benchmark Suite** for comparative analysis against Spring Boot implementations.

---

## 📁 Project Structure

```
messenger-server/
├── 📁 config/
│   └── db.js                 # Database configuration
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
│   ├── JwtVerify.js
│   └── 📁 utils/
│       └── Utils.js         # Image processing, BlurHash
├── 📁 routes/               # Express routes
│   ├── AuthRoutes.js
│   ├── UserRoutes.js
│   ├── MessageRoutes.js
│   ├── ProfileRoutes.js
│   ├── GroupRoutes.js
│   └── Check.js
├── 📁 socket/               # Socket.IO implementation
│   ├── SocketService.js
│   └── UserData.js
├── 📁 upload/               # File storage
│   ├── profile/
│   ├── photo/
│   ├── voice/
│   └── file/
├── 🚀 server.js             # Application entry point
└── 📄 .env                  # Environment configuration
```

---

## 🔧 Key Features Implementation

### File Upload System
- **Multi-type support**: Profile images, photos, voice messages, files
- **Organized storage**: Separate directories for each file type
- **UUID filenames**: Secure file naming with UUIDs
- **Image optimization**: BlurHash previews for fast loading

### Real-time Messaging
- **Socket.IO integration**: Bidirectional communication
- **User presence**: Online/offline status tracking
- **Room management**: Automatic group member notifications
- **Delivery system**: Reliable message delivery to multiple recipients

### Security Measures
- **HttpOnly cookies**: XSS protection for tokens
- **Parameterized queries**: SQL injection prevention
- **Input validation**: Request data sanitization
- **Basic authentication**: Additional API protection layer

---

## 🐳 Deployment Considerations

### Environment Variables
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=messenger_db
DB_USER=messenger_user
DB_PASSWORD=your_password
JWT_SECRET_KEY=your-super-secret-jwt-key
VERSION=1
```

### Production Recommendations
- Use PM2 for process management
- Configure reverse proxy (Nginx)
- Enable HTTPS with SSL certificates
- Set up database connection pooling
- Implement logging and monitoring

---

## 📈 Performance Considerations

### Current Optimizations
- **Connection pooling** with mysql2
- **Image preview generation** with BlurHash
- **Efficient file storage** with metadata tracking
- **Socket.IO room management** for targeted messaging

### Areas for Improvement
- Redis caching for frequent queries
- Database indexing optimization
- Message pagination enhancements
- File compression for media uploads
- CDN integration for static files

---

## 🤝 Contributing

This project welcomes contributions for both:
1. **Production features** - enhancing the messaging platform
2. **Research components** - improving benchmarking capabilities

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Developer

**Ahmed Adel**  
📧 Email: ahmed.adel.elmoghraby@gmail.com  
🌐 GitHub: [dolamasa1](https://github.com/dolamasa1)

---

## 🔮 Future Roadmap

### Short-term (Next 3 months)
- [ ] Complete real-time feature testing
- [ ] Add comprehensive unit and integration tests
- [ ] Implement API documentation
- [ ] Add advanced message search functionality

### Long-term (6+ months)
- [ ] Microservices architecture exploration
- [ ] Kubernetes deployment configurations
- [ ] Advanced analytics and monitoring
- [ ] Multi-tenant support

---

## ⚠️ Important Notes

- **Real-time features** are currently in testing phase for performance comparison studies
- This project serves as both a **production-ready backend** and a **research platform**
- The Socket.IO implementation allows for **technology stack performance analysis**
- All APIs are functional and stable except where noted as "in development"

**This project represents a comprehensive study in modern Node.js backend development while providing a fully functional messaging platform.**

---

*Built with ❤️ using Node.js and Express - Bridging production excellence with academic research*
