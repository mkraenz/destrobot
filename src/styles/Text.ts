import { GameObjects } from "phaser";
import { Color } from "./Color";

type Style = Partial<GameObjects.TextStyle>;

export const TextConfig: { [key: string]: Style } = {
    title: {
        fontFamily: "Android7",
        fontSize: "118px",
        color: Color.White,
    },
    version: {
        fontFamily: "Android7",
        color: Color.White,
    },
    xl: {
        fontFamily: "Android7",
        fontSize: "32px",
        color: Color.White,
    },
    lg: {
        fontFamily: "Android7",
        fontSize: "20px",
        color: Color.White,
    },
    md: {
        fontFamily: "Android7",
        fontSize: "16px",
        color: Color.White,
    },
    sm: {
        fontFamily: "Android7",
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
