const jwt = require("jsonwebtoken");
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(403).json("Authorization: Bearer header required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;

    const user = await User.findById(req.user_id);
    if (!user || !user.status) {
      return res.status(403).json("Account not activated");
    }
  
  } catch (err) {
    return res.status(401).send("Invalid Authorization Token");
  }
  return next();
};

module.exports = verifyToken;