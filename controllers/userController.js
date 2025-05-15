import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import nodemailer from "nodemailer";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ success: true, token, id: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8) return res.json({ success: false, message: "Please enter a strong password" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, mobile, email, password: hashedPassword });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, id: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "name mobile email");
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserDetail = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(401).json({ status: false, message: "Id Not provided" });

  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User Not Found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error Try again later" });
  }
};

const updateUser = async (req, res) => {
  const { id, name, email, mobile, address } = req.body;
  const coverImageFile = req.files?.coverImage?.[0];
  const profileImageFile = req.files?.profileImage?.[0];

  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;

    if (email) {
      const emailExists = await userModel.findOne({ email, _id: { $ne: id } });
      if (emailExists) return res.status(400).json({ success: false, message: "Email already exists" });
      user.email = email;
    }

    if (mobile) {
      const mobileExists = await userModel.findOne({ mobile, _id: { $ne: id } });
      if (mobileExists) return res.status(400).json({ success: false, message: "Mobile number already exists" });
      user.mobile = mobile;
    }

    if (address) user.address = address;

    if (coverImageFile) {
      const result = await cloudinary.uploader.upload(coverImageFile.path, { folder: "user_covers" });
      user.coverImage = result.secure_url;
    }

    if (profileImageFile) {
      const result = await cloudinary.uploader.upload(profileImageFile.path, { folder: "user_profiles" });
      user.profileImage = result.secure_url;
    }

    const updatedUser = await user.save();
    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { id, currentPassword, newPassword, confirmPassword } = req.body;

  if (!id || !currentPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ success: false, message: "All fields are required." });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ success: false, message: "New passwords do not match." });

  if (newPassword.length < 8)
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });

  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Current password is incorrect." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("🔗 Reset Password Link:", resetUrl);

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "🔒 Reset Your Password",
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">
          Hello <strong>${user.name || 'User'}</strong>,
        </p>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. If you made this request, click the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007BFF; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          This email was sent by [Your App Name].<br />
          Please do not reply to this message.
        </p>
      </div>
    </div>
  `,
});


    res.json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match or are missing." });
  }

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: "Password has been reset." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  getUserDetail,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword
};
