import { random } from "lodash";
import { GameObjects, Math, Physics, Scene } from "phaser";
import { IEnemyKilledEvent } from "../events/Events";
import { EventType } from "../events/EventType";
import { gOptions } from "../gOptions";
import { Color, toHex } from "../styles/Color";
import { IPoint } from "../utils/IPoint";
import { IWeapon } from "./IWeapon";

export interface IEnemyConfig {
    name: string;
    texture: string;
    scale: number;
    health: number;
    dropFrequency: number;
    speed: number;
    damage: number;
    score: number;
    tint?: string;
    attackRange: number;
    weapon?: string;
}

type Vec = Math.Vector2;
const Vec = Math.Vector2;

export class Enemy extends Physics.Arcade.Sprite {
    public health: number;
    public readonly damage: number;
    private dropFrequency: number;
    private speed: number;
    private score: number;
    private baseTint?: string;
    private attackRange: number;

    constructor(
        scene: Scene,
        private target: GameObjects.Sprite,
        cfg: IEnemyConfig & IPoint,
        private weapon?: IWeapon & { getBulletsLeft(): number }
    ) {
        super(scene, cfg.x, cfg.y, cfg.texture);
        this.name = cfg.name;
        this.health = cfg.health;
        this.dropFrequency = cfg.dropFrequency;
        this.speed = cfg.speed;
        this.damage = cfg.damage;
        this.score = cfg.score;
        this.attackRange = cfg.attackRange;
        this.setScale(cfg.scale);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if (cfg.tint) {
            this.baseTint = cfg.tint;
            this.maybeApplyBaseTint();
        }
    }

    public enableDarkMode() {
        this.setPipeline("Light2D");
    }

    public create() {
        this.setCollideWorldBounds(true);
        this.setBounce(10);
    }

    public move(to: GameObjects.Sprite) {
        const Vector = Phaser.Math.Vector2;
        const location = new Vector(this.x, this.y);
        const goal = new Vector(to.x, to.y);
        const direction = goal
            .add(location.negate())
            .normalize()
            .scale(this.speed);
        this.setVelocity(direction.x, direction.y);
        // TODO: consider using this.scene.physics.moveToObject(...)
    }

    public update() {
        if (this.health <= 0) {
            this.die();
        }
        if (this.isInAttackRange()) {
            this.body.stop();
            this.attack();
        } else {
            this.move(this.target);
        }
    }

    public die() {
        if (this.isRandomDrop()) {
            this.scene.events.emit("drop-item", { x: this.x, y: this.y });
        }
        const enemyKilledEventData: IEnemyKilledEvent = {
            score: this.score,
            name: this.name,
        };
        this.scene.events.emit(EventType.EnemyKilled, enemyKilledEventData);
        this.setActive(false);
        this.disableBody(true);
        this.setVisible(false);
        this.scene.sound.play("enemy-die", { volume: 5 * gOptions.sfxVolume });
    }

    public takeDamage(damage: number) {
        this.health -= damage;
        this.setTint(toHex(Color.Red));
        this.scene.sound.play("enemy-hit", { volume: gOptions.sfxVolume });
        setTimeout(() => {
            this.clearTint();
            this.maybeApplyBaseTint();
        }, 200);
    }

    private attack() {
        if (!this.weapon) {
            return;
        }
        if (this.weapon.getBulletsLeft() === 0) {
            return this.weapon.reload();
        }
        this.fire();
    }

    private fire() {
        if (!this.weapon) {
            return;
        }
        const { x: tx, y: ty } = this.target;
        const { x, y } = this;
        const targetPos = new Vec(tx, ty);
        const pos = new Vec(x, y);
        const dir = targetPos.subtract(pos).normalize();
        this.weapon.fire(pos, dir);
    }

    private isInAttackRange() {
        const dist = this.dist();
        return dist < this.attackRange;
    }

    private dist(other: IPoint = this.target) {
        return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
    }

    private isRandomDrop() {
        // _.random(n) emits numbers from 0 to n-1.
        // We want that a drop occurs once in dropFrequency many cases, thus the -1.
        // For example, dropFrequency=1 means every kill will drop something.
        return random(this.dropFrequency - 1) === this.dropFrequency - 1;
    }

    private maybeApplyBaseTint() {
        if (this.baseTint) {
            this.setTint(toHex(this.baseTint));
        }
    }
}
