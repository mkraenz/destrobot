import { Scene } from "phaser";
import { Heart } from "./Heart";

export class HealthHud extends Scene {
    private player!: { health: number; maxHealth: number };

    constructor(key = "HealthHud") {
        super({ key });
    }

    public init(data: { player: { health: number; maxHealth: number } }) {
        this.player = data.player;
    }

    public create() {
        this.drawHearts();
    }

    private drawHearts() {
        const xOffset = 20 * 3;
        Array(this.player.maxHealth)
            .fill(0)
            .forEach((zero, i) => {
                new Heart(
                    this,
                    50 + xOffset * i,
                    50,
                    i,
                    () => this.player.health
                );
            });
    }
}
