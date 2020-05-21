import { Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";
import { atCenter } from "../../utils/get-coords";
import { IPoint } from "../../utils/IPoint";
import { Sprite } from "../../utils/Sprite";
import { PostIt } from "./PostIt";

export class PostItWithImage {
    public readonly postIt: PostIt;
    public readonly image: Sprite;

    constructor(
        scene: Scene,
        at: IPoint,
        cfg: {
            component: {
                texture: string;
                scale?: number;
            };
            onPointerup?: () => void;
            scale?: number;
        }
    ) {
        this.postIt = new PostIt(scene, at, cfg);
        const center = atCenter(this.postIt);

        this.image = scene.add
            .image(center.x, center.y, cfg.component.texture)
            .setDepth(GUI_DEPTH)
            .setScrollFactor(0);
        if (cfg.component.scale) {
            this.image.setScale(cfg.component.scale);
        }
    }
}
