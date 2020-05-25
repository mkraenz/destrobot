import { ComponentType } from "../ComponentType";
import { IComponent } from "../IComponent";

export class HealthComponent implements IComponent {
    public readonly name = ComponentType.Health;

    constructor(public health = 5) {}
}
