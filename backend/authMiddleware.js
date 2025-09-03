const jwt = require("jsonwebtoken");
const JWT_SECRET = "mysecretkey";

function authMiddleware(req, res, next) {
  console.log("Authorization Header:", req.headers["authorization"]);
  const token = req.headers["authorization"];// Because frontend usually sends header like:
                                              //Authorization: Bearer eyJhbGciOiJIUzI1...
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decodedPayload = jwt.verify(token.split(" ")[1], JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);
    req.user = decodedPayload; // { userId: ... }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
