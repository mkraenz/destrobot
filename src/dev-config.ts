const isProd = window.location.hostname !== "localhost";
export const DEV = isProd
    ? {}
    : {
          playerInvicible: false,
      };
