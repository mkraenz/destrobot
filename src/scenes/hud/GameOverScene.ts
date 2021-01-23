import { GameObjects, Scene } from "phaser";
import { Color } from "../../styles/Color";
import { TextConfig } from "../../styles/Text";
import { SceneKey } from "../SceneKeys";

const RESTART_TIMEOUT = 10000;

interface IRestartable {
    restart(): void;
}

export class GameOverScene extends Scene {
    private timerText!: GameObjects.Text;
    private timer = RESTART_TIMEOUT;

    constructor(key = SceneKey.GameOver) {
        super(key);
    }

    public create() {
        setTimeout(() => {
            const mainScene = this.scene.get(SceneKey.Main);
            ((mainScene as unknown) as IRestartable).restart();
            this.scene.remove(this);
        }, RESTART_TIMEOUT);

        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2,
                this.getTimerText(),
                TextConfig.xxl
            )
            .setOrigin(0.5)
            .setBackgroundColor(Color.Red);
    }

    public update(time: number, delta: number) {
        this.timer -= delta;
        this.timerText.setText(this.getTimerText());
    }

    private getTimerText() {
        return `Retry in ${Math.round(this.timer / 1000.0)} seconds`;
    }
}
