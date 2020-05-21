import { GameObjects, Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";

const MIN_DISTANCE_TO_TARGET = 5;
const SPEED = 50;

export class Enemy extends Physics.Arcade.Sprite {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        private target: GameObjects.Sprite
    ) {
        super(scene, x, y, "enemy");
        scene.add.existing(this);
        scene.physics.add.existing(this);
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
    }

    public isCloseToTarget() {
        if (!this.target) {
            return false;
        }
        const dist = this.dist(this.target);
        return dist < MIN_DISTANCE_TO_TARGET;
    }

    public dist(other: IPoint) {
        return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
    }

    public die() {
        console.log("die");
        this.setActive(false);
        this.disableBody(true);
        this.setVisible(false);
    }
}
