import { ActiveComponent } from "../components/ActiveComponent";
import { HealthComponent } from "../components/HealthComponent";
import { ComponentType } from "../ComponentType";
import { Entity } from "../Entity";
import { System } from "../System";

export class HealthSystem extends System {
    public requiredComponents = [ComponentType.Health, ComponentType.Active];

    public get entityArr() {
        return super.entityArr as Array<
            Entity & {
                components: {
                    [ComponentType.Health]: HealthComponent;
                    [ComponentType.Active]: ActiveComponent;
                };
            }
        >;
    }

    public update(): void {
        this.entityArr
            .filter(e => e.components[ComponentType.Health].health < 0)
            .forEach(e => (e.components[ComponentType.Active].active = false));
    }
}
