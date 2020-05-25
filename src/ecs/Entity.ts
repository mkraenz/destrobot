import { Component } from "./Component";
import { ComponentType } from "./ComponentType";

let globalId = 0;

export class Entity {
    public id = globalId++;
    public components: Partial<{ [key in ComponentType]: Component }> = {};

    public addComponent(component: Component) {
        this.components[component.name] = component;
    }

    public addComponents(components: Component[]) {
        components.forEach(c => (this.components[c.name] = c));
    }

    public removeComponent(component: ComponentType | Component) {
        if (typeof component === "string") {
            delete this.components[component];
        } else {
            delete this.components[component.name];
        }
    }
}
