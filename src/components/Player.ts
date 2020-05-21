import { IFoodStore, IResources, IStore } from "../utils/IResources";
import { keysIn } from "../utils/ts";

export class Player implements IStore, IFoodStore {
    public food = 12;
    public stone = 90;
    public wood = 60;
    public crops = 20;

    public hasResources(res: Partial<IResources>) {
        return keysIn(res).every(key => res[key]! <= this[key]);
    }

    public addResources(res: Partial<IResources>) {
        keysIn(res).forEach(key => (this[key] += res[key]!));
    }

    public pay(res: Partial<IResources>) {
        keysIn(res).forEach(key => (this[key] -= res[key]!));
    }

    public print() {
        // tslint:disable-next-line: no-console
        console.log("player", this);
    }
}
