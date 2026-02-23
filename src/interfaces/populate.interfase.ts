export interface PopulatedHouse {
  owner: { toString(): string };
}

export interface PopulatedContainer {
  house: PopulatedHouse;
  name: string;
}

export interface PopulatedItem {
  container: PopulatedContainer;
}
