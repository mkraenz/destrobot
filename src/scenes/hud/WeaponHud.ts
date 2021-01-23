import { GameObjects, Scene } from "phaser";
import { EventType } from "../../events/EventType";
import { TextConfig } from "../../styles/Text";
import { SceneKey } from "../SceneKeys";

interface IWeapon {
    magazine: number;
    texture: string;
    bulletTexture: string;
}

export class WeaponHud extends Scene {
    private weapon!: IWeapon; // this scene gets only shown after a weapon-changed event has triggered
    private bulletText?: GameObjects.Text;
    private bulletsLeft: number = 0;
    private weaponImage?: GameObjects.Image;

    constructor(key = SceneKey.WeaponHud) {
        super({ key });
    }

    public create() {
        const mainScene = this.scene.get(SceneKey.Main);
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
                .text(width - 5, height - 50, "", TextConfig.lg)
                .setOrigin(1, 1);
        }
        this.bulletText.setText(`${this.bulletsLeft}/${this.weapon.magazine}`);
        if (!this.weaponImage) {
            this.weaponImage = this.add
                .image(width - 5, height - 5, this.weapon.texture)
                .setOrigin(1);
        }
        this.weaponImage.setTexture(this.weapon.texture);
    }

    private setWeapon(weapon: IWeapon) {
        this.weapon = weapon;
        this.bulletsLeft = weapon.magazine;

        this.redraw();
    }

    private reload() {
        this.bulletsLeft = this.weapon.magazine;
        this.redraw();
    }

    private fire() {
        this.bulletsLeft--;
        this.redraw();
    }
}
