class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, speed, key) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this._speed = speed;
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
    
    get speed(){
        return this._speed;
    }
}

