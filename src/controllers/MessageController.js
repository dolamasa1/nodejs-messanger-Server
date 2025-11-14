const message = require("../models/Message");

exports.findMessage = async (req, res, next) => {
  try {
    const type = req.query.type;
    if (type === "user") {
      const data = await message.findUserMessage({
        user: req.user,
        target: req.query.target,
        page: req.query.page,
      });
      res.status(200).json(data);
    } else {
      const data = await message.findGroupMessage({
        user: req.user,
        target: req.query.target,
        page: req.query.page,
      });
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).send(err.mesaage);
  }
};

exports.send = async (req, res, next) => {
  try {
    console.log('📨 Send message request received:', {
      body: req.body,
      query: req.query,
      user: req.user
    });

    let messageData;
    
    // Support both JSON body and query parameters
    if (Object.keys(req.body).length > 0) {
      // Using JSON body (preferred)
      console.log('📦 Using request body data');
      messageData = {
        from_user: req.user.id,
        from_name: req.user.user,
        type: req.body.type || 'user',
        target: parseInt(req.body.target || req.body.toUserId),
        message_type: 't',
        message: req.body.message,
        reference_id: null
      };
    } else if (Object.keys(req.query).length > 0) {
      // Using query parameters (legacy support)
      console.log('🔍 Using query parameters');
      messageData = {
        from_user: req.user.id,
        from_name: req.user.user,
        type: req.query.type || 'user',
        target: parseInt(req.query.target || req.query.toUserId),
        message_type: 't',
        message: req.query.message,
        reference_id: null
      };
    } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "No message data provided. Use either JSON body or query parameters."
      });
    }

    // Validate required fields
    if (!messageData.target || isNaN(messageData.target)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing or invalid target user/group ID. Use 'target' or 'toUserId' parameter with a valid integer."
      });
    }

    if (!messageData.message || messageData.message.trim() === '') {
      return res.status(400).json({
        error: "Bad Request", 
        message: "Missing message content."
      });
    }

    // Ensure target is a number for database foreign key
    messageData.target = parseInt(messageData.target);

    console.log('💾 Creating message with data:', messageData);
    const data = await message.create(messageData);
    
    console.log('✅ Message sent successfully:', {
      id: data.id,
      to: messageData.target,
      type: messageData.type
    });
    
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: data
    });
  } catch (err) {
    console.error('💥 Send message error:', err.message);
    
    // Handle specific database errors
    if (err.message.includes('foreign key constraint')) {
      return res.status(400).json({
        error: "Invalid Recipient",
        message: "The user or group you're trying to message doesn't exist or is invalid."
      });
    }
    
    res.status(500).json({
      error: "Message Send Failed",
      message: err.message
    });
  }
};

exports.upload = async (req, res, next) => {
  try {
    const file = {
      name: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      type: req.query.type,
      info: req.query.info,
    };
    const data = await message.upload(file);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.download = async (req, res, next) => {
  try {
    const filename = req.query.filename;
    const permission =
      (await message.checkIsProfile(req.user, filename)) ||
      (await message.checkPermission(req.user, filename));
    if (permission) {
      const url = "upload/" + filename;
      res.download(url);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    res.status(500).send(err.mesaage);
  }
};