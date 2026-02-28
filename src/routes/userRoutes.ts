import express from "express";
import userController from "../controllers/userController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(CreateUserDto),
  userController.registerUser,
);

router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(UpdateUserDto),
  userController.updateUser,
);

export default router;
