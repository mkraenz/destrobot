import { GameObjects, Scene } from "phaser";

const IMG_KEY = "fullscreen";

export class FullscreenButton extends GameObjects.Image {
    constructor(scene: Scene) {
        super(scene, scene.scale.width - 16, 16, IMG_KEY, 0);
        this.setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .setAlpha(0.6);
        scene.add.existing(this);
        this.on("pointerup", () => {
            if (scene.scale.isFullscreen) {
                this.setFrame(0);
                scene.scale.toggleFullscreen();
            } else {
                this.setFrame(1);
                scene.scale.toggleFullscreen();
            }
        });
    }
}
