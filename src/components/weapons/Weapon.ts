import { Physics, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { gOptions } from "../../gOptions";
import { Bullet } from "../Bullet";
import { IWeapon } from "../IWeapon";

interface IWeaponOnlyConfig {
    name: string;
    texture: string;
    cooldown: number;
    magazine: number;
    reloadTime: number;
    fireSoundKey: string;
}

export type IWeaponConfig = IWeaponOnlyConfig & {
    bulletSpeed: number;
    damage: number;
    ttl: number;
    bulletTexture: string;
};

const RELOAD_SOUND_LENGTH = 350;
const WEAPON_EMPTY_SOUND_TIMEOUT = 150;

export class Weapon implements IWeapon {
    public readonly name: string;
    public readonly texture: string;
    private onCooldown = false;
    private reloading = false;
    private reloadTimers: number[] = [];

    private cooldown: number;
    private bulletSpeed: number;
    private ttl: number;
    private damage: number;
    private bulletTexture: string;
    private magazine: number;
    private bulletsLeftInMagazine: number;
    private reloadTime: number;
    private fireSoundKey: string;
    private isEnemyWeapon: boolean;

    constructor(
        private scene: Scene,
        private bullets: Physics.Arcade.Group,
        cfg: IWeaponConfig & { isEnemyWeapon?: boolean }
    ) {
        this.texture = cfg.texture;
        this.cooldown = cfg.cooldown;
        this.bulletSpeed = cfg.bulletSpeed;
        this.ttl = cfg.ttl;
        this.damage = cfg.damage;
        this.name = cfg.name;
        this.bulletTexture = cfg.bulletTexture;
        this.magazine = cfg.magazine;
        this.reloadTime = cfg.reloadTime;
        this.bulletsLeftInMagazine = cfg.magazine;
        this.fireSoundKey = cfg.fireSoundKey;
        this.isEnemyWeapon = !!cfg.isEnemyWeapon;

        this.scene.events.on(EventType.AmmoCollected, () =>
            this.instantReload(true)
        );
    }

    public getBulletsLeft() {
        return this.bulletsLeftInMagazine;
    }

    public reload() {
        if (this.bulletsLeftInMagazine === this.magazine) {
            return;
        }
        this.reloading = true;
        // explicitely use window for typescript type
        const reloadSoundTimer = window.setTimeout(
            () => this.playSfxSoundIfPlayer("weapon-loaded"),
            this.reloadTime - RELOAD_SOUND_LENGTH
        );
        const reloadTimer = window.setTimeout(
            () => this.instantReload(),
            this.reloadTime
        );
        this.reloadTimers.push(reloadTimer, reloadSoundTimer);
    }

    public fire(pos: Phaser.Math.Vector2, dir: Phaser.Math.Vector2) {
        if (this.onCooldown || this.reloading) {
            return;
        }
        if (this.bulletsLeftInMagazine <= 0) {
            this.playSfxSoundIfPlayer("empty-magazine");
            this.setCooldown();
            return;
        }
        this.playSfxSoundIfPlayer(this.fireSoundKey, {
            volume: 0.8,
        });
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
        if (!this.isEnemyWeapon) {
            this.scene.events.emit(EventType.WeaponFired);
        }
        this.setCooldown();
        if (this.bulletsLeftInMagazine === 0) {
            setTimeout(
                () => this.playSfxSoundIfPlayer("weapon-last-bullet-shot"),
                WEAPON_EMPTY_SOUND_TIMEOUT
            );
        }
    }

    private instantReload(playReload = false) {
        this.reloading = false;
        this.bulletsLeftInMagazine = this.magazine;
        if (!this.isEnemyWeapon) {
            this.scene.events.emit(EventType.WeaponReloaded);
        }
        this.reloadTimers.forEach(timer => clearTimeout(timer));
        this.reloadTimers = [];
        if (playReload) {
            // used for ammo pickup
            this.playSfxSoundIfPlayer("weapon-loaded");
        }
    }

    private playSfxSoundIfPlayer(
        key: string,
        extra: Phaser.Types.Sound.SoundConfig = {}
    ) {
        if (!this.isEnemyWeapon) {
            const baseVol = extra.volume || 1;
            const volume = baseVol * gOptions.sfxVolume;
            this.scene.sound.play(key, { ...extra, volume });
        }
    }

    private setCooldown() {
        this.onCooldown = true;
        setTimeout(() => {
            this.onCooldown = false;
        }, this.cooldown);
    }
}
