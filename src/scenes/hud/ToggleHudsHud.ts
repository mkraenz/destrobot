import { Scene } from "phaser";
import { ToggleVisibilityButton } from "../../components/hud/ToggleVisibilityButton";

export class ToggleHudsHud extends Scene {
    constructor(key = "ToggleHudsHud") {
        super(key);
    }

    public create() {
        const resourceBar = this.scene.get("ResourceBarHud");
        new ToggleVisibilityButton(this, 637, 14, resourceBar);

        const jobsHud = this.scene.get("JobsHud");
        new ToggleVisibilityButton(this, 995, 277, jobsHud);

        const buildingSelectionHud = this.scene.get("BuildingSelectionHud");
        new ToggleVisibilityButton(this, 283, 665, buildingSelectionHud);
    }
}
