import { assign } from "lodash";
import { Physics, Scene } from "phaser";
import { Bullet } from "../components/Bullet";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { IPowerUp } from "../components/IPowerUp";
import { ItemDropper } from "../components/ItemDropper";
import { Player } from "../components/Player";
import { Weapon } from "../components/weapons/Weapon";
import { Level1 } from "../levels/Level1";
import { HealthHud } from "./hud/HealthHud";
import { ScoreHud } from "./hud/ScoreHud";

type Group = Physics.Arcade.Group;

const FADE_IN_TIME = 0;

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
            throw new Error("Could not parse level");
        }
        const mg = new Weapon(this, this.playerBullets, weaponData);
        this.player = new Player(this, { ...lvl.player, weapon: mg });

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

        const spawner = new EnemySpawner(
            this,
            { x: 250, y: 1275 },
            this.player,
            this.enemies
        );
        const spawner2 = new EnemySpawner(
            this,
            { x: 1250, y: 600 },
            this.player,
            this.enemies
        );
        const spawner3 = new EnemySpawner(
            this,
            { x: 1370, y: 1300 },
            this.player,
            this.enemies
        );

        this.physics.add.collider(this.player, this.enemies, (player, enemy) =>
            this.player.onHit()
        );
        this.physics.add.collider(this.enemies, undefined as any);
        this.physics.add.collider(
            this.enemies,
            this.playerBullets,
            (enemy, bullet) => {
                const b = bullet as Bullet;
                b.setHit();
                (enemy as Enemy).getHit(b.damage);
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
                this.physics.add.collider(this.playerBullets, layer);
            }
            if (layer.collisionProperty) {
                layer.setCollisionByProperty({
                    [layer.collisionProperty]: true,
                });
            }
        });

        spawner.spawnInterval(5, 3000);
        spawner2.spawnInterval(5, 3000);
        spawner3.spawnInterval(5, 3000);

        const powerups = this.physics.add.group([], {
            active: true,
            enable: true,
        });
        this.physics.add.collider(this.player, powerups, (player, powerup) => {
            ((powerup as unknown) as IPowerUp).onCollide();
        });
        new ItemDropper(this, powerups);
        this.events.emit("drop-item", {
            x: this.player.x + 100,
            y: this.player.y,
        });
        this.events.emit("drop-item", {
            x: this.player.x + 200,
            y: this.player.y,
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
    }
}
