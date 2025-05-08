import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, id: user._id });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

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
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
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

  if (!id)
    return res.status(401).json({ status: false, message: "Id Not provided" });
  try {
    const user = await userModel.findById(id).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, messsage: "Server Error Try again later" });
  }
};

const updateUser = async (req, res) => {
    console.log("inside update");
    const { id, name, email, mobile, address } = req.body;
  
    const coverImageFile = req.files?.coverImage?.[0];
    const profileImageFile = req.files?.profileImage?.[0];
  
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (name) user.name = name;
  
      if (email) {
        const emailExists = await userModel.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
          return res.status(400).json({ success: false, message: "Email already exists" });
        }
        user.email = email;
      }
  
      if (mobile) {
        const mobileExists = await userModel.findOne({ mobile, _id: { $ne: id } });
        if (mobileExists) {
          return res.status(400).json({ success: false, message: "Mobile number already exists" });
        }
        user.mobile = mobile;
      }
  
      if (address) user.address = address;
  

      if (coverImageFile) {
        try {
          const result = await cloudinary.uploader.upload(coverImageFile.path, {
            folder: "user_covers",
          });
          user.coverImage = result.secure_url;
        } catch (error) {
          console.error("Error uploading cover image:", error);
          return res.status(400).json({ success: false, message: "Failed to upload cover image" });
        }
      }
  
    
      if (profileImageFile) {
        try {
          const result = await cloudinary.uploader.upload(profileImageFile.path, {
            folder: "user_profiles",
          });
          user.profileImage = result.secure_url;
        } catch (error) {
          console.error("Error uploading profile image:", error);
          return res.status(400).json({ success: false, message: "Failed to upload profile image" });
        }
      }
  
      const updatedUser = await user.save();
      return res.status(200).json({ success: true, updatedUser });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };


  const changePassword = async (req, res) => {
    const { id, currentPassword, newPassword, confirmPassword } = req.body;
  
    if (!id || !currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match." });
    }
  
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }
  
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Current password is incorrect." });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      await user.save();
  
      return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
      console.error("Password change error:", error);
      return res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
  };
  

export {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  getUserDetail,
  updateUser,
  changePassword
};
