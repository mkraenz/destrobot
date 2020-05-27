export interface IDropItemEvent {
    x: number;
    y: number;
}

export interface IWeaponPickedUpEvent {
    weaponName: string;
}

export interface IEnemyKilledEvent {
    score: number;
}
