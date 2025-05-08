import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  getUserDetail,
  updateUser,
  changePassword

} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.put(
  "/update",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateUser
);

userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/change-password",changePassword)
userRouter.get("/users", getAllUsers);
userRouter.get("/:id", getUserDetail);

export default userRouter;
