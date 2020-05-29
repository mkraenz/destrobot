import { Weapon } from "../components/weapons/Weapon";
import { ILevel } from "../levels/ILevel";
import { Unpack } from "../utils/ts";

export interface IDropItemEvent {
    x: number;
    y: number;
}

export interface IWeaponPickedUpEvent {
    weaponName: string;
}

export interface IEnemyKilledEvent {
    name: string;
    score: number;
}

export interface IWeaponChangedEvent {
    weapon: Weapon;
    weaponData: Unpack<ILevel["weapons"]>;
}
