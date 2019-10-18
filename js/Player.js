class Player extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.key = key;
        this.estamina = 100;
        this.hidatacao = 100;
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
    stop() {
        this.body.setVelocity(0);
    }

    get Key() {
        return this.key;
    }

    ganharEstamina(pQuantidade) {
        this.estamina += pQuantidade;
    }

    ganharHidratacao(pQuantidade) {
        this.hidatacao += pQuantidade;
    }

    get Hidratacao() {
        return this.hidratacao;
    }

    get Estamina() {
        return this.estamina;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }
}
