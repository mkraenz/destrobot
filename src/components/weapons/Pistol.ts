import { Weapon } from "./Weapon";

export class Pistol extends Weapon {
    protected speed = 500;
    protected ttl = 300;
    protected damage = 1;
    protected cooldown = 500;
}
