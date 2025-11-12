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
    
    console.log(`🔐 Login attempt for user: ${req.query.user}`);
    const data = await auth.login(req.query);
    
    if (data !== null) {
      const cookieOptions = {
        maxAge: ms("15d"),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };
      
      console.log(`✅ Login successful for user: ${req.query.user}`);
      res
        .cookie("accessToken", data.token, cookieOptions)
        .status(200)
        .json(data);
    } else {
      console.log(`❌ Login failed for user: ${req.query.user} - Invalid credentials`);
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
    console.error('💥 Registration error:', err.message);
    
    if (err.includes('already exists')) {
      res.status(409).json({
        error: "Registration Failed",
        message: err
      });
    } else {
      res.status(500).json({
        error: "Registration Failed",
        message: "Unable to complete registration"
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