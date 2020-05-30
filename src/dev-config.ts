const isProd = window.location.hostname !== "localhost";
export const DEV = isProd
    ? {}
    : {
          debug: true, // always true
          playerInvicible: true,
          skipTitle: false,
          startInWinScene: false,
          enableSceneWatcher: false,
      };
