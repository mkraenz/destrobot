import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { Enemy, IEnemyConfig } from "./Enemy";

const MAX = 20;

export class EnemySpawner {
    constructor(
        private scene: Scene,
        private at: IPoint,
        private target: GameObjects.Sprite,
        private enemies: Physics.Arcade.Group,
        private cfg: IEnemyConfig
    ) {}

    public spawn(n: number) {
        if (this.enemies.countActive() > MAX) {
            return [];
        }
        return Array(n)
            .fill(0)
            .map(_ => {
                const enemy = new Enemy(this.scene, this.target, {
                    ...this.cfg,
                    x: this.at.x + random(100),
                    y: this.at.y + random(100),
                });
                enemy.create();
                return enemy;
            });
    }

    public spawnInterval(entitiesPerWave: number, timeout: number) {
        setInterval(() => {
            const entities = this.spawn(entitiesPerWave);
            this.enemies.addMultiple(entities, true);
        }, timeout);
    }
}
