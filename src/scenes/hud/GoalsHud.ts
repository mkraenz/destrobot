import { GameObjects, Scene } from "phaser";
import { IEnemyKilledEvent } from "../../events/Events";
import { EventType } from "../../events/EventType";
import { ILevel } from "../../levels/ILevel";
import { TextConfig } from "../../styles/Text";
import { SceneKey } from "../SceneKeys";

interface IKilledEnemies {
    type: string;
    goalAmount: number;
    currentAmount: number;
    comp?: GameObjects.Text;
}
export type GoalsHudInitData = ILevel["goals"];

export class GoalsHud extends Scene {
    private killedEnemies!: IKilledEnemies[];

    constructor(key = SceneKey.GoalsHud) {
        super(key);
    }

    public init(data: GoalsHudInitData) {
        this.killedEnemies = data.killEnemies.map(({ type, amount }) => ({
            type,
            goalAmount: amount,
            currentAmount: 0,
        }));
    }

    public create() {
        const baseX = 10;
        const baseY = this.scale.height - 20; // start from bottom, going upwards
        const yOffset = 30;
        this.killedEnemies.forEach(
            (e, i) =>
                (e.comp = this.add.text(
                    baseX,
                    baseY - yOffset * i,
                    getText(e),
                    TextConfig.md
                ))
        );

        const mainScene = this.scene.get(SceneKey.Main);
        mainScene.events.on(
            EventType.EnemyKilled,
            (data: IEnemyKilledEvent) => {
                const type = data.name;
                const killedEnemy = this.killedEnemies.find(
                    e => e.type === type
                );
                if (killedEnemy) {
                    killedEnemy.currentAmount++;
                    killedEnemy.comp!.setText(getText(killedEnemy));
                    this.maybeWin();
                }
            }
        );
    }

    private maybeWin() {
        const isWin = this.killedEnemies.every(
            e => e.currentAmount >= e.goalAmount
        );
        if (isWin) {
            this.add
                .text(
                    this.scale.width / 2,
                    this.scale.height / 2,
                    "YOU WIN!!!",
                    TextConfig.title
                )
                .setOrigin(0.5);

            this.time.addEvent({
                callback: () => this.emitLevelComplete(),
                delay: 3000,
            });
        }
    }

    private emitLevelComplete() {
        const mainScene = this.scene.get(SceneKey.Main);
        mainScene.events.emit(EventType.LevelComplete);
    }
}

const getText = ({ type, currentAmount, goalAmount }: IKilledEnemies) => {
    return currentAmount >= goalAmount
        ? ""
        : `${type} ${currentAmount}/${goalAmount}`;
};
