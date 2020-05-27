import { Scene } from "phaser";
import { IEnemyKilledEvent } from "../../events/Events";
import { EventType } from "../../events/EventType";
import { TextConfig } from "../../styles/Text";

export class ScoreHud extends Scene {
    private score = 0;

    constructor(key = "ScoreHud") {
        super(key);
    }

    public create() {
        const scoreText = this.add.text(
            800,
            34,
            `Score: ${this.score}`,
            TextConfig.xl
        );
        const mainScene = this.scene.get("MainScene");
        mainScene.events.on(
            EventType.EnemyKilled,
            (data: IEnemyKilledEvent) => {
                this.score += data.score;
                scoreText.setText(`Score: ${this.score}`);
            }
        );
    }
}
