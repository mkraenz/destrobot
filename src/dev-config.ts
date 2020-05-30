const isProd = window.location.hostname !== "localhost";
export const DEV = isProd
    ? {}
    : {
          playerInvicible: false,
          startInOptionsScene: false,
          startInMainScene: false,
          startInWinScene: false,
          enableSceneWatcher: false,
      };
