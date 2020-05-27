import { Physics, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { IPowerUp } from "../IPowerUp";

const DISAPPEAR_TIMEOUT = 10000;

export interface IWeaponDropCfg {
    x: number;
    y: number;
    texture: string;
    name: string;
    pickUpScale: number;
}

export class WeaponDrop extends Physics.Arcade.Sprite implements IPowerUp {
    constructor(scene: Scene, private cfg: IWeaponDropCfg) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.name = cfg.name;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(cfg.pickUpScale);

        setTimeout(() => this.destroy(), DISAPPEAR_TIMEOUT);
    }

    public onCollide(): void {
        this.scene.sound.play("weapon-loaded");
        this.scene.events.emit(EventType.WeaponPickedUp, {
            weaponName: this.name,
        });
        this.destroy();
    }
}
