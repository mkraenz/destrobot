import { Physics, Scene } from "phaser";
import { IBuildCosts } from "../../utils/IBuildCosts";
import { IPoint } from "../../utils/IPoint";

export class House1 extends Physics.Arcade.Image {
    public static width = 16;
    public static height = 16;
    public static readonly texture = "house1";
    public static buildCosts: IBuildCosts = {
        stone: 0,
        wood: 1,
    };
    public citizen?: {};

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, House1.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setInteractive(); // blockinput
    }
}
