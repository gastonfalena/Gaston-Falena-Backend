import { Router } from "express";
import ContainerController from "../controllers/containerController";
import validationMiddleware from "../middlewares/validationMiddleware";
import { CreateContainerDto } from "../dto/create-container.dto";
import { UpdateContainerDto } from "../dto/update-container.dto";

const router = Router();
const containerController = new ContainerController();

router.post(
  "/",
  validationMiddleware(CreateContainerDto),
  containerController.create,
);
router.get("/", containerController.getAll); // Se usa así: GET /api/containers?houseId=xxxx
router.put(
  "/:id",
  validationMiddleware(UpdateContainerDto),
  containerController.update,
);
router.delete("/:id", containerController.delete);

export default router;
