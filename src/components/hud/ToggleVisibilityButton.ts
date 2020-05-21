import { GameObjects, Scene } from "phaser";
import { Color, toHex } from "../../styles/Color";

const Cfg = {
    styles: {},
};

export class ToggleVisibilityButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, toggledScene: Scene) {
        super(scene, x, y, "x", Cfg.styles);
        this.setInteractive({ useHandCursor: true }).on("pointerup", () =>
            toggleVisibility(toggledScene)
        );
        // this.scene.input.enableDebug(this);
        this.scene.add
            .rectangle(x - 2, y + 2, 12, 12, toHex(Color.Brown))
            .setOrigin(0);
        scene.add.existing(this);
    }
}

const toggleVisibility = (s: Scene) => s.scene.setVisible(!s.scene.isVisible());
