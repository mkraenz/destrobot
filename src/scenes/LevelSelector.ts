import { Scene } from "phaser";
import { EventType } from "../events/EventType";
import { LEVELS } from "../levels";
import { ILevel } from "../levels/ILevel";
import { MainScene } from "./MainScene";
import { SceneKey } from "./SceneKeys";

const isFinalLevel = (level: ILevel) => level === LEVELS[LEVELS.length - 1];

export class LevelSelector extends Scene {
    constructor(key = SceneKey.LevelSelector) {
        super(key);
    }

    public create() {
        const mainScene = this.scene.get(SceneKey.Main) as MainScene;
        mainScene.events.once(EventType.LevelComplete, () => {
            // WORKAROUND: for some reason (maybe because restart starts only on next frame) phaser doesn't like it without the setTimeout
            setTimeout(() => {
                const [currentLevel] = LEVELS.filter(l =>
                    mainScene.isRunningLevel(l)
                );

                if (isFinalLevel(currentLevel)) {
                    // TODO big congratz or score
                    return;
                }
                const nextLevelIndex =
                    LEVELS.findIndex(l => l === currentLevel) + 1;
                mainScene.restart(LEVELS[nextLevelIndex]);
            }, 35);
        });
    }
}
