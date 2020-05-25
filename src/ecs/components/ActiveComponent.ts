import { ComponentType } from "../ComponentType";
import { IComponent } from "../IComponent";

export class ActiveComponent implements IComponent {
    public name = ComponentType.Active;

    constructor(public active = true) {}
}
