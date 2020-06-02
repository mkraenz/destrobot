import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { gOptions } from "../gOptions";
import { IPoint } from "../utils/IPoint";
import { Enemy, IEnemyConfig } from "./Enemy";
import { IWeaponConfig, Weapon } from "./weapons/Weapon";

const GLOBAL_MAX_CONCURRENT_ENEMIES = 150;

type Group = Physics.Arcade.Group;

export class EnemySpawner {
    private spawnedEnemies: Enemy[] = [];
    private spawnTimers: number[] = [];

    constructor(
        private scene: Scene,
        private at: IPoint,
        private target: GameObjects.Sprite,
        private enemies: Group,
        private cfg: IEnemyConfig,
        private weaponCfg: IWeaponConfig | undefined,
        private maxConcurrentEnemies: number,
        private enemyBullets: Group
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
            this.scene.sound.play("electric-buzz", {
                volume: gOptions.sfxVolume,
            });
        }
        return Array(newEnemyCount)
            .fill(0)
            .map(_ => {
                let weapon;
                if (this.cfg.weapon && this.weaponCfg) {
                    weapon = new Weapon(this.scene, this.enemyBullets, {
                        ...this.weaponCfg,
                        isEnemyWeapon: true,
                    });
                }
                const enemy = new Enemy(
                    this.scene,
                    this.target,
                    {
                        ...this.cfg,
                        x: this.at.x + random(100),
                        y: this.at.y + random(100),
                    },
                    weapon
                );
                enemy.create();
                return enemy;
            });
    }

    public spawnInterval(entitiesPerWave: number, timeout: number) {
        const timer = window.setInterval(() => {
            const entities = this.spawn(entitiesPerWave);
            this.spawnedEnemies.push(...entities);
            this.enemies.addMultiple(entities, true);
        }, timeout);
        this.spawnTimers.push(timer);
    }

    public stop() {
        this.spawnTimers.forEach(timer => clearTimeout(timer));
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
