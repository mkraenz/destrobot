import { Input, Math, Physics, Scene } from "phaser";
import { IWeaponChangedEvent } from "../events/Events";
import { EventType } from "../events/EventType";
import { IPoint } from "../utils/IPoint";
import { IWeapon } from "./IWeapon";
import { IWeaponSpriteCfg, WeaponSprite } from "./weapons/WeaponSprite";

const Vec = Math.Vector2;
type Vec = Math.Vector2;

// rename PlayerWeaponController
export class PlayerShootingController {
    private pos: Vec;
    private dir: Vec;
    private enabled = true;
    private leftIsDown = false;
    private weapon?: IWeapon;
    private weaponSprite?: WeaponSprite;

    constructor(
        private scene: Scene,
        private player: Physics.Arcade.Sprite,
        private playerOffset: IPoint
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

        const KeyCodes = Input.Keyboard.KeyCodes;
        const addKey = (key: number | string) =>
            scene.input.keyboard.addKey(key);
        const reloadKey = addKey(KeyCodes.R);
        reloadKey.on("down", () => this.reload());
        this.scene.events.on(
            EventType.WeaponChanged,
            (data: IWeaponChangedEvent) =>
                this.setWeapon(data.weapon, data.weaponData)
        );
    }

    public disable() {
        this.enabled = false;
    }

    public update() {
        this.pos = this.nextPos();
        this.weaponSprite?.setPosition(this.player.x, this.player.y);
        this.weaponSprite?.setVelocity(
            this.player.body.velocity.x,
            this.player.body.velocity.y
        );
        if (this.leftIsDown) {
            this.shoot();
        }
    }

    private setWeapon(
        weapon: IWeapon,
        weaponSpriteData: Omit<IWeaponSpriteCfg, "x" | "y">
    ) {
        this.weapon = weapon;
        this.weaponSprite?.destroy();
        const spriteCfg = {
            ...weaponSpriteData,
            x: this.player.x,
            y: this.player.y,
        };
        this.weaponSprite = new WeaponSprite(this.scene, spriteCfg);
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
        return clickedWorldPoint.subtract(this.pos);
    }
}
