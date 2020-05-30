import { Input, Physics, Scene } from "phaser";
import { IMovableActor } from "./IMovableActor";

type Key = Input.Keyboard.Key;
const DODGE_TIMEOUT = 250;
const DODGE_COOLDOWN = 1000;
const DODGE_SPEED_UP_FACTOR = 2;

export class PlayerMovementController {
    private keys: {
        up: Key;
        left: Key;
        down: Key;
        right: Key;
        dodge: Key;
    };
    private enabled = true;
    private isDodging = false;
    private onDodgeCooldown = false;

    constructor(
        scene: Scene,
        private player: Physics.Arcade.Sprite & IMovableActor,
        private playerVsDangerousThingColliders: Physics.Arcade.Collider[],
        private speed: number
    ) {
        const KeyCodes = Input.Keyboard.KeyCodes;
        const addKey = (key: number | string) =>
            scene.input.keyboard.addKey(key);
        const up = addKey(KeyCodes.W);
        const left = addKey(KeyCodes.A);
        const down = addKey(KeyCodes.S);
        const right = addKey(KeyCodes.D);
        const dodge = addKey(KeyCodes.SPACE);
        this.keys = { up, left, down, right, dodge };
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public getSpeed() {
        return this.speed;
    }

    public disable() {
        this.enabled = false;
    }

    public update() {
        if (this.player.wasHit) {
            return;
        }
        if (!this.enabled) {
            return;
        }
        if (this.isDodging) {
            return;
        }
        const up = this.keys.up;
        const down = this.keys.down;
        const left = this.keys.left;
        const right = this.keys.right;
        const dodge = this.keys.dodge;
        if (up.isDown && down.isUp) {
            this.setVelocityY(-this.speed);
        }
        if (down.isDown && up.isUp) {
            this.setVelocityY(this.speed);
        }
        if (left.isDown && right.isUp) {
            this.setVelocityX(-this.speed);
        }
        if (right.isDown && left.isUp) {
            this.setVelocityX(this.speed);
        }
        if (right.isUp && left.isUp) {
            this.setVelocityX(0);
        }
        if (up.isUp && down.isUp) {
            this.setVelocityY(0);
        }
        this.normalizeSpeed();
        // dodge last so that the direction input gets applied
        if (dodge.isDown && !this.onDodgeCooldown) {
            this.dodge();
            return;
        }
    }

    private normalizeSpeed() {
        const vel = this.player.body.velocity.normalize().scale(this.speed);
        this.player.setVelocity(vel.x, vel.y);
    }

    private dodge() {
        this.isDodging = true;
        this.onDodgeCooldown = true;
        const dodgeVel = this.player.body.velocity.scale(DODGE_SPEED_UP_FACTOR);
        this.player.setVelocity(dodgeVel.x, dodgeVel.y);
        this.playerVsDangerousThingColliders.forEach(c => (c.active = false));
        this.player.setAlpha(0.3);
        const onDodgeFinish = () => {
            this.playerVsDangerousThingColliders.forEach(
                c => (c.active = true)
            );
            this.isDodging = false;
            this.player.clearAlpha();
            setTimeout(() => {
                this.onDodgeCooldown = false;
            }, DODGE_COOLDOWN);
        };
        setTimeout(onDodgeFinish, DODGE_TIMEOUT);
    }

    private setVelocityX(value: number) {
        this.player.setVelocityX(value);
    }

    private setVelocityY(value: number) {
        this.player.setVelocityY(value);
    }
}
