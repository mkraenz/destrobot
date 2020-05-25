import { Math, Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { IWeapon } from "./IWeapon";

const Vec = Math.Vector2;
type Vec = Math.Vector2;

export class PlayerShootingController {
    private pos: Vec;
    private dir: Vec;
    private enabled = true;
    private isDown = false;

    constructor(
        private scene: Scene,
        private player: Physics.Arcade.Sprite,
        private playerOffset: IPoint,
        private weapon: IWeapon
    ) {
        this.pos = this.nextPos();
        this.dir = new Vec(1, 0);
        scene.input.on("pointerdown", () => (this.isDown = true));
        scene.input.on("pointerup", () => (this.isDown = false));
    }

    public disable() {
        this.enabled = false;
    }

    public update() {
        this.pos = this.nextPos();
        if (this.isDown) {
            this.shoot();
        }
    }

    private shoot() {
        if (!this.enabled) {
            return;
        }
        this.dir = this.nextDir();
        this.weapon.shoot(this.pos, this.dir);
    }

    private nextPos() {
        return new Vec(
            this.player.x + this.playerOffset.x,
            this.player.y + this.playerOffset.y
        );
    }

    private nextDir() {
        const mouse = this.scene.input.mousePointer;
        const clickedWorldPoint = this.scene.cameras.main.getWorldPoint(
            mouse.x,
            mouse.y
        );
        return new Vec(
            clickedWorldPoint.x - this.pos.x,
            clickedWorldPoint.y - this.pos.y
        );
    }
}
