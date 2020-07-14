export default class Animation {

    constructor(animation) {
        this._animation = animation;
    }

    createInfiniteAnimation(entityAnimationKey, animationKey, frameStart, frameEnd) {
        return this._animation.create({
            key: animationKey,
            frames: this._animation.generateFrameNumbers(entityAnimationKey, { start: frameStart, end: frameEnd }),
            frameRate: 10,
            repeat: -1
        });
    }

}