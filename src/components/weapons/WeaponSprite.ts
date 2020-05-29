import { Input, Math, Physics, Scene } from "phaser";

export interface IWeaponSpriteCfg {
    x: number;
    y: number;
    texture: string;
    name: string;
    pickUpScale: number; // todo replace by scaleWhenEquipped
}

export class WeaponSprite extends Physics.Arcade.Sprite {
    constructor(scene: Scene, cfg: IWeaponSpriteCfg) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.name = cfg.name;
        this.setScale(cfg.pickUpScale);
        this.setFlipX(true);

        this.scene.input.on("pointermove", (pointer: Input.Pointer) => {
            const pointerInWorldCoords = this.scene.cameras.main.getWorldPoint(
                pointer.x,
                pointer.y
            );
            const pos = new Math.Vector2(this.x, this.y);
            const rotation = pointerInWorldCoords.subtract(pos).angle();
            this.setRotation(rotation);
        });
    }

    public destroy() {
        this.scene.input.removeListener("pointermove", undefined, this);
        super.destroy();
    }
}
