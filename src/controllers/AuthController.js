const ms = require("ms");
const VERSION = process.env.VERSION || 1;
const auth = require("../models/Auth");

exports.login = async (req, res, next) => {
  try {
    const version = req.headers.version;
    if (version === undefined || version < VERSION) {
      console.log(`📱 Version mismatch: Client ${version}, Server ${VERSION}`);
      return res.status(426).json({
        error: "Update Required",
        message: "Please update your app to the latest version"
      });
    }

    // Handle both query parameters and JSON body
    let loginData;
    if (Object.keys(req.query).length > 0) {
      // Using query parameters (traditional way)
      loginData = req.query;
      console.log(`🔐 Login attempt (query): ${loginData.user}`);
    } else if (Object.keys(req.body).length > 0) {
      // Using JSON body
      loginData = req.body;
      console.log(`🔐 Login attempt (body):`, loginData);
      
      // Support multiple field names for username
      if (loginData.user_name && !loginData.user) {
        loginData.user = loginData.user_name;
        console.log(`🔄 Mapped user_name to user: ${loginData.user}`);
      } else if (loginData.username && !loginData.user) {
        loginData.user = loginData.username;
        console.log(`🔄 Mapped username to user: ${loginData.user}`);
      }
    } else {
      console.log('❌ Login failed: No credentials provided');
      return res.status(400).json({
        error: "Bad Request",
        message: "No credentials provided"
      });
    }

    // Debug log to see what fields we have
    console.log('🔍 Login data fields:', Object.keys(loginData));
    console.log('🔍 Login data values:', loginData);

    if (!loginData.user || !loginData.password) {
      console.log('❌ Login failed: Missing username or password');
      console.log('🔍 Available fields:', Object.keys(loginData));
      return res.status(400).json({
        error: "Bad Request",
        message: "Username and password are required. Received fields: " + Object.keys(loginData).join(', ')
      });
    }

    console.log(`🔐 Login attempt for user: ${loginData.user}`);
    const data = await auth.login(loginData);
    
    if (data !== null) {
      const cookieOptions = {
        maxAge: ms("15d"),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };
      
      console.log(`✅ Login successful for user: ${loginData.user}`);
      res
        .cookie("accessToken", data.token, cookieOptions)
        .status(200)
        .json(data);
    } else {
      console.log(`❌ Login failed for user: ${loginData.user} - Invalid credentials`);
      res.status(401).json({
        error: "Authentication Failed",
        message: "Invalid username or password"
      });
    }
  } catch (err) {
    console.error('💥 Login error:', err.message);
    res.status(500).json({
      error: "Server Error",
      message: "Authentication service unavailable"
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const version = req.headers.version;
    if (version === undefined || version < VERSION) {
      return res.status(426).json({
        error: "Update Required", 
        message: "Please update your app to the latest version"
      });
    }
    
    console.log(`👤 Registration attempt for user: ${req.body.user_name}`);
    const data = await auth.register(req.body);
    
    console.log(`✅ Registration successful for user: ${req.body.user_name}`);
    res.status(200).json({
      message: "Registration successful",
      user: data
    });
  } catch (err) {
    console.error('💥 Registration error:', err);
    
    if (err && err.includes && err.includes('already exists')) {
      res.status(409).json({
        error: "Registration Failed",
        message: err
      });
    } else {
      res.status(500).json({
        error: "Registration Failed", 
        message: err || "Unable to complete registration"
      });
    }
  }
};

exports.logout = async (req, res, next) => {
  try {
    const version = req.headers.version;
    if (version === undefined || version < VERSION) {
      return res.status(426).json({
        error: "Update Required",
        message: "Please update your app to the latest version"
      });
    }
    
    console.log(`🔐 Logout for user: ${req.user.user}`);
    res.clearCookie("accessToken");
    
    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error('💥 Logout error:', err.message);
    res.status(500).json({
      error: "Server Error",
      message: "Logout failed"
    });
  }
};

exports.verify = async (req, res, next) => {
  try {
    const version = req.headers.version;
    if (version === undefined || version < VERSION) {
      return res.status(426).json({
        error: "Update Required",
        message: "Please update your app to the latest version"
      });
    }
    
    console.log(`✅ Token verified for user: ${req.user.user}`);
    res.status(200).json({
      valid: true,
      user: req.user,
      message: "Token is valid"
    });
  } catch (err) {
    console.error('💥 Token verification error:', err.message);
    res.status(500).json({
      error: "Server Error",
      message: "Token verification failed"
    });
  }
};