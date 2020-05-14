import Behavior from './Behavior.js';
export default class SlowChaseBehavior extends Behavior {

    constructor() {
        super(5, 15);
        this._actionInterval = 5000;
    }

    act(pPrey, pHunter) {
        this.chaseCore(pPrey, pHunter);
        this.chaseAnimation(pPrey, pHunter);
    }
}