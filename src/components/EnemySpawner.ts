import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
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
                    this.target,
                    { health: 5 }
                );
                enemy.create();
                return enemy;
            });
    }

    public spawnInterval(
        entitiesPerWave: number,
        timeout: number,
        group: Physics.Arcade.Group,
        addEntities: (entity: Physics.Arcade.Sprite) => void
    ) {
        setInterval(() => {
            const entities = this.spawn(entitiesPerWave);
            entities.forEach(e => addEntities(e));
            group.addMultiple(entities);
            entities.forEach(e => e.create());
        }, timeout);
    }
}
