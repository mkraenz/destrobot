import { GameObjects, Scene } from "phaser";

const FILLED = "heart-filled";
const FILLING = "heart-filling";
const EMPTY = "heart-empty";

export class Heart extends GameObjects.Sprite {
    private fillingStarted = false;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        private id: number,
        private health: () => number
    ) {
        super(scene, x, y, "heart");
        this.scene.add.existing(this);
        this.setScale(3);
        this.configureAnims();
    }

    public update() {
        // >= because id is 0-based, but health 1-based
        const isEmpty = this.id >= this.health();
        if (isEmpty) {
            this.play(EMPTY, true);
            this.fillingStarted = false;
        }
        if (!isEmpty && !this.fillingStarted) {
            this.play(FILLING, true);
            this.fillingStarted = true;
        }
    }

    private configureAnims() {
        this.configureAnim(FILLED, 7);
        this.configureAnim(FILLING, 0, 7);
        this.configureAnim(EMPTY, 0);
    }

    private configureAnim(key: string, frame: number, endFrame = frame) {
        const cfg: Phaser.Types.Animations.Animation = {
            key,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
                start: frame,
                end: endFrame,
            }),
            repeat: 0,
            duration: 200,
        };
        this.scene.anims.create(cfg);
        this.anims.load(key);
    }
}
