import Inputs from './Inputs.js';
export default class InputKeyBoard extends Inputs {

    constructor(keyboardCursorKeys) {
        super();
        this._keyboardCursorKeys = keyboardCursorKeys;
    }

    moveLeft() {
        return this._keyboardCursorKeys.left.isDown;
    }
    moveRight() {
        return this._keyboardCursorKeys.right.isDown;
    }
    moveUp() {
        return this._keyboardCursorKeys.up.isDown;
    }
    moveDown() {
        return this._keyboardCursorKeys.down.isDown;
    }

}