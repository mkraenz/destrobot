export enum Color {
    Black = "#000000",
    White = "#ffffff",
    DarkGrey = "#222222",
    Red = "#f80606",
    Green = "#0db80b",
    Peach = "#ffe5b4",
    Brown = "#965C29",
}

const to0x = (color: Color | string) => color.replace("#", "0x");
export const toHex = (color: Color | string) => parseInt(to0x(color), 16);
