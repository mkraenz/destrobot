import { random } from "lodash";
import { GameObjects, Scene } from "phaser";
import { FullscreenButton } from "../components/options/FullScreenButton";
import { BackgroundImage } from "../components/title/BackgroundImage";
import { ILevel } from "../levels/ILevel";
import { Level1 } from "../levels/Level1";
import { Color } from "../styles/Color";
import { TextConfig } from "../styles/Text";
import { MainScene } from "./MainScene";
import { OptionsScene } from "./OptionsScene";
import { SceneKey } from "./SceneKeys";

const START = "Click to start";
const VERSION = "v0.2.0";
const TITLE = "DestroBot";
const AUTHOR = "A Game by Mirco Kraenz";
const FADEOUT = 0;
const TEXT_SPEED = 100;
const CONTROLS = `WASD > move
Space > dodge
Left mouse button > fire
Right mouse button > reload
Mouse movement > aim
P > pause`;

export class TitleScene extends Scene {
    private electricBuzzTimer?: number;

    constructor() {
        super({
            key: SceneKey.Title,
        });
    }

    public create(): void {
        this.addHud();
    }

    private addHud() {
        this.sound.play("typing");
        this.sound.play("title-ambient", { loop: true });
        const background = new BackgroundImage(this, "title-background");
        const title = this.add
            .text(this.scale.width / 2, 210, TITLE, TextConfig.title)
            .setOrigin(0.5)
            .setShadow(4, 4, Color.Black, 6, true, true)
            .setAlpha(0.9);
        typeWriter(TITLE, title, () =>
            this.events.emit("typewriting-finished")
        );
        this.events.once("typewriting-finished", () => {
            this.sound.play("electric-buzz");
            this.add
                .text(this.scale.width / 2, 290, AUTHOR, TextConfig.version)
                .setOrigin(0.5)
                .setShadow(2, 2, Color.Black, 6, true, true)
                .setAlpha(0.9);
            this.add.text(10, this.scale.height - 20, VERSION).setAlpha(0.6);

            const bannerStartHeight = this.scale.height / 2 + 130;
            this.add
                .text(
                    this.scale.width / 2,
                    bannerStartHeight,
                    START,
                    TextConfig.lg
                )
                .setOrigin(0.5)
                .setShadow(2, 2, Color.Black, 6, true, true)
                .setAlpha(0.9);
            this.add
                .text(
                    this.scale.width / 2,
                    bannerStartHeight + 100,
                    CONTROLS,
                    TextConfig.mdTitle
                )
                .setOrigin(0.5)
                .setAlpha(0.6);

            // hard mode
            this.add
                .image(this.scale.width / 2 + 200, bannerStartHeight, "skull")
                .setInteractive({ useHandCursor: true })
                .once("pointerup", () => {
                    const lvl: ILevel = {
                        ...Level1,
                        player: { ...Level1.player, health: 1, maxHealth: 1 },
                    };
                    this.goto(SceneKey.Main, MainScene, lvl);
                });

            // extra hard mode
            this.add
                .image(
                    this.scale.width / 2 + 300,
                    bannerStartHeight,
                    "skull-red-eyes"
                )
                .setInteractive({ useHandCursor: true })
                .once("pointerup", () => {
                    const lvl: ILevel = {
                        ...Level1,
                        player: { ...Level1.player, health: 1, maxHealth: 1 },
                        mode: { ...Level1.mode, dark: true },
                    };
                    this.goto(SceneKey.Main, MainScene, lvl);
                });

            // this.add.particles(
            //     "shapes",
            //     new Function(
            //         `return ${this.cache.text.get("sparkle-particle-effect")}`
            //     )()
            // );

            background.once("pointerup", () =>
                this.goto(SceneKey.Main, MainScene, Level1)
            );
            this.setBuzzTimeout();
            new FullscreenButton(this);
        });
        this.input.mouse.disableContextMenu();
    }

    private setBuzzTimeout() {
        this.electricBuzzTimer = window.setTimeout(() => {
            this.sound.play("electric-buzz");
            this.setBuzzTimeout();
        }, random(1000, 5000));
    }

    private goto(
        key: string,
        sceneClass: new (name: string) => Scene,
        initData?: any
    ) {
        this.cameras.main.once("camerafadeoutcomplete", () => {
            window.clearTimeout(this.electricBuzzTimer);
            this.sound.stopByKey("title-ambient");
            this.scene.add(SceneKey.Options, OptionsScene, false);
            this.scene.add(key, sceneClass, true, initData);
            this.scene.remove(this);
        });
        this.cameras.main.fadeOut(FADEOUT);
    }
}

const typeWriter = (
    fullText: string,
    textComponent: GameObjects.Text,
    onFinish: () => void,
    lastLetter = 0,
    currentText = ""
) => {
    if (lastLetter < fullText.length) {
        const nextText = `${currentText}${fullText.charAt(lastLetter)}`;
        textComponent.setText(nextText);
        setTimeout(
            () =>
                typeWriter(
                    fullText,
                    textComponent,
                    onFinish,
                    lastLetter + 1,
                    nextText
                ),
            TEXT_SPEED
        );
    } else {
        onFinish();
    }
};
