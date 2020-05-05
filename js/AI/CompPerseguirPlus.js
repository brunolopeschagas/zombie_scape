import Behavior from './Behavior.js';
export default class CompPerseguirPlus extends Behavior {

    constructor(pChaseDistance) {
        super(40, 60);
        this.chaseDistance = pChaseDistance;
    }

    act(pPrey, pHunter) {
      
        if (this.getDistanceBetween(pHunter, pPrey) < this.chaseDistance) {
            pHunter.body.setVelocity(50,10);
            this.chaseAnimation(pPrey, pHunter);
        } else {
            pHunter.stop();
            this.idle(pHunter);
        }
    }


}