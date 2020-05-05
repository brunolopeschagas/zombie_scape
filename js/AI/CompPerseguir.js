import Behavior from './Behavior.js';
export default class CompPerseguir extends Behavior {

    constructor(pChaseDistance) {
        super(40, 60);
        this._chaseDistance = pChaseDistance;
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