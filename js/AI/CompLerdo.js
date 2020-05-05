import Behavior from './Behavior.js';
export default class CompLerdo extends Behavior {

    constructor() {
        super(5, 15);
    }

    act(pPrey, pHunter) {
        this.chaseCore(pPrey, pHunter);
        this.chaseAnimation(pPrey, pHunter);
    }
}