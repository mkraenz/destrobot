import { GUI } from "dat.gui";
import { GameObjects, Scene } from "phaser";

export class DebugGui extends GameObjects.Image {
    private gui = new GUI({ closeOnTop: true });

    constructor(scene: Scene, target: GameObjects.Sprite | GameObjects.Image) {
        super(scene, -1000, -1000, "");
        scene.add.existing(this);
        this.gui.add(target, "name");
        this.gui
            .add(target, "x")
            .min(0)
            .max(this.scene.scale.width);
        this.gui
            .add(target, "y")
            .min(0)
            .max(this.scene.scale.height);
        this.gui.add(target, "active");
        this.gui.add(target, "visible");
    }

    public preUpdate() {
        this.gui.updateDisplay();
    }
}
