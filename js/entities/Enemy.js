import Entity from './Entity.js';
export default class Enemy extends Entity {

    constructor(scene, x, y, key, pSpeed) {
        super(scene, x, y, pSpeed, key);

        this.key = key;
        this._speed = pSpeed;
        this.vivo = true;
        this._behavior = null;
    }

    set behavior(comportamento) {
        this._behavior = comportamento;
    }

    get behavior() {
        return this._behavior;
    }

    act(pPrey) {
        this._behavior.act(pPrey, this);
    }

    get Key() {
        return this.key;
    }
}

