import { GameObjects, Scene } from "phaser";
import { GUI_DEPTH } from "../../styles/constants";

export class PlusMinusButton extends GameObjects.Sprite {
    private get hoverAnimKey() {
        return `${this.texture.key}-hover`;
    }

    private get baseAnimKey() {
        return `${this.texture.key}-base`;
    }

    private get holdAnimKey() {
        return `${this.texture.key}-hold`;
    }
    private isClicked = false;
    private timeSincePointerdown = 0;
    private timeSinceLastCallback = 0;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        texture: "plus" | "minus",
        private onPointerup: () => void,
        private disabledCondition?: () => boolean
    ) {
        super(scene, x, y, `${texture}-button`);
        scene.add.existing(this);
        this.setDepth(GUI_DEPTH + 1).setScrollFactor(0);
        this.setOrigin(0);
        this.configureAnims();
        this.enterBaseState();

        this.setInteractive({ useHandCursor: true })
            .on("pointerover", this.enterHoverState)
            .on("pointerout", this.enterBaseState)
            .on("pointerdown", this.enterHoldState)
            .on("pointerup", this.enterHoverState);
        this.setInputHandlersForHolding();
    }

    public preUpdate(time: number, deltaTime: number) {
        if (this.disabledCondition && this.disabledCondition()) {
            this.disableInteractive();
            this.setAlpha(0.5);
            this.resetClicked();
        } else {
            this.setInteractive();
            this.setAlpha(1);

            this.updateHold(deltaTime);
        }
    }

    private updateHold(deltaTime: number) {
        if (this.isClicked) {
            this.timeSincePointerdown += deltaTime;
            this.timeSinceLastCallback += deltaTime;
            if (
                this.timeSincePointerdown > 600 &&
                this.timeSinceLastCallback > 100
            ) {
                this.onPointerup();
                this.timeSinceLastCallback = 0;
            }
        }
    }

    private setInputHandlersForHolding() {
        const resetClicked = () => this.resetClicked();
        this.on("pointerdown", () => {
            this.isClicked = true;
            this.onPointerup();
        });
        this.on("pointerup", resetClicked);
        this.on("pointerout", resetClicked);
    }

    private resetClicked() {
        this.isClicked = false;
        this.timeSincePointerdown = 0;
    }

    private enterHoldState() {
        this.anims.play(this.holdAnimKey);
    }

    private enterHoverState() {
        this.anims.play(this.hoverAnimKey);
    }

    private enterBaseState() {
        this.anims.play(this.baseAnimKey);
    }

    private configureAnims() {
        this.configureAnim(this.baseAnimKey, 0);
        this.configureAnim(this.hoverAnimKey, 1);
        this.configureAnim(this.holdAnimKey, 2);
    }

    private configureAnim(key: string, frame: number) {
        const cfg: Phaser.Types.Animations.Animation = {
            key,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
                start: frame,
                end: frame,
            }),
            frameRate: 1,
            repeat: -1,
        };

        this.scene.anims.create(cfg);
        this.anims.load(key);
    }
}
