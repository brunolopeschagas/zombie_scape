import {ZOMBIE_ANIM_KEYS} from '../animations/ZombieAnimationKeys.js';
export default class Behavior {

    constructor(pMinSpeed, pMaxSpeed) {
        this._maxSpeed = pMaxSpeed;
        this._minSpeed = pMinSpeed;
        this._chaseAngle;
        this._actionInterval;
    }

    act(prey, hunter){}

    chaseCore(pPrey, pHunter) {
        this.calcChaseAngle(pHunter, pPrey);
        pHunter.body.setVelocity(
            Math.cos(this._chaseAngle) * pHunter.speed,
            Math.sin(this._chaseAngle) * pHunter.speed
        );
    }

    calcChaseAngle(pHunter, pPrey) {
        this._chaseAngle = Math.atan2(
            pPrey.y - pHunter.y,
            pPrey.x - pHunter.x
        );
    }

    chaseAnimation(pPrey, pHunter) {
        if (pHunter.y > pPrey.y) {
            pHunter.anims.play(ZOMBIE_ANIM_KEYS.UP, true);
        } else {
            pHunter.anims.play(ZOMBIE_ANIM_KEYS.DOWN, true);
        }
    }

    getDistanceBetween(pHunter, pPrey) {
        return Phaser.Math.Distance.Between(
            pHunter.x,
            pHunter.y,
            pPrey.x,
            pPrey.y);
    }

    idle(pCacador) {
        pCacador.anims.play(ZOMBIE_ANIM_KEYS.IDLE, true);
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    get minSpeed() {
        return this._minSpeed;
    }

    get actionInterval(){
        return this._actionInterval;
    }
}