import { Physics, Scene } from "phaser";
import { IWeaponPickedUpEvent } from "../events/Events";
import { EventType } from "../events/EventType";
import { ILevel } from "../levels/ILevel";
import { Weapon } from "./weapons/Weapon";

export class WeaponPickUpHandler {
    constructor(
        private scene: Scene,
        weaponsData: ILevel["weapons"],
        bullets: Physics.Arcade.Group
    ) {
        scene.events.on(
            EventType.WeaponPickedUp,
            ({ weaponName }: IWeaponPickedUpEvent) => {
                const weaponData = weaponsData.find(w => w.name === weaponName);
                if (!weaponData) {
                    throw new Error(
                        `Missing weapon in level data: ${weaponName}`
                    );
                }
                const weapon = new Weapon(scene, bullets, weaponData);
                scene.events.emit(EventType.WeaponChanged, { weapon });
            }
        );
    }
}
