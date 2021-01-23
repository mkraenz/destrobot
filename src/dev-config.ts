import { Level1 } from "./levels/Level1";

const isProd = window.location.hostname !== "localhost";
export const DEV = isProd
    ? {}
    : {
          startLevel: Level1,
          playerInvicible: false,
          startInOptionsScene: false,
          startInMainScene: false,
          startInWinScene: false,
          enableSceneWatcher: false,
          enemy: {
              disableMove: false,
              disableAttack: false, // touch damage still applies
          },
          showDebugGui: false,
      };
