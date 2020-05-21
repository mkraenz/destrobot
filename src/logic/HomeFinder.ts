import { Citizen } from "../components/Citizen";
import { House } from "../utils/Entity";

export class HomeFinder {
    constructor(private homes: () => House[], private cits: () => Citizen[]) {}

    public assignFreeHomes() {
        const homeless = this.cits().filter(c => !c.home);
        homeless.forEach(cit => {
            const freeHome = this.findFreeHouse();
            if (freeHome) {
                cit.home = freeHome;
                freeHome.citizen = cit;
            }
        });
    }

    private findFreeHouse() {
        return this.homes().find(h => !h.citizen);
    }
}
