import { IStore } from "../../utils/IResources";
import { Citizen } from "../Citizen";
import { Tree } from "../Tree";
import { Hobo } from "./Hobo";
import { IJob } from "./IJob";

const WOOD_PER_TREE = 5;
const TIME_TO_CUT_TREE_IN_MS = 3000;

export class Woodcutter implements IJob {
    private tickStarted = false;
    private timer?: NodeJS.Timeout;

    constructor(
        private citizen: Citizen,
        private store: IStore,
        private getTrees: () => Tree[]
    ) {}

    public stop(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    public update() {
        if (this.citizen.idle) {
            this.startWork();
        }
        if (
            !this.citizen.idle &&
            this.citizen.isCloseToTarget() &&
            !this.tickStarted
        ) {
            this.startCuttingTree();
        }
    }

    private getNextTarget() {
        const freeTrees = this.getTrees().filter(t => !t.isTaken);
        if (!freeTrees.length) {
            return undefined;
        }
        const nearestTree = freeTrees.reduce(
            (min, val) =>
                this.citizen.dist(val) > this.citizen.dist(min) ? min : val,
            freeTrees[0]
        );
        return nearestTree;
    }

    private startWork() {
        const tree = this.getNextTarget();
        if (tree) {
            this.citizen.setTarget(tree);
            tree.isTaken = true;
            this.citizen.setIdle(false);
        } else {
            this.citizen.setIdle(true);
            this.citizen.setJob(new Hobo());
        }
    }

    private startCuttingTree() {
        this.citizen.setIdle(false);
        this.tickStarted = true;
        this.timer = setTimeout(
            () => this.handleTreeCut(),
            TIME_TO_CUT_TREE_IN_MS
        );
    }

    private handleTreeCut() {
        if (!this.citizen.target) {
            throw new Error(
                `Citizen.target not set. This should not have happened. Should have been a Tree. Citizen: ${JSON.stringify(
                    this,
                    null,
                    2
                )}`
            );
        }
        this.store.addResources({ wood: WOOD_PER_TREE });
        this.citizen.target.destroy();
        this.citizen.setIdle(true);
        this.citizen.setTarget(undefined);
        this.tickStarted = false;
    }
}
