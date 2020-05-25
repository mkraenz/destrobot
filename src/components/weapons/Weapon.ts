import { Physics, Scene } from "phaser";
import { Bullet } from "../Bullet";
import { IWeapon } from "../IWeapon";

export abstract class Weapon implements IWeapon {
    protected onCooldown = false;
    protected abstract cooldown: number;
    protected abstract speed: number;
    protected abstract ttl: number;
    protected abstract damage: number;

    constructor(
        protected scene: Scene,
        protected bullets: Physics.Arcade.Group
    ) {}

    public shoot(pos: Phaser.Math.Vector2, dir: Phaser.Math.Vector2) {
        if (this.onCooldown) {
            return;
        }
        const bullet = new Bullet(this.scene, {
            pos,
            vel: dir,
            speed: 500,
            ttl: 300,
            damage: 1,
        });
        this.bullets.add(bullet);
        bullet.create();

        this.setCooldown();
    }

    protected setCooldown() {
        this.onCooldown = true;
        setTimeout(() => {
            this.onCooldown = false;
        }, this.cooldown);
    }
}
