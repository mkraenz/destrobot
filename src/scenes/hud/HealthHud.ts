import { range } from "lodash";
import { Scene } from "phaser";
import { SceneKey } from "../SceneKeys";
import { Heart } from "./Heart";

export interface IHealthHudInitData {
    player: { getHealth(): number; getMaxHealth(): number };
}

export class HealthHud extends Scene {
    private player!: IHealthHudInitData["player"];
    private hearts: Heart[] = [];

    constructor(key = SceneKey.HealthHud) {
        super({ key });
    }

    public init(data: IHealthHudInitData) {
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
        const uiHearts = range(this.player.getMaxHealth()).map(
            (_, i) =>
                new Heart(this, 50 + xOffset * i, 50, i, () =>
                    this.player.getHealth()
                )
        );
        this.hearts.push(...uiHearts);
    }
}
