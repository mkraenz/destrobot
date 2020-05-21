import { Scene } from "phaser";
import { PlusMinusButton } from "../../components/hud/PlusMinusButton";
import { TextDisplay } from "../../components/hud/TextDisplay";
import { CitizenManager } from "../../logic/CitizenManager";
import { JobFinder } from "../../logic/JobFinder";
import { Color, toHex } from "../../styles/Color";
import { GUI_DEPTH } from "../../styles/constants";
import { IJobCounts } from "../../utils/IJobCounts";

export class JobsHud extends Scene {
    private static jobs: Array<keyof IJobCounts> = [
        "farmer",
        "miller",
        "woodcutter",
    ];
    private jobManager!: JobFinder;
    private citizenManager!: CitizenManager;

    constructor(key = "JobsHud") {
        super(key);
    }

    public init(data: {
        jobManager: JobFinder;
        citizenManager: CitizenManager;
    }) {
        this.jobManager = data.jobManager;
        this.citizenManager = data.citizenManager;
    }

    public create() {
        const height = 200;
        const x = 752;
        const y = this.scale.height / 2 - height / 2;
        this.add
            .rectangle(x - 10, y - 10, 270, height, toHex(Color.Brown))
            .setOrigin(0, 0)
            .setInteractive()
            .setDepth(GUI_DEPTH)
            .setScrollFactor(0);

        new TextDisplay(
            this,
            x + 20,
            y,
            () => this.jobManager.totalTargetJobCount,
            true
        );
        this.add
            .text(x + 20, y, "/")
            .setDepth(GUI_DEPTH + 1)
            .setScrollFactor(0);
        new TextDisplay(
            this,
            x + 20 + 10,
            y,
            () => this.citizenManager.citizenCount
        );

        const y2 = y + 50;
        JobsHud.jobs.forEach((job, i) => {
            const yOffset = 30;
            this.add
                .text(x, y2 + i * yOffset, job)
                .setDepth(GUI_DEPTH + 1)
                .setScrollFactor(0);
            new PlusMinusButton(
                this,
                x + 130,
                y2 + i * yOffset,
                "plus",
                () => this.jobManager.increaseTargetJobCount(job),
                () =>
                    this.jobManager.unemployedCitizen.length === 0 ||
                    this.jobManager.totalTargetJobCount ===
                        this.citizenManager.citizenCount
            );
            new PlusMinusButton(
                this,
                x + 160,
                y2 + i * yOffset,
                "minus",
                () => this.jobManager.decreaseTargetJobCount(job),
                () => this.jobManager.getTargetJobCount(job) === 0
            );

            new TextDisplay(
                this,
                x + 210,
                y2 + i * yOffset,
                () => this.jobManager.getCurrentJobCount(job),
                true
            );
            this.add
                .text(x + 210, y2 + i * yOffset, "/")
                .setDepth(GUI_DEPTH + 1)
                .setScrollFactor(0);
            new TextDisplay(this, x + 220, y2 + i * yOffset, () =>
                this.jobManager.getTargetJobCount(job)
            );
        });
    }
}
