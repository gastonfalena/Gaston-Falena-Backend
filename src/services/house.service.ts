import houseRepository from "../repositories/house.repository";
import { CreateHouseDto } from "../dto/create-house.dto";
import { UpdateHouseDto } from "../dto/update-house.dto";

class HouseService {
  async createHouse(houseDto: CreateHouseDto, userId: string) {
    return await houseRepository.create({
      ...houseDto,
      owner: userId,
    });
  }

  async getHousesByUser(userId: string) {
    return await houseRepository.findByOwner(userId);
  }

  async updateHouse(id: string, updateDto: UpdateHouseDto, userId: string) {
    const updatedHouse = await houseRepository.updateByIdAndOwner(
      id,
      userId,
      updateDto,
    );
    if (!updatedHouse) throw new Error("Casa no encontrada o no tenés permiso");
    return updatedHouse;
  }

  async deleteHouse(id: string, userId: string) {
    const deletedHouse = await houseRepository.deleteByIdAndOwner(id, userId);
    if (!deletedHouse)
      throw new Error(
        "No se encontró la casa o no tienes permisos para eliminarla",
      );
    return deletedHouse;
  }
}

export default new HouseService();
