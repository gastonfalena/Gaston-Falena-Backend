import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateHouseDto } from "../dto/create-house.dto";
import { UpdateHouseDto } from "../dto/update-house.dto";
import houseService from "../services/house.service";

class HouseController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const houseDto = plainToInstance(CreateHouseDto, req.body);
      const errors = await validate(houseDto);
      if (errors.length > 0)
        return res.status(400).json({ message: "Validación fallida", errors });

      const userId = (req as any).user.id;
      const newHouse = await houseService.createHouse(houseDto, userId);

      return res.status(201).json({
        message: "Casa creada y vinculada a tu usuario",
        data: newHouse,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Error al procesar la creación de la casa" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.id;
      const houses = await houseService.getHousesByUser(userId);
      return res.status(200).json(houses);
    } catch (error: any) {
      return res.status(500).json({ message: "Error al obtener tus casas" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      const updateDto = plainToInstance(UpdateHouseDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0)
        return res.status(400).json({ message: "Validación fallida", errors });

      const updatedHouse = await houseService.updateHouse(
        id,
        updateDto,
        userId,
      );
      return res.status(200).json({
        message: "Casa actualizada correctamente",
        data: updatedHouse,
      });
    } catch (error: any) {
      const status =
        error.message === "Casa no encontrada o no tenés permiso" ? 404 : 500;
      return res
        .status(status)
        .json({ message: error.message || "Error al actualizar la casa" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id;

      const deletedHouse = await houseService.deleteHouse(id, userId);
      return res.status(200).json({
        message: "Casa eliminada correctamente",
        id: deletedHouse._id,
      });
    } catch (error: any) {
      const status =
        error.message ===
        "No se encontró la casa o no tienes permisos para eliminarla"
          ? 404
          : 500;
      return res
        .status(status)
        .json({ message: error.message || "Error al eliminar la casa" });
    }
  }
}

export default new HouseController();
