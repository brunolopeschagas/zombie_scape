export default class Behavior {

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