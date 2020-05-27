import { random } from "lodash";
import { Physics, Scene } from "phaser";
import { IDropItemEvent } from "../events/Events";
import { ILevel } from "../levels/ILevel";
import { randomEle } from "../utils/array-utils";
import { IPoint } from "../utils/IPoint";
import { Heart } from "./powerups/Heart";
import { IWeaponDropCfg, WeaponDrop } from "./powerups/WeaponDrop";

export class ItemDropper {
    constructor(
        private scene: Scene,
        private powerups: Physics.Arcade.Group,
        private weaponsData: ILevel["weapons"]
    ) {
        this.scene.events.on("drop-item", (data: IDropItemEvent) => {
            if (this.randomizeType() === "heart") {
                this.spawnHeart(data);
                return;
            }
            const weaponData = this.randomWeaponData();
            this.spawnWeapon({ ...weaponData, ...data });
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

    private randomizeType() {
        return random(1) === 1 ? "weapon" : "heart";
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
