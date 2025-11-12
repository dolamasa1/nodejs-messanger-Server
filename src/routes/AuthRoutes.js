const express = require("express");
const authController = require("../controllers/AuthController");
const jwtVerify = require("../models/JwtVerify");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", jwtVerify.verify, authController.logout);
router.get("/verify", jwtVerify.verify, authController.verify);

module.exports = router;