import { Physics, Scene } from "phaser";
import { IDropItemEvent } from "../events/Events";
import { IPoint } from "../utils/IPoint";
import { Heart } from "./powerups/Heart";
import { IWeaponDropCfg, WeaponDrop } from "./powerups/WeaponDrop";

export class ItemDropper {
    constructor(private scene: Scene, private powerups: Physics.Arcade.Group) {
        this.scene.events.on("drop-item", (data: IDropItemEvent) =>
            this.spawnHeart(data)
        );
    }

    public spawnWeapon(cfg: IWeaponDropCfg) {
        const weaponDrop = new WeaponDrop(this.scene, cfg);
        this.powerups.add(weaponDrop);
    }

    public spawnHeart(at: IPoint) {
        const heart = new Heart(this.scene, at.x, at.y);
        this.powerups.add(heart);
    }
}
