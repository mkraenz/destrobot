export const Level1 = {
    map: {
        key: "map",
        tilesetName: "scifi-tileset",
        tilesetKey: "tiles",
        layers: [
            {
                layerID: "ground",
                collidePlayer: false,
                collideEnemies: false,
                collideBullets: false,
            },
            {
                layerID: "walls",
                collidePlayer: true,
                collideEnemies: true,
                collideBullets: true,
                collisionProperty: "blocking", // set as custom property in tiled
            },
        ],
    },
    weapons: [
        {
            name: "Pistol",
            damage: 5,
            bulletSpeed: 500,
            ttl: 300,
            cooldown: 500,
            texture: "pistol",
        },
        {
            name: "Machine Gun",
            damage: 1,
            bulletSpeed: 500,
            ttl: 200,
            cooldown: 100,
            texture: "machine-gun",
        },
    ],
    player: {
        x: 150,
        y: 200,
        startWeapon: "Pistol",
        health: 3,
        maxHealth: 4,
        hitInvicibilityTimeout: 800,
        hitFreezeTimeout: 100,
        texture: "player",
        scale: 2,
    },
    enemies: [
        {
            name: "robot",
            damage: 1,
            texture: "robot",
            dropFrequency: 20, // on average, one in dropFrequency kills will drop something
        },
    ],
    spawners: [
        {
            type: "robot",
            x: 250,
            y: 1275,
        },
        {
            type: "robot",
            x: 1250,
            y: 600,
        },
        {
            type: "robot",
            x: 1370,
            y: 1300,
        },
    ],
};
