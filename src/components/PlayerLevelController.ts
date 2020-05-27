import { Scene } from "phaser";
import { IEnemyKilledEvent } from "../events/Events";
import { EventType } from "../events/EventType";
import { PlayerMovementController } from "./PlayerMovementController";

const SPEED_UP_FACTOR = 1.3;

export class PlayerLevelController {
    private score = 0;

    constructor(
        scene: Scene,
        private movementController: PlayerMovementController
    ) {
        scene.events.on(EventType.EnemyKilled, (_: IEnemyKilledEvent) => {
            this.score += 10;
            this.maybeLevelUp();
        });
    }

    private maybeLevelUp() {
        if (this.score % 100 === 0) {
            this.movementController.setSpeed(
                this.movementController.getSpeed() * SPEED_UP_FACTOR
            );
        }
    }
}
