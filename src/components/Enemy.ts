import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { Color, toHex } from "../styles/Color";
import { IPoint } from "../utils/IPoint";

const MIN_DISTANCE_TO_TARGET = 5;
const SPEED = 50;
const DROP_FREQUENCY = 5;

export class Enemy extends Physics.Arcade.Sprite {
    public health: number;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        private target: GameObjects.Sprite,
        cfg: {
            health: number;
        }
    ) {
        super(scene, x, y, "enemy");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.health = cfg.health;
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
            .scale(SPEED);
        this.setVelocity(direction.x, direction.y);
    }

    public update() {
        this.move(this.target);
        if (this.health <= 0) {
            this.die();
        }
    }

    public isCloseToTarget() {
        if (!this.target) {
            return false;
        }
        const dist = this.dist(this.target);
        return dist < MIN_DISTANCE_TO_TARGET;
    }

    public die() {
        if (random(DROP_FREQUENCY) === DROP_FREQUENCY) {
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

    private dist(other: IPoint) {
        return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
    }
}
