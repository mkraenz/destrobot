import { Math, Physics, Scene } from "phaser";
import { IPoint } from "../utils/IPoint";
import { Bullet } from "./Bullet";

const Vec = Math.Vector2;
type Vec = Math.Vector2;

export class PlayerShootingController {
    private pos: Vec;
    private dir: Vec;
    private enabled = true;

    constructor(
        private scene: Scene,
        private player: Physics.Arcade.Sprite,
        private playerOffset: IPoint,
        private bullets: Physics.Arcade.Group
    ) {
        this.pos = this.nextPos();
        this.dir = new Vec(1, 0);
        scene.input.on("pointerdown", () => this.shoot());
    }

    public disable() {
        this.enabled = false;
    }

    public update() {
        this.pos = this.nextPos();
    }

    private shoot() {
        if (!this.enabled) {
            return;
        }
        this.dir = this.nextDir();
        const bullet = new Bullet(this.scene, {
            pos: this.pos,
            vel: this.dir,
            speed: 500,
            ttl: 300,
        });
        this.bullets.add(bullet);
        bullet.create();
        console.log(this.bullets.children);
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
