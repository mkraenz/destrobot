import { Physics, Scene } from "phaser";
import { PlayerMovementController } from "./PlayerMovementController";
import { PlayerShootingController } from "./PlayerShootingController";

const hitFreezeTimeout = 100;
const hitInvicibilityTimeout = 800;

const DEAD = "dead";
const IDLE = "idle";

export class Player extends Physics.Arcade.Sprite {
    private xWasHit = false;
    private movementController: PlayerMovementController;
    private shootingController: PlayerShootingController;
    private health = 3;
    private xInvincible = false;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        bullets: Physics.Arcade.Group
    ) {
        super(scene, x, y, "player");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.movementController = new PlayerMovementController(
            this.scene,
            this
        );
        this.setScale(2);
        this.shootingController = new PlayerShootingController(
            this.scene,
            this,
            { x: 10, y: 0 },
            bullets
        );
        this.setCollideWorldBounds(true);
        this.setBounce(2);
        this.animate();
        this.play(IDLE);
    }

    public get wasHit() {
        return this.xWasHit;
    }

    public get invincible() {
        return this.xInvincible;
    }

    public onHit() {
        if (this.xWasHit || this.xInvincible) {
            return;
        }
        this.xWasHit = true;
        this.xInvincible = true;
        this.health--;
        setTimeout(() => {
            this.xWasHit = false;
        }, hitFreezeTimeout);
        setTimeout(() => {
            this.xInvincible = false;
        }, hitInvicibilityTimeout);
    }

    public update() {
        if (this.health === 0) {
            this.die();
        }
        this.movementController.update();
        this.shootingController.update();

        this.setRenderFlip();
    }

    private setRenderFlip() {
        if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        } else if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        }
    }

    private die() {
        this.movementController.disable();
        this.shootingController.disable();
        this.disableBody();
        this.play(DEAD);
    }

    private animate() {
        const deadCfg = {
            key: DEAD,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
                start: 1,
                end: 1,
            }),
            frameRate: 1,
            repeat: -1,
        };
        this.scene.anims.create(deadCfg);
        this.anims.load(DEAD);

        const idleCfg = {
            key: IDLE,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
                start: 0,
                end: 0,
            }),
            frameRate: 1,
            repeat: -1,
        };
        this.scene.anims.create(idleCfg);
        this.anims.load(DEAD);
    }
}
