import { Types } from "phaser";

export type ScalableTweenBuilderConfig = Types.Tweens.TweenBuilderConfig & {
    scaleX: number;
    scaleY: number;
};
