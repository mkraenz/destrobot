import { Physics, Scene } from "phaser";
import { DEV } from "../dev-config";
import { EventType } from "../events/EventType";
import { Color, toHex } from "../styles/Color";
import { IMovableActor } from "./IMovableActor";
import { PlayerShootingController } from "./PlayerShootingController";

const DEAD = "dead";
const IDLE = "idle";

interface IPlayerConfig {
    health: number;
    maxHealth: number;
    hitInvicibilityTimeout: number;
    hitFreezeTimeout: number;
    texture: string;
    x: number;
    y: number;
    scale: number;
    speed: number;
}

interface IPlayerController {
    update(): void;
    disable(): void;
}

export class Player extends Physics.Arcade.Sprite implements IMovableActor {
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
    private movementController?: IPlayerController;
    private shootingController: IPlayerController;
    private health: number;
    private maxHealth: number;

    constructor(scene: Scene, cfg: IPlayerConfig) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.health = cfg.health;
        this.hitInvicibilityTimeout = cfg.hitInvicibilityTimeout;
        this.hitFreezeTimeout = cfg.hitFreezeTimeout;
        this.maxHealth = cfg.maxHealth;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.width - 7, this.height - 7);

        this.setScale(cfg.scale);
        this.shootingController = new PlayerShootingController(
            this.scene,
            this,
            { x: 10, y: 0 }
        );
        this.setCollideWorldBounds(true);
        this.setBounce(2);
        this.animate();
        this.play(IDLE);

        this.scene.events.on(EventType.HeartCollected, () =>
            this.handleHeartCollected()
        );
    }

    public setMovementController(controller: IPlayerController) {
        this.movementController = controller;
    }

    public getHealth() {
        return this.health;
    }

    public getMaxHealth() {
        return this.maxHealth;
    }

    /** @returns true if hit applied, else false */
    public onHit(damage: number): boolean {
        if (this.xWasHit || this.xInvincible) {
            return false;
        }
        this.xWasHit = true;
        this.xInvincible = true;
        this.health -= damage;
        this.scene.sound.play("player-hit");
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
        this.clearTint();
        if (this.wasHit) {
            this.setTint(toHex(Color.Red));
        }
        this.movementController?.update();
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
        if (!this.body.enable) {
            return;
        }
        this.movementController?.disable();
        this.shootingController.disable();
        this.disableBody();
        this.play(DEAD);
        this.scene.sound.play("player-die");
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
