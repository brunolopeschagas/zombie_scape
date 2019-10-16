class Player extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.key = key;
        this.velocidade = 100;
        this.vivo = true;
    }

    moveLeft() {
        this.body.setVelocityX(-this.velocidade);
    }
    moveRight() {
        this.body.setVelocityX(this.velocidade);
    }
    moveUp() {
        this.body.setVelocityY(-this.velocidade);
    }
    moveDown() {
        this.body.setVelocityY(this.velocidade);
    }
    stop(){
        this.body.setVelocity(0);
    }
    
    get Key(){
        return this.key;
    }

}
