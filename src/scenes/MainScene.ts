import { Physics, Scene } from "phaser";
import { Enemy } from "../components/Enemy";
import { EnemySpawner } from "../components/EnemySpawner";
import { Player } from "../components/Player";

const FADE_IN_TIME = 0;

export class MainScene extends Scene {
    private player!: Player;
    private enemies!: Enemy[];
    private playerBullets!: Physics.Arcade.Group;

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        const world = this.add.image(0, 0, "world").setOrigin(0);

        this.cameras.main.setZoom(2.5);
        this.cameras.main.setBounds(0, 0, world.width, world.height);
        this.cameras.main.setDeadzone(100, 75);

        this.playerBullets = this.physics.add.group();
        this.player = new Player(this, 100, 100, this.playerBullets);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.fadeIn(FADE_IN_TIME);
        this.cameras.main.once("camerafadeincomplete", () => this.addHud());

        const spawner = new EnemySpawner(this, { x: 300, y: 300 }, this.player);
        this.enemies = spawner.spawn(10);
        const enemyGroup = this.physics.add.group(this.enemies);
        console.log({ enemyGroup });
        this.physics.add.collider(this.player, enemyGroup, (player, enemy) =>
            this.player.onHit()
        );
        this.physics.add.collider(enemyGroup, undefined as any);
        this.physics.add.collider(
            enemyGroup,
            this.playerBullets,
            (enemy, bullet) => (enemy as Enemy).die()
        );
    }

    public update(time: number, delta: number) {
        this.player.update();
        this.enemies.forEach(x => x.update());
    }

    private addHud() {
        // this.scene.add("ResourceBarHud", ResourceBarHud, true, {
        //     resources: this.player,
        // });
        // this.scene.add("JobsHud", JobsHud, true, {
        //     jobManager: this.jobManager,
        //     citizenManager: this.citizenManager,
        // });
        // this.scene.add("BuildingSelectionHud", BuildingSelectionHud, true, {
        //     gameScene: this,
        // });
        // this.scene.add("ToggleHudsHud", ToggleHudsHud, true);
    }
}
