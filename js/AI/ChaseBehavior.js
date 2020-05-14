import Behavior from './Behavior.js';
export default class ChaseBehavior extends Behavior {

    constructor(pChaseDistance) {
        super(40, 60);
        this._chaseDistance = pChaseDistance;
        this._actionInterval = 1000;
    }

    act(pPrey, pHunter) {
        if (this.getDistanceBetween(pHunter, pPrey) < this._chaseDistance) {
            this.chaseCore(pPrey, pHunter);
            this.chaseAnimation(pPrey, pHunter);
        } else {
            pHunter.stop();
            this.idle(pHunter);
        }
    }

}