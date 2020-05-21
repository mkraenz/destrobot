import { Scene } from "phaser";
import { Board } from "../../components/hud/Board";
import { PostItWithImage } from "../../components/hud/PostItWithImage";
import { WrittenPostit } from "../../components/hud/WrittenPostit";
import { atTopLeft } from "../../utils/get-coords";
import { IResources } from "../../utils/IResources";

export class ResourceBarHud extends Scene {
    private resources!: IResources;

    constructor(key = "ResourceBarHud") {
        super({ key });
    }

    public init(data: { resources: IResources }) {
        this.resources = data.resources;
    }

    public create() {
        this.addResources();
    }

    private addResources() {
        const board = new Board(this, this.scale.width / 2, 50, true);
        const xPostItOffset = 60;
        const boardTopLeft = atTopLeft(board);
        const resources = Object.entries(this.resources);
        resources.forEach(
            ([key, amount], i) =>
                new PostItWithImage(
                    this,

                    {
                        x: boardTopLeft.x + xPostItOffset * i + 20,
                        y: boardTopLeft.y + 12,
                    },
                    {
                        component: {
                            texture: key,
                            scale: 1.8,
                        },
                    }
                )
        );
        resources.forEach(
            ([key, amount], i) =>
                new WrittenPostit(
                    this,
                    boardTopLeft.x + xPostItOffset * i + 20 + 25,
                    boardTopLeft.y + 12 + 67,
                    () => this.resources[key as keyof IResources]
                )
        );
    }
}
