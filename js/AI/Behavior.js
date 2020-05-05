export default class Behavior {

    constructor(pMinSpeed, pMaxSpeed) {
        this._maxSpeed = pMaxSpeed;
        this._minSpeed = pMinSpeed;
        this._chaseAngle;
    }

    chaseCore(pPrey, pHunter) {
        this.calcChaseAngle(pHunter, pPrey);
        pHunter.body.setVelocity(
            Math.cos(this._chaseAngle) * pHunter.speed,
            Math.sin(this._chaseAngle) * pHunter.speed
        );
    }

    chaseAnimation(pPrey, pHunter) {
        if (pHunter.y > pPrey.y) {
            pHunter.anims.play('zombie_1_up', true);
        } else {
            pHunter.anims.play('zombie_1_down', true);
        }
    }

    calcChaseAngle(pHunter, pPrey) {
        this._chaseAngle = Math.atan2(
            pPrey.y - pHunter.y,
            pPrey.x - pHunter.x
        );
    }

    getDistanceBetween(pHunter, pPrey) {
        return Phaser.Math.Distance.Between(
            pHunter.x,
            pHunter.y,
            pPrey.x,
            pPrey.y);
    }

    idle(pCacador) {
        pCacador.anims.play('zombie_1_turn', true);
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    get minSpeed() {
        return this._minSpeed;
    }
}