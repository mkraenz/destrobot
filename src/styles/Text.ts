import { GameObjects } from "phaser";
import { Color } from "./Color";

type Style = Partial<GameObjects.TextStyle>;

const DEFAULT_FONT = "Android7";

export const TextConfig: { [key: string]: Style } = {
    title: {
        fontFamily: DEFAULT_FONT,
        fontSize: "118px",
        color: Color.White,
    },
    version: {
        fontFamily: DEFAULT_FONT,
        color: Color.White,
    },
    xxl: {
        fontFamily: DEFAULT_FONT,
        fontSize: "64px",
        color: Color.White,
    },
    xl: {
        fontFamily: DEFAULT_FONT,
        fontSize: "32px",
        color: Color.White,
    },
    lg: {
        fontFamily: DEFAULT_FONT,
        fontSize: "20px",
        color: Color.White,
    },
    md: {
        fontFamily: DEFAULT_FONT,
        fontSize: "16px",
        color: Color.White,
    },
    sm: {
        fontFamily: DEFAULT_FONT,
        fontSize: "12px",
        color: Color.White,
    },
    debug: {
        fontFamily: "Courier",
        fontSize: "12px",
        color: "#00ff00",
    },
};

export const setDefaultTextStyle = (text: GameObjects.Text) =>
    text.setStyle(TextConfig.lg).setColor(Color.Black);
