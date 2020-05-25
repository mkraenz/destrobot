import { Entity } from "./Entity";
import { System } from "./System";

export class World {
    public readonly entities: { [id: string]: Entity } = {};
    public readonly systems: System[] = [];

    public addEntity(e: Entity) {
        this.entities[e.id] = e;
        this.systems.filter(s => s.hasComponents(e));
    }

    public registerSystem(s: System) {
        this.systems.push(s);
    }

    public update() {
        this.systems.forEach(s => s.update());
    }
}
