import { Physics, Scene } from "phaser";
import { Bullet } from "../Bullet";
import { IWeapon } from "../IWeapon";

export class Weapon implements IWeapon {
    private onCooldown = false;
    private cooldown: number;
    private bulletSpeed: number;
    private ttl: number;
    private damage: number;
    private name: string;

    constructor(
        private scene: Scene,
        private bullets: Physics.Arcade.Group,
        cfg: {
            cooldown: number;
            bulletSpeed: number;
            ttl: number;
            damage: number;
            name: string;
        }
    ) {
        this.cooldown = cfg.cooldown;
        this.bulletSpeed = cfg.bulletSpeed;
        this.ttl = cfg.ttl;
        this.damage = cfg.damage;
        this.name = cfg.name;
    }

    public shoot(pos: Phaser.Math.Vector2, dir: Phaser.Math.Vector2) {
        if (this.onCooldown) {
            return;
        }
        const bullet = new Bullet(this.scene, {
            pos,
            vel: dir,
            speed: this.bulletSpeed,
            ttl: this.ttl,
            damage: this.damage,
        });
        this.bullets.add(bullet);
        bullet.create();

        this.setCooldown();
    }

    private setCooldown() {
        this.onCooldown = true;
        setTimeout(() => {
            this.onCooldown = false;
        }, this.cooldown);
    }
}
