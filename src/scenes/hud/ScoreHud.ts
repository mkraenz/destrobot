import { Scene } from "phaser";
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
        mainScene.events.on("enemy-killed", () => {
            this.score += 10;
            scoreText.setText(`Score: ${this.score}`);
        });
    }
}
