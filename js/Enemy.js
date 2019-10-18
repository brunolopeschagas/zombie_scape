class Enemy extends Entity {

    constructor(scene, x, y, key, pVelocidade) {
        super(scene, x, y, key);

        this.key = key;
        this.velocidade = pVelocidade;
        this.vivo = true;
        this._comportamento = null;
    }
    
    set comportamento(comportamento){
        this._comportamento = comportamento;
    }
    
    get comportamento(){
        return this._comportamento;
    }
    
    perseguir(pEntityPresa, pEntityCacador){
        this._comportamento.perseguir(pEntityPresa, pEntityCacador);
    }

    get Key() {
        return this.key;
    }

}

class Strategy1{
     perseguir(pEntityPresa, pEntityCacador) {
        var dx = pEntityPresa.x - pEntityCacador.x;
        var dy = pEntityPresa.y - pEntityCacador.y;
        var angle = Math.atan2(dy, dx);
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

class Strategy2{
    perseguir(pEntityPresa, pEntityCacador) {
        var dx = pEntityPresa.x - pEntityCacador.x;
        var dy = pEntityPresa.y - pEntityCacador.y;
        var angle = Math.atan2(dy, dx);
        pEntityCacador.body.setVelocity(
                Math.cos(angle) * pEntityCacador.velocidade * 5,
                Math.sin(angle) * pEntityCacador.velocidade * 5
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
