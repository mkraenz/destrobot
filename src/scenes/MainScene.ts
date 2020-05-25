import { Physics, Scene } from "phaser";
import { Bullet } from "../components/Bullet";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { IPowerUp } from "../components/IPowerUp";
import { ItemDropper } from "../components/ItemDropper";
import { Player } from "../components/Player";
import { MachineGun } from "../components/weapons/MachineGun";
import { HealthHud } from "./hud/HealthHud";
import { ScoreHud } from "./hud/ScoreHud";

type Group = Physics.Arcade.Group;

const FADE_IN_TIME = 0;

export class MainScene extends Scene {
    private player!: Player;
    private enemies!: Group;
    private playerBullets!: Group;
    private powerups!: Group;

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("scifi-tileset", "tiles");
        map.createStaticLayer("ground", tileset, 0, 0);
        const walls = map.createStaticLayer("walls", tileset, 0, 0);

        this.playerBullets = this.physics.add.group([], {
            enable: true,
            active: true,
        });
        const mg = new MachineGun(this, this.playerBullets);
        this.player = new Player(this, 400, 400, mg);

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
        this.physics.add.collider(this.enemies, walls);
        this.physics.add.collider(this.player, walls);
        walls.setCollisionByProperty({ blocking: true }); // set as custom property in tiled

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
