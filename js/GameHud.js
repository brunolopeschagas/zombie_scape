class GameHud {

    constructor(timeElapsedText, staminaText) {
        this._timeElapsedText = timeElapsedText;
        this._staminaText = staminaText;
        
        this._timeElapsedText.setScrollFactor(0);
        this._timeElapsedText.setDepth(11);
        this._staminaText.setScrollFactor(0);
        this._staminaText.setDepth(11);
    }

    get timeElapsedText() {
        return this._timeElapsedText;
    }
    
    set timeElapsedText(timeElapsedText){
        this._timeElapsedText.setText('Time: ' + timeElapsedText.toFixed(3));
    }
    
    get staminaText() {
        return this._staminaText;
    }
    
    set staminaText(staminaText){
        this._staminaText.setText('Stamina: ' + staminaText.toFixed(1));
    }
}
