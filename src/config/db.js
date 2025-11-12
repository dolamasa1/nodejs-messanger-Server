const mysql2 = require("mysql2");

const connect = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  // Remove these unsupported options:
  // acquireTimeout: 60000,
  // timeout: 60000,
  // reconnect: true
});

// Test database connection on startup
connect.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('📋 Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
  } else {
    console.log('✅ Database connected successfully!');
    console.log('📊 Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      threadId: connection.threadId
    });
    connection.release();
  }
});

// Handle connection events
connect.on('connection', (connection) => {
  console.log('🔄 New database connection established. Thread ID:', connection.threadId);
});

connect.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

// Export a function to check connection health
connect.checkHealth = () => {
  return new Promise((resolve, reject) => {
    connect.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.ping((pingErr) => {
          connection.release();
          if (pingErr) {
            reject(pingErr);
          } else {
            resolve({ status: 'healthy', timestamp: new Date().toISOString() });
          }
        });
      }
    });
  });
};

module.exports = connect;