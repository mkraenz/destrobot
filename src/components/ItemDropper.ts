import { Physics, Scene } from "phaser";
import { Heart } from "./powerups/Heart";

export class ItemDropper {
    constructor(private scene: Scene, powerups: Physics.Arcade.Group) {
        this.scene.events.on("drop-item", (data: { x: number; y: number }) => {
            const heart = new Heart(this.scene, data.x, data.y);
            powerups.add(heart);
        });
    }
}
