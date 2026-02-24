import containerRepository from "../repositories/container.repository";
import houseRepository from "../repositories/house.repository";
import { PopulatedContainer } from "../interfaces/populate.interfase";

class ContainerService {
  async createContainer(name: string, houseId: string, userId: string) {
    const house = await houseRepository.findByIdAndOwner(houseId, userId);
    if (!house) throw new Error("Casa no encontrada o no te pertenece");

    return await containerRepository.create({
      name,
      house: houseId,
      owner: userId,
    });
  }

  async getContainersByHouse(houseId: string, userId: string) {
    if (!houseId) throw new Error("Falta el houseId");

    const house = await houseRepository.findByIdAndOwner(houseId, userId);
    if (!house) throw new Error("Acceso denegado a esta casa");

    return await containerRepository.findByHouseId(houseId);
  }

  async updateContainer(id: string, name: string, userId: string) {
    const container = await containerRepository.findByIdWithHouse(id);
    if (!container) throw new Error("Container no encontrado");

    const populatedContainer = container as unknown as PopulatedContainer;
    const houseOwner = populatedContainer.house.owner.toString();

    if (houseOwner !== userId)
      throw new Error("No tienes permiso para editar esto");

    const newName = name || populatedContainer.name;
    return await containerRepository.updateName(id, newName);
  }

  async deleteContainer(id: string, userId: string) {
    const container = await containerRepository.findByIdWithHouse(id);
    if (!container) throw new Error("Container no encontrado o sin permisos");

    const populatedContainer = container as unknown as PopulatedContainer;

    if (populatedContainer.house.owner.toString() !== userId) {
      throw new Error("Container no encontrado o sin permisos");
    }

    await containerRepository.deleteById(id);
    return true;
  }
}

export default new ContainerService();
