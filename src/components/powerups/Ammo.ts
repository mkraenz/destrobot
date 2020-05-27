import { Physics, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { IPowerUp } from "../IPowerUp";

const DISAPPEAR_TIMEOUT = 10000;
const SCALE = 0.4;
const TEXTURE = "ammo";

export class Ammo extends Physics.Arcade.Sprite implements IPowerUp {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, TEXTURE);
        this.setScale(SCALE);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        setTimeout(() => this.destroy(), DISAPPEAR_TIMEOUT);
    }

    public onCollide(): void {
        this.scene.events.emit(EventType.AmmoCollected);
        this.destroy();
    }
}
