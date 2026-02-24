import { Request, Response } from "express";
import containerService from "../services/container.service";

class ContainerController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const { name, houseId } = req.body;
      const userId = (req as any).user.id;

      const newContainer = await containerService.createContainer(
        name,
        houseId,
        userId,
      );
      return res.status(201).json(newContainer);
    } catch (error: any) {
      const status =
        error.message === "Casa no encontrada o no te pertenece" ? 404 : 500;
      return res
        .status(status)
        .json({ message: error.message || "Error al crear container" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const houseId = req.query.houseId as string;
      const userId = (req as any).user.id;

      if (!houseId)
        return res.status(400).json({ message: "Falta el houseId" });

      const containers = await containerService.getContainersByHouse(
        houseId,
        userId,
      );
      return res.status(200).json(containers);
    } catch (error: any) {
      let status = 500;
      if (error.message === "Falta el houseId") status = 400;
      if (error.message === "Acceso denegado a esta casa") status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error al obtener containers" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const { name } = req.body;
      const userId = (req as any).user.id;

      const updatedContainer = await containerService.updateContainer(
        id,
        name,
        userId,
      );
      return res.status(200).json({
        message: "Container actualizado con éxito",
        container: updatedContainer,
      });
    } catch (error: any) {
      let status = 500;
      if (error.message === "Container no encontrado") status = 404;
      if (error.message === "No tienes permiso para editar esto") status = 403;
      return res
        .status(status)
        .json({ message: error.message || "Error al actualizar el container" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      await containerService.deleteContainer(id, userId);
      return res.status(200).json({ message: "Container eliminado" });
    } catch (error: any) {
      const status =
        error.message === "Container no encontrado o sin permisos" ? 404 : 500;
      return res
        .status(status)
        .json({ message: error.message || "Error al eliminar" });
    }
  }
}

export default new ContainerController();
