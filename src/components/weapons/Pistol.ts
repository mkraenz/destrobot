import { Weapon } from "./Weapon";

export class Pistol extends Weapon {
    protected bulletSpeed = 500;
    protected ttl = 300;
    protected damage = 2;
    protected cooldown = 500;
}
