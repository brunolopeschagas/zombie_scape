import Behavior from './Behavior.js';
import Point from '../utils/Point.js';
export default class TimeBehavior extends Behavior{
    constructor(pTime, pPrey, pHunter){
        super(10, 30);
        this._time = pTime;
        this._timer;
        this._prey = pPrey;
        this._hunter = pHunter;
    }

    startToAct(){
        this._timer = this._time.addEvent({
            delay: 5000,
            callback: function () {
                this.thinkNextAction();
            },
            callbackScope: this,
            loop: true
        });
    }

    thinkNextAction(){
        
    }
    
    act(pPrey, pHunter) {
        this.chaseCore(pPrey, pHunter);
        this.chaseAnimation(pPrey, pHunter);
    }

    destroy(){
        this._timer.remove();
    }
}