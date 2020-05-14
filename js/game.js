
import SceneMain from './scenes/SceneMain.js';
import SceneMainMenu from './scenes/SceneMainMenu.js';
import SceneGameOver from './scenes/SceneGameOver.js';

const WORLD_WIDTH = 720;
const WORLD_HEIGHT = 480;
//const WORLD_WIDTH = window.innerWidth * window.devicePixelRatio;
//const WORLD_HEIGHT = window.innerHeight * window.devicePixelRatio;
//const SCALE_RATIO = WORLD_WIDTH / WORLD_HEIGHT;


var config = {
    type: Phaser.CANVAS,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.CANVAS,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);