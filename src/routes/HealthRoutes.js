const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dbHealth = await db.checkHealth();
    
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.VERSION || 1,
      database: dbHealth.status,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    console.log('🏥 Health check passed:', healthStatus);
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('🏥 Health check failed:', error.message);
    
    const healthStatus = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.VERSION || 1,
      database: "unavailable",
      error: error.message,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.status(503).json(healthStatus);
  }
});

// Detailed system status endpoint
router.get("/detailed", async (req, res) => {
  try {
    const dbHealth = await db.checkHealth();
    
    const detailedStatus = {
      application: {
        status: "running",
        version: process.env.VERSION || 1,
        nodeVersion: process.version,
        platform: process.platform,
        uptime: Math.floor(process.uptime()) + ' seconds',
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        status: dbHealth.status,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        },
        cpu: process.cpuUsage(),
        pid: process.pid
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Detailed health check:', detailedStatus);
    res.status(200).json(detailedStatus);
  } catch (error) {
    console.error('📊 Detailed health check failed:', error.message);
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;