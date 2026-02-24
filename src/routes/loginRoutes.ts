import {
  registerUser,
  login,
  logout,
  googleLogin,
} from "../controllers/userController";
import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateUserDto } from "../dto/create-user.dto";

const router = express.Router();

router.post("/register", validationMiddleware(CreateUserDto), registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleLogin);

export default router;
