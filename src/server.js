require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const cors = require("cors"); // Add this line

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketService = require("./socket/SocketService");
const jwtVerify = require("./models/JwtVerify");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);

// Startup banner
console.log('\n' + '='.repeat(60));
console.log('🚀 Starting Node.js Messenger Server');
console.log('='.repeat(60));
console.log('📅', new Date().toISOString());
console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
console.log('🔢 Node Version:', process.version);
console.log('🖥️ Platform:', process.platform);
console.log('🔄 PID:', process.pid);
console.log('='.repeat(60) + '\n');

// CORS Configuration - Add this section
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'http://localhost:8000',
    process.env.FRONTEND_URL // Optional: from environment variable
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Version', 
    'X-Requested-With',
    'Cookie',
    'Set-Cookie'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 3600 // 1 hour
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Middleware with logging
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`🔥 ${req.method} ${req.originalUrl} - Client: ${req.ip}`);
  console.log(`🌍 Origin: ${req.headers.origin || 'No origin'}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`💚 ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
});

// Auth logging middleware
app.use('/api/auth', jwtVerify.logAuthAttempt);

// Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));
app.use("/api/message", require("./routes/MessageRoutes"));
app.use("/api/profile", require("./routes/ProfileRoutes"));
app.use("/api/group", require("./routes/GroupRoutes"));
app.use("/api/check", require("./routes/Check"));
app.use("/api/health", require("./routes/HealthRoutes"));

// Static files for uploads - Add CORS for this too
app.use('/upload', express.static('upload', {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin.join(', '));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    message: `Endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err.message);
  console.error(err.stack);
  
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Initialize Socket.IO with CORS configuration
socketService(httpServer);

// Database health check before starting server
async function startServer() {
  try {
    console.log('🔍 Checking database connection before startup...');
    await db.checkHealth();
    console.log('✅ Database is ready!');
    
    httpServer.listen(PORT, () => {
      console.log('\n' + '🎉'.repeat(20));
      console.log('✅ Server successfully started!');
      console.log('🎉'.repeat(20));
      console.log(`📡 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 REST API Base: http://localhost:${PORT}/api`);
      console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📊 Detailed Status: http://localhost:${PORT}/api/health/detailed`);
      console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔄 Startup Time: ${new Date().toISOString()}`);
      console.log(`🌐 CORS Enabled for: ${corsOptions.origin.join(', ')}`);
      console.log('🎉'.repeat(20) + '\n');
    });
    
  } catch (error) {
    console.error('\n❌ Failed to start server - Database connection failed!');
    console.error('🚨 Please check:');
    console.error('   • Database server is running');
    console.error('   • Connection credentials in .env file');
    console.error('   • Network connectivity');
    console.error('   • Database permissions');
    console.error(`🔧 Error details: ${error.message}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT - Shutting down gracefully...');
  console.log('⏰ Server was running for:', Math.floor(process.uptime()) + ' seconds');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM - Shutting down gracefully...');
  console.log('⏰ Server was running for:', Math.floor(process.uptime()) + ' seconds');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('🔄 Restarting server...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection at:', promise);
  console.error('🔧 Reason:', reason);
});

// Start the server
startServer();