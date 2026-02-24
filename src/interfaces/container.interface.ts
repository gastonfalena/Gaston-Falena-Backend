export interface IContainerRepository {
  create(data: any): Promise<any>;
  findByHouseId(houseId: string): Promise<any[]>;
  findByIdWithHouse(id: string): Promise<any | null>;
  updateName(id: string, name: string): Promise<any | null>;
  deleteById(id: string): Promise<any>;
}
