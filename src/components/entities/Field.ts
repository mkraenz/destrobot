import { Physics, Scene } from "phaser";
import { IBuildCosts } from "../../utils/IBuildCosts";
import { IPoint } from "../../utils/IPoint";

// https://opengameart.org/content/farming-crops-16x16

export class Field extends Physics.Arcade.Image {
    public static width = 32;
    public static height = 24;
    public static readonly texture = "field";
    public static buildCosts: IBuildCosts = {
        stone: 0,
        wood: 2,
    };
    public isTaken = false;

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, Field.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setInteractive(); // block input
    }
}
