import { Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { IFoodStore } from "../utils/IResources";
import { Citizen } from "./Citizen";

export class CitizenSpawner {
    constructor(
        private scene: Scene,
        private at: IPoint,
        private store: IFoodStore
    ) {}

    public spawn(n: number) {
        return Array(n)
            .fill(0)
            .map(_ => {
                const cit = new Citizen(
                    this.scene,
                    this.at.x,
                    this.at.y,
                    this.store
                );
                return cit;
            });
    }
}
