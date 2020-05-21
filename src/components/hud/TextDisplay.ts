import { GameObjects, Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";

const Cfg = {
    styles: {},
};

export class TextDisplay extends GameObjects.Text {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        private getText: () => string | number,
        alignRight = false
    ) {
        super(scene, x, y, "", Cfg.styles);
        scene.add.existing(this);
        this.setDepth(GUI_DEPTH + 1).setScrollFactor(0);
        if (alignRight) {
            this.setOrigin(1, 0);
        }
    }

    public preUpdate() {
        this.setText(`${this.getText()}`);
    }
}
