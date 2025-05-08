import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    let token;

    // Support for "Authorization: Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.token) {
        // Fallback if token is sent directly in custom "token" header
        token = req.headers.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Attach user to request (recommended over attaching to req.body)
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
};

export default authUser;
