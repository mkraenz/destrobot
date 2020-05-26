import { assign } from "lodash";
import { Physics, Scene } from "phaser";
import { Bullet } from "../components/Bullet";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { IPowerUp } from "../components/IPowerUp";
import { ItemDropper } from "../components/ItemDropper";
import { Player } from "../components/Player";
import { WeaponPickUpHandler } from "../components/WeaponPickUpHandler";
import { Level1 } from "../levels/Level1";
import { HealthHud } from "./hud/HealthHud";
import { MagazineHud } from "./hud/MagazineHud";
import { ScoreHud } from "./hud/ScoreHud";

type Group = Physics.Arcade.Group;

const FADE_IN_TIME = 0;
const CAMERA_SHAKE_INTENSITY = 0.005;
const CAMERA_SHAKE_DURATION = 50;

export class MainScene extends Scene {
    private levelData!: typeof Level1;
    private player!: Player;
    private enemies!: Group;
    private playerBullets!: Group;
    private powerups!: Group;

    constructor() {
        super({ key: "MainScene" });
    }

    public init(level: typeof Level1) {
        this.levelData = level;
    }

    public create(): void {
        const lvl = this.levelData;
        const map = this.make.tilemap({ key: lvl.map.key });
        const tileset = map.addTilesetImage(
            lvl.map.tilesetName,
            lvl.map.tilesetKey
        );
        const mapLayers = lvl.map.layers.map(layerData => {
            const mapLayer = map.createStaticLayer(
                layerData.layerID,
                tileset,
                0,
                0
            );
            return assign(mapLayer, layerData);
        });

        this.playerBullets = this.physics.add.group([], {
            enable: true,
            active: true,
        });

        const weaponData = this.levelData.weapons.find(
            w => w.name === lvl.player.startWeapon
        );
        if (!weaponData) {
            throw new Error(
                `Could not parse level weaponData for startWeapon ${lvl.player.startWeapon}`
            );
        }
        this.player = new Player(this, { ...lvl.player });
        new WeaponPickUpHandler(this, lvl, this.playerBullets);

        this.createCamera(map);
        this.cameras.main.fadeIn(FADE_IN_TIME);
        this.cameras.main.once("camerafadeincomplete", () => this.addHud());

        this.enemies = this.physics.add.group([], {
            active: true,
            enable: true,
            bounceX: 10,
            bounceY: 10,
            collideWorldBounds: true,
        });

        lvl.spawners.forEach(({ x, y, enemiesPerWave, waveTimeout, type }) => {
            const spawnedEnemyData = lvl.enemies.find(e => e.name === type);
            if (!spawnedEnemyData) {
                throw new Error(
                    `Could not parse level spawnedEnemyData for type ${type}`
                );
            }
            const spawner = new EnemySpawner(
                this,
                { x, y },
                this.player,
                this.enemies,
                spawnedEnemyData
            );
            spawner.spawnInterval(enemiesPerWave, waveTimeout);
        });

        this.physics.add.collider(
            this.player,
            this.enemies,
            (player, enemy) => {
                const hitApplied = this.player.onHit();
                if (hitApplied) {
                    this.cameras.main.shake(
                        CAMERA_SHAKE_DURATION,
                        CAMERA_SHAKE_INTENSITY
                    );
                }
            }
        );
        this.physics.add.collider(this.enemies, undefined as any);
        this.physics.add.collider(
            this.enemies,
            this.playerBullets,
            (enemy, bullet) => {
                const b = bullet as Bullet;
                b.onHit();
                (enemy as Enemy).takeDamage(b.damage);
                this.playerBullets.remove(b, true, true);
            }
        );
        mapLayers.forEach(layer => {
            if (layer.collideEnemies) {
                this.physics.add.collider(this.enemies, layer);
            }
            if (layer.collidePlayer) {
                this.physics.add.collider(this.player, layer);
            }
            if (layer.collideBullets) {
                this.physics.add.collider(this.playerBullets, layer, bullet =>
                    this.playerBullets.remove(bullet, true, true)
                );
            }
            if (layer.collisionProperty) {
                layer.setCollisionByProperty({
                    [layer.collisionProperty]: true,
                });
            }
        });

        const powerups = this.physics.add.group([], {
            active: true,
            enable: true,
        });
        this.physics.add.collider(this.player, powerups, (player, powerup) => {
            ((powerup as unknown) as IPowerUp).onCollide();
        });
        const itemDropper = new ItemDropper(this, powerups);
        itemDropper.spawnHeart({
            x: this.player.x + 300,
            y: this.player.y,
        });
        itemDropper.spawnWeapon({
            x: this.player.x + 100,
            y: this.player.y,
            name: "Pistol",
            texture: "pistol",
            scale: 1,
        });

        itemDropper.spawnWeapon({
            x: this.player.x + 500,
            y: this.player.y,
            name: "Sniper Rifle",
            texture: "sniper-rifle",
            scale: 1,
        });
    }

    public update() {
        this.player.update();
        const enemies = this.enemies.getChildren();
        enemies.forEach(x => x.update());
        const inactiveEnemies = enemies.filter(e => !e.active);
        inactiveEnemies.forEach(e => {
            this.enemies.remove(e, true, true);
        });
    }

    private createCamera(map: Phaser.Tilemaps.Tilemap) {
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.setDeadzone(100, 75);
        this.cameras.main.startFollow(this.player);
    }

    private addHud() {
        this.scene.add("HealthHud", HealthHud, true, {
            player: this.player,
        });
        this.scene.add("ScoreHud", ScoreHud, true);
        this.scene.add("MagazineHud", MagazineHud, true);
    }
}
