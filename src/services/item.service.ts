import itemRepository from "../repositories/item.repository";
import containerRepository from "../repositories/container.repository";
import {
  PopulatedContainer,
  PopulatedItem,
} from "../interfaces/populate.interfase";

class ItemService {
  async createItem(
    name: string,
    quantity: number,
    containerId: string,
    userId: string,
  ) {
    const container = await containerRepository.findByIdWithHouse(containerId);
    if (!container) throw new Error("Container no existe");

    const populatedContainer = container as unknown as PopulatedContainer;
    const houseOwner = populatedContainer.house.owner.toString();

    if (houseOwner !== userId) throw new Error("No tenés permiso en esta casa");

    return await itemRepository.create({
      name,
      quantity: quantity || 1,
      container: containerId,
      owner: userId,
    });
  }

  async getItemsByContainer(containerId: string, userId: string) {
    if (!containerId) throw new Error("Falta containerId");

    const container = await containerRepository.findByIdWithHouse(containerId);
    if (!container) throw new Error("Acceso denegado");

    const populatedContainer = container as unknown as PopulatedContainer;
    if (
      !populatedContainer.house ||
      populatedContainer.house.owner.toString() !== userId
    ) {
      throw new Error("Acceso denegado");
    }

    return await itemRepository.findByContainerId(containerId);
  }

  async updateItem(
    id: string,
    updateData: { name?: string; quantity?: number },
    userId: string,
  ) {
    const item = await itemRepository.findByIdWithContainerAndHouse(id);
    if (!item) throw new Error("Item no encontrado");

    const populatedItem = item as unknown as PopulatedItem;
    const ownerId = populatedItem.container.house.owner.toString();

    if (ownerId !== userId)
      throw new Error("No tienes permiso para editar este item");

    return await itemRepository.updateById(id, updateData);
  }

  async deleteItem(id: string, userId: string) {
    const item = await itemRepository.findByIdWithContainerAndHouse(id);
    if (!item) throw new Error("Item no encontrado");

    const populatedItem = item as unknown as PopulatedItem;
    const ownerId = populatedItem.container.house.owner.toString();

    if (ownerId !== userId) throw new Error("No puedes borrar items ajenos");

    await itemRepository.deleteById(id);
    return true;
  }

  async getTotalCount() {
    return await itemRepository.countAll();
  }
}

export default new ItemService();
