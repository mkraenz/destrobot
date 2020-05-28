import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { IEnemyKilledEvent } from "../events/Events";
import { EventType } from "../events/EventType";
import { Color, toHex } from "../styles/Color";
import { IPoint } from "../utils/IPoint";

const MIN_DISTANCE_TO_TARGET = 5;

export interface IEnemyConfig {
    name: string;
    texture: string;
    scale: number;
    health: number;
    dropFrequency: number;
    speed: number;
    damage: number;
    score: number;
    tint?: string;
}

export class Enemy extends Physics.Arcade.Sprite {
    public health: number;
    public readonly damage: number;
    private dropFrequency: number;
    private speed: number;
    private score: number;
    private baseTint!: string;

    constructor(
        scene: Scene,
        private target: GameObjects.Sprite,
        cfg: IEnemyConfig & IPoint
    ) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.name = cfg.name;
        this.health = cfg.health;
        this.dropFrequency = cfg.dropFrequency;
        this.speed = cfg.speed;
        this.damage = cfg.damage;
        this.score = cfg.score;
        this.setScale(cfg.scale);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if (cfg.tint) {
            this.baseTint = cfg.tint;
            this.applyBaseTint();
        }
    }

    public create() {
        this.setCollideWorldBounds(true);
        this.setBounce(10);
    }

    public move(to: GameObjects.Sprite) {
        const Vector = Phaser.Math.Vector2;
        const location = new Vector(this.x, this.y);
        const goal = new Vector(to.x, to.y);
        const direction = goal
            .add(location.negate())
            .normalize()
            .scale(this.speed);
        this.setVelocity(direction.x, direction.y);
    }

    public update() {
        this.move(this.target);
        if (this.health <= 0) {
            this.die();
        }
    }

    public die() {
        if (this.isRandomDrop()) {
            this.scene.events.emit("drop-item", { x: this.x, y: this.y });
        }
        const enemyKilledEventData: IEnemyKilledEvent = { score: this.score };
        this.scene.events.emit(EventType.EnemyKilled, enemyKilledEventData);
        this.setActive(false);
        this.disableBody(true);
        this.setVisible(false);
        this.scene.sound.play("enemy-die", { volume: 5 });
    }

    public takeDamage(damage: number) {
        this.health -= damage;
        this.setTint(toHex(Color.Red));
        this.scene.sound.play("enemy-hit");
        setTimeout(() => {
            this.clearTint();
            if (this.baseTint) {
                this.applyBaseTint();
            }
        }, 200);
    }

    private isCloseToTarget() {
        if (!this.target) {
            return false;
        }
        const dist = this.dist(this.target);
        return dist < MIN_DISTANCE_TO_TARGET;
    }

    private dist(other: IPoint) {
        return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
    }

    private isRandomDrop() {
        // _.random(n) emits numbers from 0 to n-1.
        // We want that a drop occurs once in dropFrequency many cases, thus the -1.
        // For example, dropFrequency=1 means every kill will drop something.
        return random(this.dropFrequency - 1) === this.dropFrequency - 1;
    }

    private applyBaseTint() {
        this.setTint(toHex(this.baseTint));
    }
}
