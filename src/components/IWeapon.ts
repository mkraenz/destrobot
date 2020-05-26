import { Math } from "phaser";

export interface IWeapon {
    shoot(pos: Math.Vector2, dir: Math.Vector2): void;
    reload(): void;
}
