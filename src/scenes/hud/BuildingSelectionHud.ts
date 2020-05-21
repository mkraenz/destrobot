import { Scene } from "phaser";
import { Field } from "../../components/entities/Field";
import { House1 } from "../../components/entities/House1";
import { House2 } from "../../components/entities/House2";
import { Windmill } from "../../components/entities/Windmill";
import { Board } from "../../components/hud/Board";
import { PostItWithImage } from "../../components/hud/PostItWithImage";
import { EntityClass } from "../../utils/Entity";

export class BuildingSelectionHud extends Scene {
    private buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    private gameScene!: { placedBuilding: EntityClass };

    constructor(key = "BuildingSelectionHud") {
        super(key);
    }

    public init(data: { gameScene: { placedBuilding: EntityClass } }) {
        this.gameScene = data.gameScene;
    }

    public create() {
        this.addSelectBuildings();
    }

    private addSelectBuildings() {
        const board = new Board(this, 20, this.scale.height - 100);
        const xPostItOffset = 60;
        this.buildingTypes.forEach(
            (Type, i) =>
                new PostItWithImage(
                    this,
                    { x: board.x + xPostItOffset * i + 20, y: board.y + 8 },
                    {
                        component: {
                            texture: Type.texture,
                            scale: 1.8,
                        },
                        onPointerup: () =>
                            (this.gameScene.placedBuilding = Type),
                    }
                )
        );
    }
}
