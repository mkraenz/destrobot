import { Input, Physics, Scene } from "phaser";

type Key = Input.Keyboard.Key;

const SPEED = 200;

export class PlayerMovementController {
    private keys: {
        up: Key;
        left: Key;
        down: Key;
        right: Key;
    };
    private enabled = true;

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
            this.setVelocityY(-SPEED);
        }
        if (down.isDown && up.isUp) {
            this.setVelocityY(SPEED);
        }
        if (left.isDown && right.isUp) {
            this.setVelocityX(-SPEED);
        }
        if (right.isDown && left.isUp) {
            this.setVelocityX(SPEED);
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
