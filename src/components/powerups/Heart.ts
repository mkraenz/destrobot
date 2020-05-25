import { Physics, Scene } from "phaser";
import { IPowerUp } from "../IPowerUp";

export class Heart extends Physics.Arcade.Sprite implements IPowerUp {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "heart");
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    public onCollide(): void {
        this.scene.events.emit("heart-collected");
        this.destroy();
    }
}
