const isProd = window.location.hostname !== "localhost";
export const DEV = isProd
    ? {}
    : {
          playerInvicible: true,
          skipTitle: false,
          startInWinScene: false,
      };
