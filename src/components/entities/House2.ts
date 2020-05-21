import { Physics, Scene } from "phaser";
import { IBuildCosts } from "../../utils/IBuildCosts";
import { IPoint } from "../../utils/IPoint";
import { IFoodStore } from "../../utils/IResources";
import { Citizen } from "../Citizen";
import { CitizenSpawner } from "../CitizenSpawner";

const SPAWNED_CITIZEN = 2;

export class House2 extends Physics.Arcade.Image {
    public static width = 24;
    public static height = 32;
    public static readonly texture = "house2";
    public static buildCosts: IBuildCosts = {
        stone: 1,
        wood: 10,
    };
    public citizen?: {};

    constructor(
        scene: Scene & { addCits: (cits: Citizen[]) => void },
        at: IPoint,
        store: IFoodStore
    ) {
        super(scene, at.x, at.y, House2.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const spawner = new CitizenSpawner(scene, at, store);
        const spawnedCits = spawner.spawn(SPAWNED_CITIZEN);
        scene.addCits(spawnedCits);
        this.setInteractive(); // blockinput
    }
}
