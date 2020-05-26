import { Physics, Scene } from "phaser";
import { DEV } from "../dev-config";
import { Color, toHex } from "../styles/Color";
import { IWeapon } from "./IWeapon";
import { PlayerLevelController } from "./PlayerLevelController";
import { PlayerMovementController } from "./PlayerMovementController";
import { PlayerShootingController } from "./PlayerShootingController";

const DEAD = "dead";
const IDLE = "idle";

interface IPlayerController {
    update(): void;
    disable(): void;
}

export class Player extends Physics.Arcade.Sprite {
    public get wasHit() {
        return this.xWasHit;
    }

    public get invincible() {
        return this.xInvincible;
    }
    private xWasHit = false;
    private xInvincible = false;
    private hitInvicibilityTimeout: number;
    private hitFreezeTimeout: number;
    private movementController: IPlayerController;
    private shootingController: IPlayerController;
    private health: number;
    private maxHealth: number;

    constructor(
        scene: Scene,
        cfg: {
            health: number;
            maxHealth: number;
            hitInvicibilityTimeout: number;
            hitFreezeTimeout: number;
            texture: string;
            x: number;
            y: number;
            weapon: IWeapon;
            scale: number;
        }
    ) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.health = cfg.health;
        this.hitInvicibilityTimeout = cfg.hitInvicibilityTimeout;
        this.hitFreezeTimeout = cfg.hitFreezeTimeout;
        this.maxHealth = cfg.maxHealth;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const movementController = new PlayerMovementController(
            this.scene,
            this
        );
        this.movementController = movementController;
        this.setScale(cfg.scale);
        this.shootingController = new PlayerShootingController(
            this.scene,
            this,
            { x: 10, y: 0 },
            cfg.weapon
        );
        new PlayerLevelController(this.scene, movementController);
        this.setCollideWorldBounds(true);
        this.setBounce(2);
        this.animate();
        this.play(IDLE);

        this.scene.events.on("heart-collected", () =>
            this.handleHeartCollected()
        );
    }

    public getHealth() {
        return this.health;
    }

    public getMaxHealth() {
        return this.maxHealth;
    }

    /** @returns true if hit applied, else false */
    public onHit(): boolean {
        if (this.xWasHit || this.xInvincible) {
            return false;
        }
        this.xWasHit = true;
        this.xInvincible = true;
        this.health--;
        setTimeout(() => {
            this.xWasHit = false;
        }, this.hitFreezeTimeout);
        setTimeout(() => {
            this.xInvincible = false;
        }, this.hitInvicibilityTimeout);
        return true;
    }

    public update() {
        if (this.health === 0) {
            this.die();
        }
        if (this.wasHit) {
            this.setTint(toHex(Color.Red));
        } else {
            this.clearTint();
        }
        this.movementController.update();
        this.shootingController.update();

        this.setRenderFlip();
    }

    private handleHeartCollected() {
        if (this.health < this.maxHealth) {
            this.health++;
        }
    }

    private setRenderFlip() {
        if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        } else if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        }
    }

    private die() {
        if (DEV.playerInvicible) {
            return;
        }
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
