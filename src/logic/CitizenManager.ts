import { Citizen } from "../components/Citizen";

const TICK_TIME_IN_MS = 15000;

export class CitizenManager {
    private tickTimer = 0;

    constructor(
        private scene: { setCitizen: (cits: Citizen[]) => void },
        private cits: () => Citizen[]
    ) {}

    public get citizenCount() {
        return this.cits().length;
    }

    public update(delta: number) {
        this.tickTimer += delta;
        if (this.tickTimer > TICK_TIME_IN_MS) {
            this.tickTimer = this.tickTimer % TICK_TIME_IN_MS;
            const dyingCits: Citizen[] = [];
            this.cits().forEach(c => {
                const hasNoFood = !c.hasFood();
                if (hasNoFood) {
                    dyingCits.push(c);
                } else {
                    c.eat();
                }
            });
            const remainingCits = this.cits().filter(
                c => !dyingCits.includes(c)
            );
            this.scene.setCitizen(remainingCits);
            dyingCits.forEach(c => c.die());
        }
    }
}
