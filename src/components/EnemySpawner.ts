import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { Enemy, IEnemyConfig } from "./Enemy";

const GLOBAL_MAX_CONCURRENT_ENEMIES = 150;

export class EnemySpawner {
    private spawnedEnemies: Enemy[] = [];

    constructor(
        private scene: Scene,
        private at: IPoint,
        private target: GameObjects.Sprite,
        private enemies: Physics.Arcade.Group,
        private cfg: IEnemyConfig,
        private maxConcurrentEnemies: number
    ) {}

    public spawn(n: number) {
        if (this.reachedMaxConcurrentEnemies()) {
            return [];
        }
        if (this.reachdGlobalConcurrentEnemyCount()) {
            return [];
        }
        this.scene.sound.play("electric-buzz");
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
            this.spawnedEnemies.push(...entities);
            this.enemies.addMultiple(entities, true);
        }, timeout);
    }

    private reachedMaxConcurrentEnemies() {
        return (
            this.spawnedEnemies.filter(e => e.active).length >
            this.maxConcurrentEnemies
        );
    }

    private reachdGlobalConcurrentEnemyCount() {
        return this.enemies.countActive() > GLOBAL_MAX_CONCURRENT_ENEMIES;
    }
}
