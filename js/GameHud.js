class GameHud {

    constructor(pScene) {
        this._scene = pScene;
        
        this._timeElapsedText = this._scene.add.text(30, 10, '', {fontSize: '32px', fill: '#000'});
        this._staminaText = this._scene.add.text(30, 40, '', {fontSize: '32px', fill: '#000'});

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
