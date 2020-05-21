import { GameObjects } from "phaser";

export class DebugHover {
    constructor(
        target: GameObjects.Image | GameObjects.Text | GameObjects.Sprite
    ) {
        // tslint:disable-next-line: no-console
        target.on("pointerout", () => console.log("out"));
        // tslint:disable-next-line: no-console
        target.on("pointerover", () => console.log("over"));
        if (isSprite(target)) {
            const printAnim = () =>
                // tslint:disable-next-line: no-console
                console.log("current anim", target.anims.currentAnim.key);
            target.on("pointerout", printAnim);
            target.on("pointerover", printAnim);
        }
    }
}

const isSprite = (x: any): x is GameObjects.Sprite =>
    x instanceof GameObjects.Sprite;
