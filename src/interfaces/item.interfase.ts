export interface IItemRepository {
  create(data: any): Promise<any>;
  findByContainerId(containerId: string): Promise<any[]>;
  findByIdWithContainerAndHouse(id: string): Promise<any | null>;
  updateById(id: string, data: any): Promise<any | null>;
  deleteById(id: string): Promise<any>;
  countAll(): Promise<number>;
}
