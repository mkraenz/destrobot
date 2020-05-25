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
        const withImagePath = (filename: string) =>
            `./assets/images/${filename}`;
        this.load
            .spritesheet("player", withImagePath("player.png"), {
                frameWidth: 16,
                frameHeight: 16,
            })
            .spritesheet("enemy", withImagePath("robot.png"), {
                frameWidth: 28,
                frameHeight: 32,
            })
            .image("bullet", withImagePath("citizen.png"))
            .image(
                "world",
                withImagePath("earthbound-scarab-do-not-upload.png")
            )
            .image("heart", withImagePath("heart.png"))
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
