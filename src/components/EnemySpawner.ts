import { random } from "lodash";
import { GameObjects, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { Enemy } from "./Enemy";

export class EnemySpawner {
    constructor(
        private scene: Scene,
        private at: IPoint,
        private target: GameObjects.Sprite
    ) {}

    public spawn(n: number) {
        return Array(n)
            .fill(0)
            .map(_ => {
                const enemy = new Enemy(
                    this.scene,
                    this.at.x + random(100),
                    this.at.y + random(100),
                    this.target
                );
                return enemy;
            });
    }
}
