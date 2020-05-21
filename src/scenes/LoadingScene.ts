import { GameObjects, Scene } from "phaser";
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
                this.scene.add("MainScene", MainScene, true);
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
        this.load.image("house1", "./assets/images/house1.png");
        this.load.image("house2", "./assets/images/house2.png");
        this.load.image("board", "./assets/images/board.png");
        this.load.image("postit", "./assets/images/postit.png");
        this.load.image("peach-bg", "./assets/images/peach-bg.png");
        this.load.image("field", "./assets/images/field.png");
        this.load.image("wood", "./assets/images/wood.png");
        this.load.image("stone", "./assets/images/stone.png");
        this.load.image("food", "./assets/images/food.png");
        this.load.image("crops", "./assets/images/crops.png");
        this.load.image("citizen", "./assets/images/citizen.png");
        this.load.spritesheet("windmill", "./assets/images/windmill.png", {
            frameWidth: 24,
            frameHeight: 32,
        });
        this.load.spritesheet("tree", "./assets/images/tree-5-pics.png", {
            frameWidth: 16,
        });
        this.load.image(
            "postit-two-pins",
            "./assets/images/postit-two-pins.png"
        );
        this.load.spritesheet(
            "plus-button",
            "./assets/images/plus-button.png",
            { frameWidth: 16, frameHeight: 16 }
        );
        this.load.spritesheet(
            "minus-button",
            "./assets/images/minus-button.png",
            { frameWidth: 16, frameHeight: 16 }
        );
        this.load.image(
            "world",
            "./assets/images/earthbound-scarab-do-not-upload.png"
        );
        // this.load.audio("background", "./assets/sounds/bgm.mp3");
    }

    private addTitles() {
        const title = this.add
            .text(this.halfWidth, this.halfHeight - 200, "Fursorger")
            .setOrigin(0.5);
        setDefaultTextStyle(title);
        title.setFontSize(112);
        title.setColor(Color.White);

        const subtitle = this.add
            .text(
                this.halfWidth,
                this.halfHeight - 120,
                "This world is dying. Can you save us?"
            )
            .setOrigin(0.5);
        setDefaultTextStyle(subtitle);
        subtitle.setColor(Color.White);
    }
}
