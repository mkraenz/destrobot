import { IStore } from "../../utils/IResources";
import { Citizen } from "../Citizen";
import { Windmill } from "../entities/Windmill";
import { IJob } from "./IJob";

const FOOD_PER_TICK = 1;
const TICK_TIME_IN_MS = 1000;

export class Miller implements IJob {
    private tickStarted = false;
    private timer?: NodeJS.Timeout;

    constructor(
        private citizen: Citizen,
        private store: IStore,
        private windmill: () => Windmill
    ) {}

    public stop(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.windmill().unOccupy();
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
            this.startMilling();
        }
    }

    private getNextTarget() {
        return this.windmill() || undefined;
    }

    private startWork() {
        const target = this.getNextTarget();
        if (target) {
            this.citizen.setTarget(target);
            this.citizen.setIdle(false);
        } else {
            this.citizen.setIdle(true);
        }
    }

    private startMilling() {
        this.citizen.setIdle(false);
        this.tickStarted = true;
        this.timer = setTimeout(() => this.onTickFinished(), TICK_TIME_IN_MS);
    }

    private onTickFinished() {
        if (!this.citizen.target) {
            throw new Error(
                `Citizen.target not set. This should not have happened. Should have been a Tree. Citizen: ${JSON.stringify(
                    this,
                    null,
                    2
                )}`
            );
        }
        this.store.addResources({ food: FOOD_PER_TICK });
        this.citizen.setIdle(true);
        this.citizen.setTarget(undefined);
        this.tickStarted = false;
    }
}
