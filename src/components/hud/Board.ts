import { GameObjects, Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";

export class Board extends GameObjects.Image {
    constructor(scene: Scene, x: number, y: number, centerOrigin = false) {
        super(scene, x, y, "board");
        scene.add.existing(this);
        const scale = 10;
        this.setDisplaySize(23 * scale * 1.2, 7 * scale);
        if (!centerOrigin) {
            this.setOrigin(0);
        }
        this.setInteractive(); // block input
        this.setDepth(GUI_DEPTH).setScrollFactor(0);
    }
}
