import { Color } from "../styles/Color";

export const Level3 = {
    name: "3",
    mode: {
        dark: false,
    },
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
            damage: 3,
            bulletSpeed: 500,
            ttl: 300,
            cooldown: 300,
            texture: "pistol",
            scale: 1,
            pickUpScale: 0.5,
            bulletTexture: "bullet2",
            magazine: 8,
            reloadTime: 500,
            fireSoundKey: "sniper-rifle-shot",
        },
    ],
    player: {
        x: 250,
        y: 500,
        health: 4,
        maxHealth: 4,
        hitInvicibilityTimeout: 800,
        hitFreezeTimeout: 100,
        texture: "player",
        scale: 2,
        speed: 300,
    },
    enemyWeapons: [
        {
            name: "Pistol",
            damage: 1,
            bulletSpeed: 100,
            ttl: 2000,
            cooldown: 500,
            texture: "pistol",
            scale: 1,
            pickUpScale: 0.5,
            bulletTexture: "bullet2",
            magazine: 8,
            reloadTime: 1000,
            fireSoundKey: "sniper-rifle-shot",
        },
        {
            name: "Sniper Rifle",
            damage: 2,
            bulletSpeed: 200,
            ttl: 3000,
            cooldown: 1000,
            texture: "sniper-rifle",
            scale: 1,
            pickUpScale: 0.5,
            bulletTexture: "bullet2",
            magazine: 1,
            reloadTime: 3000,
            fireSoundKey: "sniper-rifle-shot",
        },
    ],
    enemies: [
        {
            name: "RoBot",
            damage: 1, // touch damage
            texture: "robot",
            dropFrequency: 5, // on average, one in dropFrequency kills will drop something
            health: 5,
            speed: 125,
            scale: 1,
            score: 10,
            attackRange: 0,
        },
        {
            name: "RangeBot",
            damage: 0,
            texture: "robot",
            dropFrequency: 3, // on average, one in dropFrequency kills will drop something
            health: 5,
            speed: 200,
            scale: 1,
            score: 10,
            attackRange: 200,
            weapon: "Pistol",
            tint: Color.Green,
        },
        {
            name: "SnipoBot",
            damage: 0,
            texture: "robot",
            dropFrequency: 1, // on average, one in dropFrequency kills will drop something
            health: 1,
            speed: 100,
            scale: 1,
            score: 30,
            attackRange: 600,
            weapon: "Sniper Rifle",
            tint: Color.Red,
        },
        {
            name: "FastBot2k",
            damage: 1,
            texture: "robot",
            dropFrequency: 5, // on average, one in dropFrequency kills will drop something
            health: 1,
            speed: 220,
            scale: 1,
            score: 10,
            tint: "#0000FF", // blue
            attackRange: 0, // = max distance to attack the player
        },
        {
            name: "MegaBot",
            damage: 2,
            texture: "robot",
            dropFrequency: 2,
            health: 20,
            speed: 50,
            scale: 3,
            score: 30,
            attackRange: 0,
        },
        {
            name: "DestroBot",
            damage: 3,
            texture: "robot",
            dropFrequency: 1,
            health: 30,
            speed: 150,
            scale: 4,
            score: 200,
            tint: "#FF8D13",
            attackRange: 0,
        },
    ],
    spawners: [
        {
            type: "SnipoBot",
            x: 250,
            y: 310,
            enemiesPerWave: 1,
            waveTimeout: 5000,
            maxConcurrentEnemies: 1,
        },
    ],
    goals: {
        killEnemies: [
            {
                type: "SnipoBot",
                amount: 2,
            },
        ],
    },
};
