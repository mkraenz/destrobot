import { assign } from "lodash";
import { Physics, Scene } from "phaser";
import { Bullet } from "../components/Bullet";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { IPowerUp } from "../components/IPowerUp";
import { ItemDropper } from "../components/ItemDropper";
import { Player } from "../components/Player";
import { PlayerLevelController } from "../components/PlayerLevelController";
import { PlayerMovementController } from "../components/PlayerMovementController";
import { WeaponPickUpHandler } from "../components/WeaponPickUpHandler";
import { ILevel } from "../levels/ILevel";
import { HealthHud } from "./hud/HealthHud";
import { ScoreHud } from "./hud/ScoreHud";
import { WeaponHud } from "./hud/WeaponHud";

type Group = Physics.Arcade.Group;

const FADE_IN_TIME = 0;
const CAMERA_SHAKE_INTENSITY = 0.005;
const CAMERA_SHAKE_DURATION = 50;

export class MainScene extends Scene {
    private levelData!: ILevel;
    private player!: Player;
    private enemies!: Group;
    private playerBullets!: Group;

    constructor() {
        super({ key: "MainScene" });
    }

    public init(level: ILevel) {
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
        this.player = new Player(this, { ...lvl.player });
        new WeaponPickUpHandler(this, lvl.weapons, this.playerBullets);

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

        lvl.spawners.forEach(({ x, y, type, ...rest }) => {
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
                spawnedEnemyData,
                rest.maxConcurrentEnemies
            );
            spawner.spawnInterval(rest.enemiesPerWave, rest.waveTimeout);
        });

        const playerVsEnemyCollider = this.physics.add.collider(
            this.player,
            this.enemies,
            (player, e) => {
                const enemy = e as Enemy;
                const hitApplied = this.player.onHit(enemy.damage);
                if (hitApplied) {
                    this.cameras.main.shake(
                        CAMERA_SHAKE_DURATION,
                        CAMERA_SHAKE_INTENSITY
                    );
                }
            }
        );
        const movementController = new PlayerMovementController(
            this,
            this.player,
            playerVsEnemyCollider,
            lvl.player.speed
        );
        new PlayerLevelController(this, movementController);
        this.player.setMovementController(movementController);

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
        const itemDropper = new ItemDropper(
            this,
            powerups,
            this.levelData.weapons
        );
        this.sound.play("fight_music", { loop: true, volume: 0.1 });

        // test pickUps
        itemDropper.spawnHeart({
            x: this.player.x + 300,
            y: this.player.y - 100,
        });
        lvl.weapons.forEach((weapon, i) => {
            itemDropper.spawnWeapon({
                x: this.player.x + 100 + i * 100,
                y: this.player.y,
                name: weapon.name,
                texture: weapon.texture,
                pickUpScale: weapon.pickUpScale,
            });
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
        this.scene.add("MagazineHud", WeaponHud, true);
    }
}
