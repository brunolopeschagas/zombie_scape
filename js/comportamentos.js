class ComportamentoLerdo {
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

class ComportamentoLerdo2 {

    constructor(pDistanciaPerseguir) {
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
        }
    }
}

