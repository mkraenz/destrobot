import { GameObjects, Scene } from "phaser";
import { Level1 } from "../levels/Level1";
import { Color, toHex } from "../styles/Color";
import { setDefaultTextStyle } from "../styles/Text";
import { MainScene } from "./MainScene";

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
            this.cameras.main.once("camerafadeoutcomplete", (camera: any) => {
                this.scene.add("MainScene", MainScene, true, Level1);
                this.scene.remove("LoadingScene");
            });
            this.cameras.main.fadeOut(FADEOUT_TIME);
        });
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

    private preloadAllAssets() {
        const imgPath = (filename: string) => `./assets/images/${filename}`;
        const audioPath = (filename: string) => `./assets/sounds/${filename}`;
        this.load
            .spritesheet("player", imgPath("player.png"), {
                frameWidth: 16,
                frameHeight: 16,
            })
            .spritesheet("robot", imgPath("robot.png"), {
                frameWidth: 28,
                frameHeight: 32,
            })
            .image("bullet", imgPath("bullet.png"))
            .image("bullet2", imgPath("bullet2.png"))
            .image("world", imgPath("earthbound-scarab-do-not-upload.png"))
            .image("machine-gun", imgPath("tommy-gun.png"))
            .image("pistol", imgPath("pistol.png"))
            .image("sniper-rifle", imgPath("sniper-rifle.png"))
            .audio("sniper-rifle-shot", audioPath("sniper-rifle-shot.mp3"))
            .audio("empty-magazine", audioPath("empty-magazine.mp3")) // dry shot
            .audio("weapon-loaded", audioPath("weapon-loaded.mp3"))
            .audio("empty-magazine", audioPath("empty-magazine.mp3"))
            .spritesheet("heart", imgPath("heart.png"), {
                frameWidth: 16,
                frameHeight: 16,
            })
            .tilemapTiledJSON("map", "./assets/maps/map.json")
            .image("tiles", "./assets/images/tileset.png");
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
