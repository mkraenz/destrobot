import { ComponentType } from "./ComponentType";
import { Entity } from "./Entity";

export abstract class System {
    public abstract readonly requiredComponents: ComponentType[];
    public readonly entities: { [id: number]: Entity } = {};

    public abstract update(): void;

    public addEntities(entities: Entity[]) {
        const relevantEntities = entities.filter(e => this.hasComponents(e));
        relevantEntities.forEach(e => (this.entities[e.id] = e));
    }

    public hasComponents(e: Entity): boolean {
        return this.requiredComponents.every(
            requiredComp => e.components[requiredComp]
        );
    }

    /** array of entities to be updated by this system */
    public get entityArr(): Entity[] {
        return Object.values(this.entities);
    }
}
