import { Input, Scene } from "phaser";
import { FullscreenButton } from "../components/options/FullScreenButton";
import { playBackgroundMusic } from "../components/options/playBackgroundMusic";
import { SliderWithText } from "../components/options/SliderWithText";
import { BackgroundImage } from "../components/title/BackgroundImage";
import { gOptions } from "../gOptions";
import { Color } from "../styles/Color";
import { TextConfig } from "../styles/Text";

const TITLE = "DestroBot";

export class OptionsScene extends Scene {
    constructor(key = "OptionsScene") {
        super(key);
    }

    public create() {
        const halfWidth = this.scale.width / 2;
        const halfHeight = this.scale.height / 2;
        this.input.mouse.disableContextMenu();
        this.sound.play("title-ambient", { loop: true });
        new BackgroundImage(this, "title-background");
        // todo extract Title class
        const title = this.add
            .text(halfWidth, 210, TITLE, TextConfig.title)
            .setOrigin(0.5);
        title.setShadow(4, 4, Color.Black, 6, true, true);
        title.setAlpha(0.9);

        new SliderWithText(
            this,
            halfHeight + 100,
            "Music Volume",
            "music-volume"
        ).on("change", (event: React.ChangeEvent<HTMLInputElement>) => {
            const musicVolume = Number(event.target.value) / 100.0;
            gOptions.musicVolume = musicVolume;
            this.sound.stopAll();
            playBackgroundMusic(this);
        });
        new SliderWithText(
            this,
            halfHeight + 150,
            "Sfx Volume",
            "sfx-volume"
        ).on("change", (event: React.ChangeEvent<HTMLInputElement>) => {
            const sfxVolume = Number(event.target.value) / 100.0;
            gOptions.sfxVolume = sfxVolume;
            this.sound.play("electric-buzz", { volume: gOptions.sfxVolume });
        });

        const resumeButton = Button("EXIT");
        this.add
            .dom(halfWidth, halfHeight + 200)
            .createFromHTML(resumeButton)
            .addListener("click")
            .on("click", () => this.resumeGame());

        this.addKeyboardInput();
        new FullscreenButton(this);
    }

    private addKeyboardInput() {
        const KeyCodes = Input.Keyboard.KeyCodes;
        const addKey = (key: number | string) =>
            this.input.keyboard.addKey(key);
        const pauseKey = addKey(KeyCodes.P);
        pauseKey.on("down", () => this.resumeGame());
    }

    private resumeGame() {
        this.sound.stopByKey("title-ambient");
        this.scene.switch("MainScene");
    }
}

const Button = (text: string) => `
<div class="buttons">
    <div class="button-container">
        <a class="btn effect01"><span>${text}</span></a>
    </div>
</div>
`;
