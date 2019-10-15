class Escada extends Entity {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.ALTURA_INICIAL = 150;
        this.velocidadeVertical = 10;

        this.states = {
            DESCER: "DESCER",
            SUBIR: "SUBIR"
        };
        this.state = this.states.DESCER;
    }

    update() {

    }

    mudarEstado() {
        if (this.state === this.states.SUBIR) {
            this.state = this.states.DESCER;
        } else {
            this.state = this.states.SUBIR;
        }
    }
    
    getAlturaInicial(){
        return this.ALTURA_INICIAL;
    }

}
