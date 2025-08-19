// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
//   console.log("🔐 Auth Header:", authHeader);
//   // At the start of authMiddleware
// console.log("🔐 Request received at:", new Date().toISOString());
// console.log("🔐 Full headers:", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  // console.log("🧾 Extracted Token:", token);

 try {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // console.log("✅ Decoded Token:", decoded);
  
  // Add current time comparison
  const now = Date.now() / 1000;
  // console.log(`Current time: ${now}, Expires at: ${decoded.exp}`);
  // console.log(`Seconds until expiration: ${decoded.exp - now}`);
  
  req.user = decoded;
  next();
} catch (err) {
  console.error(" JWT Error:", err.message);
  if (err.name === 'TokenExpiredError') {
    const expiredAt = new Date(err.expiredAt * 1000);
    console.log(`Token expired at: ${expiredAt}`);
  }
  return res.status(401).json({ message: "Invalid or expired token" });
}
};

export default authMiddleware;
