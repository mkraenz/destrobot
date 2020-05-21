import { Physics, Scene } from "phaser";
import { Bullet } from "../components/Bullet";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { Player } from "../components/Player";
import { HealthHud } from "./hud/HealthHud";
import { ScoreHud } from "./hud/ScoreHud";

const FADE_IN_TIME = 0;

export class MainScene extends Scene {
    private player!: Player;
    private enemies!: Physics.Arcade.Sprite[];
    private playerBullets!: Physics.Arcade.Group;

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("scifi-tileset", "tiles");
        map.createStaticLayer("ground", tileset, 0, 0);
        const walls = map.createStaticLayer("walls", tileset, 0, 0);

        this.playerBullets = this.physics.add.group();
        this.player = new Player(this, 400, 400, this.playerBullets);

        this.createCamera(map);
        this.cameras.main.fadeIn(FADE_IN_TIME);
        this.cameras.main.once("camerafadeincomplete", () => this.addHud());

        const spawner = new EnemySpawner(
            this,
            { x: 250, y: 1275 },
            this.player
        );
        const spawner2 = new EnemySpawner(
            this,
            { x: 1250, y: 600 },
            this.player
        );
        const spawner3 = new EnemySpawner(
            this,
            { x: 1370, y: 1300 },
            this.player
        );
        this.enemies = spawner.spawn(10);
        const enemyGroup = this.physics.add.group(this.enemies);
        this.physics.add.collider(this.player, enemyGroup, (player, enemy) =>
            this.player.onHit()
        );
        this.physics.add.collider(enemyGroup, undefined as any);
        this.physics.add.collider(
            enemyGroup,
            this.playerBullets,
            (enemy, bullet) => {
                const b = bullet as Bullet;
                b.setHit();
                (enemy as Enemy).getHit(b.damage);
            }
        );
        this.physics.add.collider(enemyGroup, walls);
        this.physics.add.collider(this.player, walls);
        walls.setCollisionByProperty({ blocking: true }); // set as custom property in tiled

        spawner.spawnInterval(5, 3000, enemyGroup, e => this.enemies.push(e));
        spawner2.spawnInterval(5, 3000, enemyGroup, e => this.enemies.push(e));
        spawner3.spawnInterval(5, 3000, enemyGroup, e => this.enemies.push(e));
    }

    public update() {
        this.player.update();
        this.enemies.forEach(x => x.update());
        const inactiveEnemies = this.enemies.filter(e => !e.active);
        inactiveEnemies.forEach(e => e.destroy());
        this.enemies.splice(
            0,
            this.enemies.length,
            ...this.enemies.filter(e => e.active)
        );
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
