import {
  registerUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import express from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
//Public
router.post("/", validationMiddleware(CreateUserDto), registerUser);
// Priv
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(UpdateUserDto),
  updateUser,
);

export default router;
