import { GameObjects, Scene } from "phaser";
import { DEV } from "../dev-config";
import { Level1 } from "../levels/Level1";
import { Color, toHex } from "../styles/Color";
import { setDefaultTextStyle } from "../styles/Text";
import { MainScene } from "./MainScene";
import { OptionsScene } from "./OptionsScene";
import { TitleScene } from "./TitleScene";

const FADEOUT_TIME = 0;

export class LoadingScene extends Scene {
    private halfWidth!: number;
    private halfHeight!: number;

    constructor() {
        super({ key: "Loading" });
    }

    public preload() {
        this.halfWidth = this.scale.width / 2;
        this.halfHeight = this.scale.height / 2;

        this.preloadAllAssets();
        this.addTitles();
        this.makeLoadingBar();
    }

    private preloadAllAssets() {
        const imgPath = (filename: string) => `./assets/images/${filename}`;
        const audioPath = (filename: string) => `./assets/sounds/${filename}`;
        const particlePath = (filename: string) =>
            `./assets/particles/${filename}`;
        this.load
            .image("ammo", imgPath("ammo.png"))
            .image("bullet", imgPath("bullet.png"))
            .image("bullet2", imgPath("bullet2.png"))
            .image("machine-gun", imgPath("tommy-gun.png"))
            .image("pistol", imgPath("pistol.png"))
            .image("sniper-rifle", imgPath("sniper-rifle.png"))
            .image("uzi", imgPath("uzi.png"))
            .image("title-background", imgPath("metal-plaque.jpg"))
            .image("skull", imgPath("skull.png"))
            .image("skull-red-eyes", imgPath("skull-red-eyes.png"))
            .image("robot", [imgPath("robot.png"), imgPath("robot_n.png")])
            .audio("typing", audioPath("teletype.mp3"))
            .audio("title-ambient", audioPath("sci-fi-sfx-loop-ambient-01.mp3"))
            .audio("electric-buzz", audioPath("electric-buzz.mp3"))
            .audio("sniper-rifle-shot", audioPath("sniper-rifle-shot.mp3"))
            .audio("empty-magazine", audioPath("empty-magazine.mp3")) // dry shot
            .audio("weapon-loaded", audioPath("weapon-loaded.mp3"))
            .audio("powerup", audioPath("powerup.mp3"))
            .audio("fight_music", audioPath("fight-music-looped.mp3"))
            .audio("player-hit", audioPath("impact-meat.mp3"))
            .audio("enemy-hit", audioPath("punch.mp3"))
            .audio("player-die", audioPath("player-die.mp3"))
            .audio("enemy-die", audioPath("robot-off.mp3"))
            .audio(
                "weapon-last-bullet-shot",
                audioPath("weapon-last-bullet-shot.mp3")
            )
            .audio("empty-magazine", audioPath("empty-magazine.mp3"))
            .spritesheet("heart", imgPath("heart.png"), {
                frameWidth: 16,
                frameHeight: 16,
            })
            .spritesheet("player", imgPath("player.png"), {
                frameWidth: 16,
                frameHeight: 16,
            })
            .spritesheet("fullscreen", imgPath("fullscreen.png"), {
                frameWidth: 64,
                frameHeight: 64,
            })
            .tilemapTiledJSON("map", "./assets/maps/map.json")
            .image("tiles", [imgPath("tileset.png"), imgPath("tileset_n.png")])
            .atlas(
                "shapes",
                particlePath("shapes.png"),
                particlePath("shapes.json")
            )
            .text(
                "sparkle-particle-effect",
                particlePath("sparkle-particle-effect.json")
            );
    }

    private makeLoadingBar() {
        const loadingText = this.make.text({
            x: this.halfWidth,
            y: this.halfHeight - 50,
            text: "Loading...",
            style: {
                font: "30px Metamorphous",
                fill: Color.White,
            },
        });
        loadingText.setOrigin(0.5);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(toHex(Color.DarkGrey), 0.8);
        progressBox.fillRect(
            this.halfWidth - 320 / 2,
            this.halfHeight,
            320,
            50
        );

        const assetText = this.make.text({
            x: this.halfWidth,
            y: this.halfHeight + 65,
            text: "",
            style: {
                font: "18px Metamorphous",
                fill: Color.White,
            },
        });
        assetText.setOrigin(0.5);

        this.load.on("progress", this.getProgressBarFiller(progressBar));
        this.load.on("fileprogress", this.getAssetTextWriter(assetText));
        this.load.on("complete", () => {
            this.cameras.main.once("camerafadeoutcomplete", () =>
                this.nextScene()
            );
            this.cameras.main.fadeOut(FADEOUT_TIME);
        });
    }

    private nextScene() {
        if (DEV.startInOptionsScene) {
            this.scene.add("OptionsScene", OptionsScene, true);
        } else if (DEV.startInMainScene) {
            this.scene.add("MainScene", MainScene, true, Level1);
        } else {
            this.scene.add("TitleScene", TitleScene, true);
        }
        this.scene.remove(this);
    }

    private getAssetTextWriter(
        assetText: GameObjects.Text
    ): (file: { key: string }) => void {
        return (file: { key: string }) => {
            assetText.setText(`Loading asset: ${file.key}`);
        };
    }

    private getProgressBarFiller(
        progressBar: GameObjects.Graphics
    ): (count: number) => void {
        return (count: number) => {
            progressBar.clear();
            progressBar.fillStyle(toHex(Color.White));
            progressBar.fillRect(
                this.halfWidth + 10 - 320 / 2,
                this.halfHeight + 10,
                300 * count,
                30
            );
        };
    }

    private addTitles() {
        const title = this.add
            .text(this.halfWidth, this.halfHeight - 200, "Hold the bridge!")
            .setOrigin(0.5);
        setDefaultTextStyle(title);
        title.setFontSize(112);
        title.setColor(Color.White);

        const subtitle = this.add
            .text(
                this.halfWidth,
                this.halfHeight - 120,
                "How long can you defend your home?"
            )
            .setOrigin(0.5);
        setDefaultTextStyle(subtitle);
        subtitle.setColor(Color.White);
    }
}
