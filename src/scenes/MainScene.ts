import { Cameras, Geom, Input, Physics, Scene } from "phaser";
import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { House1 } from "../components/entities/House1";
import { House2 } from "../components/entities/House2";
import { Windmill } from "../components/entities/Windmill";
import { Player } from "../components/Player";
import { Tree } from "../components/Tree";
import { TreeSpawner } from "../components/TreeSpawner";
import { CitizenManager } from "../logic/CitizenManager";
import { HomeFinder } from "../logic/HomeFinder";
import { JobFinder } from "../logic/JobFinder";
import { Entity, EntityClass, House } from "../utils/Entity";
import { IBuildCosts } from "../utils/IBuildCosts";
import { IPoint } from "../utils/IPoint";
import { BuildingSelectionHud } from "./hud/BuildingSelectionHud";
import { JobsHud } from "./hud/JobsHud";
import { ResourceBarHud } from "./hud/ResourceBarHud";
import { ToggleHudsHud } from "./hud/ToggleHudsHud";

const START_CITIZEN_COUNT = 1;
const START_TREE_COUNT = 50;
const NEW_TREES_PER_SEC = 2;
const FADE_IN_TIME = 0;

export class MainScene extends Scene {
    public buildingTypes: EntityClass[] = [House1, House2, Field, Windmill];
    public placedBuilding: EntityClass = this.buildingTypes[0];
    private buildings: Array<Physics.Arcade.Sprite | Physics.Arcade.Image> = [];
    private player!: Player;
    private cits: Citizen[] = [];
    private trees: Tree[] = [];
    private homeFinder!: HomeFinder;
    private jobManager!: JobFinder;
    private citizenManager!: CitizenManager;
    private controls!: Cameras.Controls.SmoothedKeyControl;

    constructor() {
        super({ key: "MainScene" });
    }

    public create(): void {
        const world = this.add
            .image(0, 0, "world")
            .setOrigin(0)
            .setInteractive();
        world.on("pointerup", (pointer: Input.Pointer) =>
            this.placeBuilding(pointer)
        );

        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, world.width, world.height);
        const cursors = this.input.keyboard.createCursorKeys();

        this.addCameraControls();

        this.player = new Player();
        const forest = new TreeSpawner(this, () => this.trees);
        forest.spawn(5);
        forest.spawnRegularly(NEW_TREES_PER_SEC);
        const getCits = () => this.cits;
        this.homeFinder = new HomeFinder(
            () => this.buildings.filter(isHouse),
            getCits
        );
        this.jobManager = new JobFinder(
            this.player,
            getCits,
            () => this.trees,
            () => this.buildings.filter(isField),
            () => this.buildings.filter(isWindmill)
        );
        this.citizenManager = new CitizenManager(this, getCits);
        this.cameras.main.fadeIn(FADE_IN_TIME);
        this.cameras.main.once("camerafadeincomplete", () => this.addHud());
    }

    public setCitizen(cits: Citizen[]) {
        this.cits = cits;
    }

    public update(time: number, delta: number) {
        this.ensureWithinMinMaxZoom();
        this.trees = this.trees.filter(t => t.active);
        this.homeFinder.assignFreeHomes();
        this.jobManager.assignJobsToUnemployed();
        this.jobManager.adjustEmployeesToTargetCount();
        this.citizenManager.update(delta);
        this.controls.update(delta);
    }

    public addCits(newCits: Citizen[]) {
        this.cits.push(...newCits);
    }

    private ensureWithinMinMaxZoom() {
        if (this.cameras.main.zoom <= 1) {
            this.cameras.main.setZoom(1);
        }
        if (this.cameras.main.zoom >= 3) {
            this.cameras.main.setZoom(3);
        }
    }

    private addCameraControls() {
        const KeyCodes = Input.Keyboard.KeyCodes;
        const addKey = (key: number | string) =>
            this.input.keyboard.addKey(key);
        const controlConfig = {
            camera: this.cameras.main,
            left: addKey(KeyCodes.A),
            right: addKey(KeyCodes.D),
            up: addKey(KeyCodes.W),
            down: addKey(KeyCodes.S),
            acceleration: 1,
            maxSpeed: 0.4,
            drag: 1,
            zoomIn: addKey(KeyCodes.Q),
            zoomOut: addKey(KeyCodes.E),
            zoomSpeed: 0.01,
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
            controlConfig
        );
    }

    private addHud() {
        this.scene.add("ResourceBarHud", ResourceBarHud, true, {
            resources: this.player,
        });
        this.scene.add("JobsHud", JobsHud, true, {
            jobManager: this.jobManager,
            citizenManager: this.citizenManager,
        });
        this.scene.add("BuildingSelectionHud", BuildingSelectionHud, true, {
            gameScene: this,
        });
        this.scene.add("ToggleHudsHud", ToggleHudsHud, true);
    }

    private placeBuilding(pointer: IPoint) {
        const { x, y } = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const Building = this.placedBuilding;
        if (this.canBuildAt(x, y, Building) && this.canPayFor(Building)) {
            const house = new Building(this, { x, y }, this.player);
            this.buildings.push(house);
            this.player.pay(Building.buildCosts);
        }
    }

    private canPayFor({ buildCosts }: { buildCosts: IBuildCosts }) {
        return this.player.hasResources(buildCosts);
    }

    /** assumes that buildings are placed with origin 0.5, 0.5 */
    private canBuildAt(
        x: number,
        y: number,
        building: { width: number; height: number }
    ) {
        const buildingGrounds = new Geom.Rectangle(
            x,
            y,
            building.width,
            building.height
        );

        return !this.buildings.some(other => {
            const existingBuilding = new Geom.Rectangle(
                other.x,
                other.y,
                other.width,
                other.height
            );
            return Geom.Intersects.RectangleToRectangle(
                buildingGrounds,
                existingBuilding
            );
        });
    }
}

const isHouse = (b: Entity): b is House =>
    b instanceof House1 || b instanceof House2;
const isField = (b: Entity): b is Field => b instanceof Field;
const isWindmill = (b: Entity): b is Windmill => b instanceof Windmill;
