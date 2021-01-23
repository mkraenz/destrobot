import { IPoint } from "./IPoint";

const Vec = Phaser.Math.Vector2;
type Vec = typeof Vec;

export const vec = (p: IPoint) => new Vec(p.x, p.y);

export const pos = vec; // carries semantic meaning

/** @returns unit vector in the direction from {from} to {to} */
export const dir = (from: IPoint, to: IPoint) => {
    return vec(to)
        .subtract(vec(from))
        .normalize();
};
