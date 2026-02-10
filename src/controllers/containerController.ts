import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateContainerDto } from "../dto/create-container.dto";
import { UpdateContainerDto } from "../dto/update-container.dto";
import Container from "../models/containerModel";
import House from "../models/houseModel";

export default class ContainerController {
  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateContainerDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) return res.status(400).json({ errors });

      const userId = (req as any).user.id;

      const house = await House.findOne({ _id: dto.houseId, owner: userId });
      if (!house) {
        return res
          .status(404)
          .json({ message: "Casa no encontrada o no te pertenece" });
      }

      const newContainer = new Container({
        name: dto.name,
        house: dto.houseId,
      });

      await newContainer.save();
      return res.status(201).json(newContainer);
    } catch (error) {
      return res.status(500).json({ message: "Error al crear container" });
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
      return res.status(500).json({ message: "Error al obtener containers" });
    }
  }

  // Actualizar nombre
  async update(req: Request, res: Response) {
    return res.status(501).json({ message: "Not implemented yet" });
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
      return res.status(500).json({ message: "Error al eliminar" });
    }
  }
}
