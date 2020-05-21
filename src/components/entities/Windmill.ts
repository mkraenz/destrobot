import { Physics, Scene } from "phaser";
import { IBuildCosts } from "../../utils/IBuildCosts";
import { IPoint } from "../../utils/IPoint";

const ROTATE_BLADES = "windmill rotate blades";

export class Windmill extends Physics.Arcade.Sprite {
    public static width = 24;
    public static height = 32;
    public static readonly texture = "windmill";
    public static buildCosts: IBuildCosts = {
        stone: 2,
        wood: 4,
    };
    public isTaken = false;

    constructor(scene: Scene, at: IPoint) {
        super(scene, at.x, at.y, Windmill.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.configureAnims();
        this.setInteractive(); // blockinput
    }

    public occupy() {
        this.isTaken = true;
        this.anims.play(ROTATE_BLADES);
    }

    public unOccupy() {
        this.isTaken = false;
        this.anims.stop();
    }

    private configureAnims() {
        const rotateCfg = {
            key: ROTATE_BLADES,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, {}),
            frameRate: 1,
            repeat: -1,
        };

        this.scene.anims.create(rotateCfg);
        this.anims.load(ROTATE_BLADES);
    }
}
