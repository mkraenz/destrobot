import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { Color, toHex } from "../styles/Color";
import { IPoint } from "../utils/IPoint";

const MIN_DISTANCE_TO_TARGET = 5;

export interface IEnemyConfig {
    texture: string;
    health: number;
    dropFrequency: number;
    speed: number;
    name: string;
}

export class Enemy extends Physics.Arcade.Sprite {
    public health: number;
    private dropFrequency: number;
    private speed: number;

    constructor(
        scene: Scene,
        private target: GameObjects.Sprite,
        cfg: IEnemyConfig & IPoint
    ) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        console.log(cfg.texture);
        this.name = cfg.name;
        this.health = cfg.health;
        this.dropFrequency = cfg.dropFrequency;
        this.speed = cfg.speed;
        scene.add.existing(this);
        scene.physics.add.existing(this);
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
        if (random(this.dropFrequency) === this.dropFrequency) {
            this.scene.events.emit("drop-item", { x: this.x, y: this.y });
        }
        this.scene.events.emit("enemy-killed");
        this.setActive(false);
        this.disableBody(true);
        this.setVisible(false);
    }

    public getHit(damage: number) {
        this.health -= damage;
        this.setTint(toHex(Color.Red));
        setTimeout(() => this.clearTint(), 200);
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
}
