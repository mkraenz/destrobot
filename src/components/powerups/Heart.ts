import { Physics, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { IPowerUp } from "../IPowerUp";

const FILLED_FRAME = 7;

export class Heart extends Physics.Arcade.Sprite implements IPowerUp {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "heart");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setFrame(FILLED_FRAME);
    }

    public onCollide(): void {
        this.scene.events.emit(EventType.HeartCollected);
        this.destroy();
    }
}
