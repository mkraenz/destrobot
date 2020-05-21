import { GameObjects, Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";
import { IPoint } from "../../utils/IPoint";

export class PostIt extends GameObjects.Image {
    constructor(
        scene: Scene,
        { x, y }: IPoint,
        cfg: {
            onPointerup?: () => void;
            scale?: number;
        }
    ) {
        super(scene, x, y, "postit");
        scene.add.existing(this);
        this.setScale(cfg.scale || 1.5);
        this.setOrigin(0);
        this.setDepth(GUI_DEPTH).setScrollFactor(0);
        if (cfg.onPointerup) {
            this.setInteractive({ useHandCursor: true });
            this.on("pointerup", cfg.onPointerup);
        }
    }
}
