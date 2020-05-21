import { GameObjects, Scene } from "phaser";

export class Heart extends GameObjects.Image {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        private id: number,
        private player: () => { health: number }
    ) {
        super(scene, x, y, "heart");
        this.scene.add.existing(this);
        this.setScale(3);
    }

    public preUpdate() {
        if (this.id >= this.player().health) {
            this.setVisible(false);
        }
    }
}
