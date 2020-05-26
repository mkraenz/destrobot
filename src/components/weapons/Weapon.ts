import { Physics, Scene } from "phaser";
import { Bullet } from "../Bullet";
import { IWeapon } from "../IWeapon";

interface IWeaponConfig {
    name: string;
    // texture: string; // TODO
    cooldown: number;
    magazine: number;
    reloadTime: number;
}

export class Weapon implements IWeapon {
    public readonly name: string;
    private onCooldown = false;
    private cooldown: number;
    private bulletSpeed: number;
    private ttl: number;
    private damage: number;
    private bulletTexture: string;
    private magazine: number;
    private bulletsLeftInMagazine: number;
    private reloadTime: number;

    constructor(
        private scene: Scene,
        private bullets: Physics.Arcade.Group,
        cfg: IWeaponConfig & {
            bulletSpeed: number;
            damage: number;
            ttl: number;
            bulletTexture: string;
        }
    ) {
        this.cooldown = cfg.cooldown;
        this.bulletSpeed = cfg.bulletSpeed;
        this.ttl = cfg.ttl;
        this.damage = cfg.damage;
        this.name = cfg.name;
        this.bulletTexture = cfg.bulletTexture;
        this.magazine = cfg.magazine;
        this.reloadTime = cfg.reloadTime;
        this.bulletsLeftInMagazine = cfg.magazine;
    }

    public reload() {
        // TODO sounds: reloading
        if (this.onCooldown) {
            return;
        }
        setTimeout(() => {
            this.bulletsLeftInMagazine = this.magazine;
        }, this.reloadTime);
    }

    public fire(pos: Phaser.Math.Vector2, dir: Phaser.Math.Vector2) {
        if (this.onCooldown) {
            return;
        }
        if (this.bulletsLeftInMagazine <= 0) {
            // TODO sounds: empty magazine
            return;
        }
        const bullet = new Bullet(this.scene, {
            pos,
            vel: dir,
            speed: this.bulletSpeed,
            ttl: this.ttl,
            damage: this.damage,
            texture: this.bulletTexture,
        });
        this.bullets.add(bullet);
        bullet.create();

        this.bulletsLeftInMagazine--;
        this.setCooldown();
    }

    private setCooldown() {
        this.onCooldown = true;
        setTimeout(() => {
            this.onCooldown = false;
        }, this.cooldown);
    }
}
