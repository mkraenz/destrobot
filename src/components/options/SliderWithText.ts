import { GameObjects, Scene } from "phaser";
import { TextConfig } from "../../styles/Text";

export class SliderWithText extends GameObjects.DOMElement {
    constructor(scene: Scene, y: number, text: string, id: string) {
        super(scene, scene.scale.width / 2, y);

        scene.add
            .text(scene.scale.width / 2 - 10, y, text, TextConfig.md)
            .setOrigin(1, 0.5);
        this.createFromHTML(Slider(id))
            .setOrigin(0, 0.5)
            .addListener("change");

        scene.add.existing(this);
    }
}

const Slider = (id: string) =>
    `<input type="range" min="0" max="100" value="50" class="slider" id="${id}">`;
