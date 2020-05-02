class Behavior {

    constructor(pMinSpeed, pMaxSpeed) {
        this._maxSpeed = pMaxSpeed;
        this._minSpeed = pMinSpeed;
    }

    chaseCore(pPresa, pCacador) {
        let dx = pPresa.x - pCacador.x;
        let dy = pPresa.y - pCacador.y;
        let angle = Math.atan2(dy, dx);
        pCacador.body.setVelocity(
                Math.cos(angle) * pCacador.speed,
                Math.sin(angle) * pCacador.speed
                );
    }

    chaseAnimation(pPresa, pCacador) {
        if (pCacador.y > pPresa.y) {
            pCacador.anims.play('zombie_1_up', true);
        } else {
            pCacador.anims.play('zombie_1_down', true);
        }
    }
    
    stopAnimation(pCacador){
        pCacador.anims.play('zombie_1_turn', true);
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
        this.chaseCore(pEntityPresa, pEntityCacador);
        this.chaseAnimation(pEntityPresa, pEntityCacador);
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

            super.chaseCore(pEntityPresa, pEntityCacador);
            this.chaseAnimation(pEntityPresa, pEntityCacador);

        } else {
            pEntityCacador.stop();
            this.stopAnimation(pEntityCacador);
        }
    }
}