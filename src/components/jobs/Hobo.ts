import { IJob } from "./IJob";

export class Hobo implements IJob {
    public static instanceOf(x: IJob): x is Hobo {
        return x instanceof Hobo;
    }

    public update() {
        // being idle
    }

    public stop() {
        // was idle all along
    }
}
