import { Scene } from "phaser";
import { IEnemyKilledEvent } from "../../events/Events";
import { EventType } from "../../events/EventType";
import { TextConfig } from "../../styles/Text";
import { SceneKey } from "../SceneKeys";

export class ScoreHud extends Scene {
    private score = 0;

    constructor(key = SceneKey.ScoreHud) {
        super(key);
    }

    public create() {
        const scoreText = this.add
            .text(
                this.scale.width / 2,
                34,
                `Score: ${this.score}`,
                TextConfig.xl
            )
            .setOrigin(0.5);
        const mainScene = this.scene.get(SceneKey.Main);
        mainScene.events.on(
            EventType.EnemyKilled,
            (data: IEnemyKilledEvent) => {
                this.score += data.score;
                scoreText.setText(`Score: ${this.score}`);
            }
        );
    }
}
