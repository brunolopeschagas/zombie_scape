import Behavior from './Behavior.js';
export default class CompPerseguir extends Behavior {

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