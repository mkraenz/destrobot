import { Physics, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { IPowerUp } from "../IPowerUp";

export interface IWeaponDropCfg {
    x: number;
    y: number;
    texture: string;
    scale: number;
    name: string;
}

export class WeaponDrop extends Physics.Arcade.Sprite implements IPowerUp {
    constructor(scene: Scene, private cfg: IWeaponDropCfg) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.name = cfg.name;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    public onCollide(): void {
        this.scene.events.emit(EventType.WeaponPickedUp, {
            weaponName: this.name,
        });
        this.destroy();
    }
}
