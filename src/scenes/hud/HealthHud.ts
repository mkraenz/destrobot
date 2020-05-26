import { range } from "lodash";
import { Scene } from "phaser";
import { Heart } from "./Heart";

export class HealthHud extends Scene {
    private player!: { health: number; maxHealth: number };
    private hearts: Heart[] = [];

    constructor(key = "HealthHud") {
        super({ key });
    }

    public init(data: { player: { health: number; maxHealth: number } }) {
        this.player = data.player;
    }

    public create() {
        this.drawHearts();
    }

    public update() {
        this.hearts.forEach(h => h.update());
    }

    private drawHearts() {
        const xOffset = 20 * 3;
        const uiHearts = range(this.player.maxHealth).map(
            (_, i) =>
                new Heart(
                    this,
                    50 + xOffset * i,
                    50,
                    i,
                    () => this.player.health
                )
        );
        this.hearts.push(...uiHearts);
    }
}
