import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer token"

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // 👈 sets req.user

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export default requireAuth;
