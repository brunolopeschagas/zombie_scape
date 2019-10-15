class Player extends Entity {

    constructor(scene, x, y, key, type) {
        super(scene, x, y, key, "Player");

        this.virado = false;
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

}
