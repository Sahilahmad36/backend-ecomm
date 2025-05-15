import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  getUserDetail,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/change-password", changePassword);
userRouter.get("/users", getAllUsers);
userRouter.get("/:id", getUserDetail);

userRouter.put(
  "/update",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateUser
);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
