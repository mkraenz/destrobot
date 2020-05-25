import { GameObjects, Scene } from "phaser";

export class Heart extends GameObjects.Image {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        private id: number,
        private health: () => number
    ) {
        super(scene, x, y, "heart");
        this.scene.add.existing(this);
        this.setScale(3);
    }

    public preUpdate() {
        if (this.id >= this.health()) {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }
    }
}
