import express from "express";
import userController from "../controllers/userController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateUserDto } from "../dto/create-user.dto";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(CreateUserDto),
  userController.registerUser,
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/google", userController.googleLogin);

export default router;
