import { Request, Response } from "express";
import Container from "../models/containerModel";
import House from "../models/houseModel";

export default class ContainerController {
  async create(req: Request, res: Response) {
    try {
      console.log("--> CREATE CONTAINER - User:", (req as any).user);
      console.log("--> CREATE CONTAINER - Body:", req.body);

      const { name, houseId } = req.body;
      const userId = (req as any).user.id;

      const house = await House.findOne({ _id: houseId, owner: userId });

      if (!house) {
        console.log("❌ Casa no encontrada o ajena");
        return res
          .status(404)
          .json({ message: "Casa no encontrada o no te pertenece" });
      }

      // 4. Crear y guardar
      const newContainer = new Container({
        name: name,
        house: houseId,
        owner: userId,
      });

      await newContainer.save();

      console.log("✅ Container creado:", newContainer);
      return res.status(201).json(newContainer);
    } catch (error) {
      // IMPORTANTE: Esto te mostrará el error real en la consola
      console.error("🔴 ERROR EN CREATE CONTAINER:", error);
      return res
        .status(500)
        .json({ message: "Error al crear container", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { houseId } = req.query;
      const userId = (req as any).user.id;

      if (!houseId)
        return res.status(400).json({ message: "Falta el houseId" });

      const house = await House.findOne({ _id: houseId, owner: userId });
      if (!house)
        return res.status(403).json({ message: "Acceso denegado a esta casa" });

      const containers = await Container.find({ house: houseId });
      return res.status(200).json(containers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener containers" });
    }
  }

  // Actualizar nombre
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body; // Tomamos directo del body validado
      const userId = (req as any).user.id;

      const container = await Container.findById(id).populate("house");

      if (!container) {
        return res.status(404).json({ message: "Container no encontrado" });
      }

      const houseOwner = (container.house as any).owner.toString();
      if (houseOwner !== userId) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para editar esto" });
      }

      container.name = name || container.name;

      await container.save();

      return res.status(200).json({
        message: "Container actualizado con éxito",
        container,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error al actualizar el container" });
    }
  }

  // Eliminar
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const container = await Container.findById(id).populate("house");

      if (!container || (container.house as any).owner.toString() !== userId) {
        return res
          .status(404)
          .json({ message: "Container no encontrado o sin permisos" });
      }

      await Container.deleteOne({ _id: id });
      return res.status(200).json({ message: "Container eliminado" });
    } catch (error) {
      console.error(error); // Ver error real
      return res.status(500).json({ message: "Error al eliminar" });
    }
  }
}
