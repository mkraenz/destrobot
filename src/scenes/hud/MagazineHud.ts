import { GameObjects, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { TextConfig } from "../../styles/Text";

interface IWeapon {
    magazine: number;
    bulletsLeft: number;
    texture: string;
    bulletTexture: string;
}

export class MagazineHud extends Scene {
    private weapon!: IWeapon; // this scene gets only shown after a weapon-changed event has triggered
    private bulletText?: GameObjects.Text;

    constructor(key = "MagazineHud") {
        super({ key });
    }

    public create() {
        const mainScene = this.scene.get("MainScene");
        mainScene.events.on(
            EventType.WeaponChanged,
            (data: { weapon: IWeapon }) => {
                this.setWeapon(data.weapon);
                this.redraw();
            }
        );
        mainScene.events.on(EventType.WeaponReloaded, () => this.reload());
        mainScene.events.on(EventType.WeaponFired, () => this.fire());
    }

    private redraw() {
        const { width, height } = this.scale;
        if (!this.bulletText) {
            this.bulletText = this.add
                .text(width - 50, height - 50, "", TextConfig.lg)
                .setOrigin(1, 0.5);
        }
        this.bulletText.setText(
            `${this.weapon.bulletsLeft}/${this.weapon.magazine}`
        );
    }

    private setWeapon(weapon: IWeapon) {
        this.weapon = weapon;
        this.redraw();
    }

    private reload() {
        this.weapon.bulletsLeft = this.weapon.magazine;
        this.redraw();
    }

    private fire() {
        this.weapon.bulletsLeft--;
        this.redraw();
    }
}
