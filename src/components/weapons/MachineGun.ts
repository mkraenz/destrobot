import { Weapon } from "./Weapon";

export class MachineGun extends Weapon {
    protected speed = 500;
    protected ttl = 200;
    protected damage = 1;
    protected cooldown = 100;
}
