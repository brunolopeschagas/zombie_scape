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

