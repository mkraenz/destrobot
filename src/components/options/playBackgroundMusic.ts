import { Scene } from "phaser";
import { gOptions } from "../../gOptions";

const BGM = "fight_music";

export const playBackgroundMusic = (scene: Scene) => {
    scene.sound.play(BGM, {
        loop: true,
        volume: gOptions.musicVolume, // not updating after changing in options due to sound being global
    });
    setTimeout(() => {
        // nice shift effect
        scene.sound.play(BGM, {
            loop: true,
            volume: gOptions.musicVolume, // not updating after changing in options due to sound being global
        });
    }, 16);
};
