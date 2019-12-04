class GameHud {

    constructor(timeElapsedText, staminaText) {
        this._timeElapsedText = timeElapsedText;
        this._staminaText = staminaText;

        this._timeElapsedText.setScrollFactor(0);
        this._timeElapsedText.setDepth(11);
        this._staminaText.setScrollFactor(0);
        this._staminaText.setDepth(11);
    }

    showTime(timeElapsedText) {
        this._timeElapsedText.setText('Time: ' + timeElapsedText.toFixed(3));
    }
    
    showStamina(staminaText) {
        this._staminaText.setText('Stamina: ' + staminaText.toFixed(1));
    }

    get timeElapsedText() {
        return this._timeElapsedText;
    }

    get staminaText() {
        return this._staminaText;
    }

}
