import Entity from './Entity.js';
export default class Player extends Entity {

    constructor(scene, x, y, speed, key) {
        super(scene, x, y, speed, key);

        this.key = key;
        this._estamina = 100;
        this._staminaDecrease = 0.1;
        this._hydrationDecrease = 0.1;
        this._hydration = 100;
        this._alive = true;
        this._speed = speed;
        this.body.setSize(16, 16);
        this.body.setOffset(8, 28);
    }

    lostStamina() {
        return this._estamina -= this._staminaDecrease;
    }

    dehydration() {
        this._hydration -= this._hydrationDecrease;
    }
    
    get Key() {
        return this.key;
    }

    get hydration() {
        return this._hydration;
    }

    get estamina() {
        return this._estamina;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }
    
    get alive(){
        return this._alive;
    }
    
    die(){
        this._alive = false;
    }
    
}
