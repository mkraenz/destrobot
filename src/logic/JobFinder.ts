import { Citizen } from "../components/Citizen";
import { Field } from "../components/entities/Field";
import { Windmill } from "../components/entities/Windmill";
import { Farmer } from "../components/jobs/Farmer";
import { Hobo } from "../components/jobs/Hobo";
import { Miller } from "../components/jobs/Miller";
import { Woodcutter } from "../components/jobs/Woodcutter";
import { Tree } from "../components/Tree";
import { IJobCounts } from "../utils/IJobCounts";
import { IStore } from "../utils/IResources";
import { keysIn } from "../utils/ts";

export class JobFinder {
    private targetJobCount: IJobCounts = {
        woodcutter: 2,
        farmer: 2,
        miller: 2,
    };

    constructor(
        private store: IStore,
        private cits: () => Citizen[],
        private trees: () => Tree[],
        private fields: () => Field[],
        private windmills: () => Windmill[]
    ) {}

    public get totalTargetJobCount() {
        return Object.values(this.targetJobCount).reduce(
            (sum, val) => (sum += val),
            0
        ) as number;
    }

    public setTargetJobCount(job: Partial<IJobCounts>) {
        keysIn(job).forEach(key => (this.targetJobCount[key] += job[key]!));
    }

    public getTargetJobCount(job: keyof IJobCounts) {
        return this.targetJobCount[job];
    }

    public getCurrentJobCount(job: keyof IJobCounts) {
        return this.currentJobCount[job];
    }

    public increaseTargetJobCount(job: keyof IJobCounts) {
        this.targetJobCount[job]++;
    }

    public decreaseTargetJobCount(job: keyof IJobCounts) {
        if (this.targetJobCount[job] > 0) {
            this.targetJobCount[job]--;
        }
    }

    public get unemployedCitizen() {
        return this.cits().filter(cit => Hobo.instanceOf(cit.job));
    }

    public get employedCitizen() {
        return this.cits().filter(cit => !Hobo.instanceOf(cit.job));
    }

    public assignJobsToUnemployed() {
        this.unemployedCitizen.forEach(cit => {
            // order is important. it determines the priority by which we fill jobs
            if (
                this.currentJobCount.farmer < this.targetJobCount.farmer &&
                hasFree(this.fields())
            ) {
                this.makeFarmer(cit);
                return;
            }
            if (
                this.currentJobCount.miller < this.targetJobCount.miller &&
                hasFree(this.windmills())
            ) {
                this.makeMiller(cit);
                return;
            }
            if (
                this.currentJobCount.woodcutter < this.targetJobCount.woodcutter
            ) {
                this.makeWoodcutter(cit);
                return;
            }
        });
    }

    public adjustEmployeesToTargetCount() {
        while (this.woodcutters.length > this.targetJobCount.woodcutter) {
            this.woodcutters[0].setJob(new Hobo());
        }
        while (this.farmers.length > this.targetJobCount.farmer) {
            this.farmers[0].setJob(new Hobo());
        }
        while (this.millers.length > this.targetJobCount.miller) {
            this.millers[0].setJob(new Hobo());
        }
    }

    private makeFarmer(cit: Citizen) {
        const freeField = this.fields().find(f => !f.isTaken);
        if (freeField) {
            const job = new Farmer(cit, this.store, () => freeField);
            cit.setJob(job);
            freeField.isTaken = true;
        }
    }

    private makeMiller(cit: Citizen) {
        const freeBuilding = this.windmills().find(w => !w.isTaken);
        if (freeBuilding) {
            const job = new Miller(cit, this.store, () => freeBuilding);
            cit.setJob(job);
            freeBuilding.occupy();
        }
    }

    private makeWoodcutter(cit: Citizen) {
        const job = new Woodcutter(cit, this.store, this.trees);
        cit.setJob(job);
    }

    public get currentJobCount(): IJobCounts {
        return {
            farmer: this.farmers.length,
            woodcutter: this.woodcutters.length,
            miller: this.millers.length,
        };
    }

    private get woodcutters() {
        return this.cits().filter(c => c.job instanceof Woodcutter);
    }

    private get farmers() {
        return this.cits().filter(c => c.job instanceof Farmer);
    }

    private get millers() {
        return this.cits().filter(c => c.job instanceof Miller);
    }
}

const hasFree = (places: Array<{ isTaken: boolean }>) =>
    places.find(p => !p.isTaken);
