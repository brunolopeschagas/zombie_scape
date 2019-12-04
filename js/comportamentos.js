class Behavior {
    constructor(pMinSpeed, pMaxSpeed) {
        this._maxSpeed = pMaxSpeed;
        this._minSpeed = pMinSpeed;
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    get minSpeed() {
        return this._minSpeed;
    }

}

class CompLerdo extends Behavior {

    constructor() {
        super(5, 25);
    }

    perseguir(pEntityPresa, pEntityCacador) {
        let dx = pEntityPresa.x - pEntityCacador.x;
        let dy = pEntityPresa.y - pEntityCacador.y;
        let angle = Math.atan2(dy, dx);
        pEntityCacador.body.setVelocity(
                Math.cos(angle) * pEntityCacador.velocidade,
                Math.sin(angle) * pEntityCacador.velocidade
                );
        if (this.x < pEntityPresa.x) {
            //this.angle -= 5;
            //vira para direita
        } else {
//            this.angle += 5;
            //vira para esquerda
        }
    }
}

class CompPerseguir extends Behavior {

    constructor(pDistanciaPerseguir) {
        super(40, 60);
        this.distanciaPerseguir = pDistanciaPerseguir;
    }

    perseguir(pEntityPresa, pEntityCacador) {
        if (Phaser.Math.Distance.Between(
                pEntityCacador.x,
                pEntityCacador.y,
                pEntityPresa.x,
                pEntityPresa.y
                ) < this.distanciaPerseguir) {

            let dx = pEntityPresa.x - pEntityCacador.x;
            let dy = pEntityPresa.y - pEntityCacador.y;
            let angle = Math.atan2(dy, dx);
            pEntityCacador.body.setVelocity(
                    Math.cos(angle) * pEntityCacador.velocidade,
                    Math.sin(angle) * pEntityCacador.velocidade
                    );
        } else {
            pEntityCacador.body.setVelocity(0);
        }
    }
}


