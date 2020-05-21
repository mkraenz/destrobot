import { IPoint } from "./IPoint";

interface IComponent {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}

/** Get the center of a GameObject with origin=(0,0) */
export const atCenter = ({
    x,
    y,
    width,
    height,
    scale,
}: IComponent): IPoint => {
    return { x: x + (width * scale) / 2, y: y + (height * scale) / 2 };
};

/** Get the left end (x) and center (y) of a GameObject with origin=(0.5, 0.5) */
export const atTopLeft = ({
    x,
    y,
    width,
    height,
    scale,
}: IComponent): IPoint => {
    return { x: x - (width * scale) / 2, y: y - (height * scale) / 2 };
};
