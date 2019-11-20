class GameHud {

    constructor() {
        this._timeElapsedText;
    }

    get timeElapsedText() {
        return this._timeElapsedText;
    }
    
    set timeElapsedText(timeElapsedText){
        this._timeElapsedText = timeElapsedText;
    }
    
    setTimeElapsedText(timeElapsedText){
        this._timeElapsedText.setText('time: ' + timeElapsedText);
    }

}
