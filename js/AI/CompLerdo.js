import Behavior from './Behavior.js';
export default class CompLerdo extends Behavior {

    constructor() {
        super(5, 15);
    }

    agir(pEntityPresa, pEntityCacador) {
        this.chaseCore(pEntityPresa, pEntityCacador);
        this.chaseAnimation(pEntityPresa, pEntityCacador);
    }
}