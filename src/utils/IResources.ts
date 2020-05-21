export interface IResources {
    food: number;
    stone: number;
    wood: number;
    crops: number;
}

export interface IStore {
    addResources: (res: Partial<IResources>) => void;
}

export interface IFoodStore {
    hasResources(res: Partial<IResources>): boolean;
    pay(res: Partial<IResources>): void;
}
