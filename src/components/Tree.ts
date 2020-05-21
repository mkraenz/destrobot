import { random } from "lodash";
import { Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";

const WAVE = "wave";

export class Tree extends Physics.Arcade.Sprite {
    public static width = 16;
    public static height = 16;
    public static readonly texture = "tree";
    public isTaken = false;

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, Tree.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.animate();
        this.setInteractive(); // block input
    }

    public animate() {
        const config = {
            key: WAVE,
            frames: this.scene.anims.generateFrameNumbers(Tree.texture, {}),
            frameRate: 1,
            yoyo: true,
            repeat: -1,
        };

        this.scene.anims.create(config);
        this.anims.load(WAVE);
        setTimeout(() => this.anims.play(WAVE), random(2000));
    }
}
