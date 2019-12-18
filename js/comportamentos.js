class Behavior {
    
    constructor(pMinSpeed, pMaxSpeed) {
        this._maxSpeed = pMaxSpeed;
        this._minSpeed = pMinSpeed;
    }

    perseguirCore(pPresa, pCacador) {
        let dx = pPresa.x - pCacador.x;
        let dy = pPresa.y - pCacador.y;
        let angle = Math.atan2(dy, dx);
        pCacador.body.setVelocity(
                Math.cos(angle) * pCacador.speed,
                Math.sin(angle) * pCacador.speed
                );
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
        super(5, 15);
    }

    agir(pEntityPresa, pEntityCacador) {
        this.perseguirCore(pEntityPresa, pEntityCacador);
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

    agir(pEntityPresa, pEntityCacador) {
        if (Phaser.Math.Distance.Between(
                pEntityCacador.x,
                pEntityCacador.y,
                pEntityPresa.x,
                pEntityPresa.y
                ) < this.distanciaPerseguir) {

            super.perseguirCore(pEntityPresa, pEntityCacador);

        } else {
            pEntityCacador.stop();
        }
    }
}