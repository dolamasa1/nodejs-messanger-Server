const user = require("../models/User");

exports.findAll = async (req, res, next) => {
  try {
    const data = await user.findAll({
      user: req.user,
      page: req.query.page,
      search: req.query?.search,
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const type = req.query.type;
    const id = req.query.id;
    const data =
      type === "user"
        ? await user.findUserById(id)
        : await user.findGroupById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const id = req.query.id;
    const data = await user.getUserProfile(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
// Add this method to UserController.js
exports.checkUserExists = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid User ID",
        message: "User ID must be a valid number"
      });
    }

    const sql = "SELECT user_id, user_uuid, first_name, last_name FROM user WHERE user_id = ? AND status = '1' LIMIT 1";
    
    db.execute(sql, [userId], (err, result) => {
      if (err) {
        console.error('💥 Database error checking user:', err);
        return res.status(500).json({
          error: "Database Error",
          message: "Failed to check user existence"
        });
      }
      
      if (result.length === 1) {
        res.status(200).json({
          exists: true,
          user: result[0]
        });
      } else {
        res.status(200).json({
          exists: false,
          message: `User with ID ${userId} not found`
        });
      }
    });
  } catch (err) {
    console.error('💥 Check user exists error:', err);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to check user existence"
    });
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const id = req.query.id;
    const data = await user.getUser(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
