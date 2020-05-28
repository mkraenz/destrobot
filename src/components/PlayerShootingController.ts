import { Math, Physics, Scene } from "phaser";
import { EventType } from "../events/EventType";
import { IPoint } from "../utils/IPoint";
import { IWeapon } from "./IWeapon";

const Vec = Math.Vector2;
type Vec = Math.Vector2;

export class PlayerShootingController {
    private pos: Vec;
    private dir: Vec;
    private enabled = true;
    private leftIsDown = false;

    constructor(
        private scene: Scene,
        private player: Physics.Arcade.Sprite,
        private playerOffset: IPoint,
        private weapon?: IWeapon
    ) {
        this.pos = this.nextPos();
        this.dir = new Vec(1, 0);

        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.reload(); // only reload once, but allow shooting by holding
            } else {
                this.leftIsDown = true;
            }
        });
        scene.input.on("pointerup", () => (this.leftIsDown = false));

        this.scene.events.on(
            EventType.WeaponChanged,
            (data: { weapon: IWeapon }) => this.setWeapon(data.weapon)
        );
    }

    public disable() {
        this.enabled = false;
    }

    public update() {
        this.pos = this.nextPos();
        if (this.leftIsDown) {
            this.shoot();
        }
    }

    public setWeapon(weapon: IWeapon) {
        this.weapon = weapon;
    }

    private shoot() {
        if (!this.enabled || !this.weapon) {
            return;
        }
        this.dir = this.nextDir();
        this.weapon.fire(this.pos, this.dir);
    }

    private reload() {
        if (!this.enabled || !this.weapon) {
            return;
        }
        this.weapon.reload();
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
