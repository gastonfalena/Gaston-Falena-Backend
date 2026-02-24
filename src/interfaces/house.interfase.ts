export interface IHouseRepository {
  create(data: any): Promise<any>;
  findByOwner(ownerId: string): Promise<any[]>;
  findByIdAndOwner(id: string, ownerId: string): Promise<any | null>;
  updateByIdAndOwner(
    id: string,
    ownerId: string,
    data: any,
  ): Promise<any | null>;
  deleteByIdAndOwner(id: string, ownerId: string): Promise<any | null>;
}
