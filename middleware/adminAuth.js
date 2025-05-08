import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid admin token." });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ success: false, message: "Token verification failed." });
  }
};

export default adminAuth;
