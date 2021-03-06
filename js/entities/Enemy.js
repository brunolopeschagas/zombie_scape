import Entity from './Entity.js';
export default class Enemy extends Entity {

    constructor(scene, x, y, key, pSpeed) {
        super(scene, x, y, pSpeed, key);

        this.key = key;
        this._speed = pSpeed;
        this.vivo = true;
        this._comportamento = null;
    }

    set comportamento(comportamento) {
        this._comportamento = comportamento;
    }

    get comportamento() {
        return this._comportamento;
    }

    agir(pEntityPresa, pEntityCacador) {
        this._comportamento.agir(pEntityPresa, pEntityCacador);
    }

    get Key() {
        return this.key;
    }
}

