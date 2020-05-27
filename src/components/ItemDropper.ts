import { random } from "lodash";
import { Physics, Scene } from "phaser";
import { IDropItemEvent } from "../events/Events";
import { ILevel } from "../levels/ILevel";
import { randomEle } from "../utils/array-utils";
import { IPoint } from "../utils/IPoint";
import { Ammo } from "./powerups/Ammo";
import { Heart } from "./powerups/Heart";
import { IWeaponDropCfg, WeaponDrop } from "./powerups/WeaponDrop";

export class ItemDropper {
    constructor(
        private scene: Scene,
        private powerups: Physics.Arcade.Group,
        private weaponsData: ILevel["weapons"]
    ) {
        this.scene.events.on("drop-item", (data: IDropItemEvent) => {
            this.dropRandomItem(data);
        });
    }

    public spawnWeapon(cfg: IWeaponDropCfg) {
        const weaponDrop = new WeaponDrop(this.scene, cfg);
        this.powerups.add(weaponDrop);
    }

    public spawnHeart(at: IPoint) {
        const heart = new Heart(this.scene, at.x, at.y);
        this.powerups.add(heart);
    }

    public spawnAmmo(at: IPoint) {
        const ammo = new Ammo(this.scene, at.x, at.y);
        this.powerups.add(ammo);
    }

    private dropRandomItem(data: IDropItemEvent) {
        const type = this.randomizeType();
        switch (type) {
            case "ammo":
                this.spawnAmmo(data);
                break;
            case "heart":
                this.spawnHeart(data);
                break;
            case "weapon":
                const weaponData = this.randomWeaponData();
                this.spawnWeapon({ ...weaponData, ...data });
                break;
        }
    }

    private randomizeType() {
        const randomInt = random(3);
        switch (randomInt) {
            case 0:
                return "weapon";
            case 1:
                return "heart";
            case 2:
                return "ammo";
            default:
                return "ammo";
        }
    }

    private randomWeaponData() {
        const weaponData = randomEle(this.weaponsData);
        if (!weaponData) {
            throw new Error(
                "Level data weapons are empty but should contain at least 1 element"
            );
        }
        return weaponData;
    }
}
