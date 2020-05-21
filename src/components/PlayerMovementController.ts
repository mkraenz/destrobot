import { Input, Physics, Scene } from "phaser";

type Key = Input.Keyboard.Key;

export class PlayerMovementController {
    private keys: {
        up: Key;
        left: Key;
        down: Key;
        right: Key;
    };
    private enabled = true;
    private speed = 200;

    constructor(
        scene: Scene,
        private player: Physics.Arcade.Sprite & { wasHit: boolean }
    ) {
        const KeyCodes = Input.Keyboard.KeyCodes;
        const addKey = (key: number | string) =>
            scene.input.keyboard.addKey(key);
        const up = addKey(KeyCodes.W);
        const left = addKey(KeyCodes.A);
        const down = addKey(KeyCodes.S);
        const right = addKey(KeyCodes.D);
        this.keys = { up, left, down, right };
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
        const up = this.keys.up;
        const down = this.keys.down;
        const left = this.keys.left;
        const right = this.keys.right;
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
    }

    private setVelocityX(value: number) {
        this.player.setVelocityX(value);
    }

    private setVelocityY(value: number) {
        this.player.setVelocityY(value);
    }
}
