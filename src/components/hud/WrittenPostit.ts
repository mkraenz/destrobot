import { GameObjects, Scene } from "phaser";
import { Color } from "../../styles/Color";
import { GUI_DEPTH } from "../../styles/constants";

export class WrittenPostit extends GameObjects.Image {
    private text: GameObjects.Text;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        private dataSrc: () => string | number
    ) {
        super(scene, x, y, "postit-two-pins");
        scene.add.existing(this);
        this.setInteractive(); // block input
        this.setDepth(GUI_DEPTH).setScrollFactor(0);
        this.text = this.scene.add
            .text(x - 10, y - 5, "", { color: Color.Black })
            .setDepth(this.depth + 1);
    }

    public preUpdate() {
        this.text.setText(`${this.dataSrc()}`);
    }
}
