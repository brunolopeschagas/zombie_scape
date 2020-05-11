import Behavior from './Behavior.js';
import Point from '../utils/Point.js';
import RandomGen from '../utils/RandomGen.js';
export default class CompPerseguirPlus extends Behavior {

    constructor(pChaseDistance) {
        super(10, 30);
        this._chaseDistance = pChaseDistance;
        this._intermediatePointToChase = new Point(0,0);
        this._stepsTaken = 0;
        this._MAX_STEPS_TO_CHANGE_DIRECTION = 500; 
    }

    act(pPrey, pHunter) {
        // console.log('hunter steps' + this._stepsTaken);
      
        if (this.getDistanceBetween(pHunter, pPrey) < this._chaseDistance) {
            this.chaseCore(pPrey, pHunter);
        } else {
            if(this.howMuchWalked() < 0){
                this.changeDestiny();
            }
            this.chaseCore(this._intermediatePointToChase, pHunter);
        }
        this.takeAStep();
        this.chaseAnimation(pPrey, pHunter);
    }
    
    howMuchWalked(){
        return this._MAX_STEPS_TO_CHANGE_DIRECTION - this._stepsTaken;
    }

    changeDestiny(){
        this._intermediatePointToChase = new Point(
            RandomGen.getRandomIntBetween(0, 800),
            RandomGen.getRandomIntBetween(0, 800)
            );
    }

    takeAStep(){
        this._stepsTaken++;
    }

}