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
        const diffToMax = this.maxConcurrentEnemies - this.countActive();
        const newEnemyCount = Math.min(n, diffToMax);
        if (newEnemyCount > 0) {
            this.scene.sound.play("electric-buzz");
        }
        return Array(newEnemyCount)
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

    private countActive() {
        return this.spawnedEnemies.filter(e => e.active).length;
    }

    private reachedMaxConcurrentEnemies() {
        return this.countActive() > this.maxConcurrentEnemies;
    }

    private reachdGlobalConcurrentEnemyCount() {
        return this.enemies.countActive() > GLOBAL_MAX_CONCURRENT_ENEMIES;
    }
}
