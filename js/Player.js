class Player extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.key = key;
        this._estamina = 100;
        this._stamina_decrease = 0.1;
        this._hydration_decrease = 0.1;
        this._hydration = 100;
        this._speed = 100;
        this._alive = true;
    }

    moveLeft() {
        this.body.setVelocityX(-this._speed);
    }
    moveRight() {
        this.body.setVelocityX(this._speed);
    }
    moveUp() {
        this.body.setVelocityY(-this._speed);
    }
    moveDown() {
        this.body.setVelocityY(this._speed);
    }
    stop() {
        this.body.setVelocity(0);
    }

    lostStamina() {
        return this._estamina -= this._stamina_decrease;
    }

    dehydration() {
        this._hydration -= this._hydration_decrease;
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
    
    morrer(){
        this._alive = false;
    }
    
}
