const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
  let token = req.cookies.accessToken;
  
  // Also check Authorization header for Bearer token
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    console.log('🔐 Authentication failed: No token provided');
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "No authentication token provided" 
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('🔐 Authentication failed: Invalid token', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Token Expired",
          message: "Authentication token has expired" 
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: "Invalid Token",
          message: "Authentication token is invalid" 
        });
      } else {
        return res.status(401).json({ 
          error: "Authentication Failed",
          message: "Token verification failed" 
        });
      }
    }
    
    console.log(`🔐 User authenticated: ${user.user} (ID: ${user.id})`);
    req.user = { id: user.id, uuid: user.uuid, user: user.user };
    next();
  });
};

exports.getUser = (headers) => {
  let token = headers.cookies;
  
  // Also try to get from Authorization header
  if (!token && headers.authorization) {
    const authHeader = headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    console.log('🔐 Socket authentication: No token provided');
    return null;
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(`🔐 Socket user authenticated: ${user.user} (ID: ${user.id})`);
    return { id: user.id, uuid: user.uuid, user: user.user };
  } catch (err) {
    console.log('🔐 Socket authentication failed:', err.message);
    return null;
  }
};

// Middleware to log authentication attempts
exports.logAuthAttempt = (req, res, next) => {
  console.log(`🔐 Authentication attempt: ${req.method} ${req.originalUrl}`);
  console.log(`📱 Client version: ${req.headers.version || 'Not provided'}`);
  next();
};