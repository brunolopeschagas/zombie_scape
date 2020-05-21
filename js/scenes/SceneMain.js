import JsonMap from '../maps/JsonMap.js';
import Player from '../entities/Player.js';
import SlowChaseBehavior from '../AI/SlowChaseBehavior.js';
import ChaseBehavior from '../AI/ChaseBehavior.js';
import Enemy from '../entities/Enemy.js';
import InputKeyBoard from '../inputs/InputKeyBoard.js';
import GameHud from '../GUI/GameHud.js';
import RandomGen from '../utils/RandomGen.js';
import Animation from '../animations/Animation.js';
import {PLAYER_ANIM_KEYS} from '../animations/ZombieAnimationKeys.js';

export default class SceneMain extends Phaser.Scene {

    constructor() {
        super({ key: "SceneMain" });
        this.player;
        this.cursors;
        this.inputs;
        this.camera;
        this.quantitiOfZombies;
        this.gameTimeStartCount = 0;
        this.gameHud;
        this.spawnPoint;
        this.spriteSheetPlayer = 'player';
        this.spriteSheetZombies1 = 'zombie';
        this.spriteSheetZombies2 = 'zombie2';
        this.jsonMap;
        this.enemies;
    }

    preload() {
        this.loadMap();
        this.loadSpriteSheets();
    }

    loadMap() {
        this.jsonMap = new JsonMap(this, "zs_map_1", "assets/tilemaps/zs_isle.json", "assets/tilesets/tuxmon-sample-32px.png");
        this.jsonMap.loadMap();
    }

    loadSpriteSheets() {
        this.load.spritesheet(this.spriteSheetPlayer, 'assets/sprites/player_spritesheet.png', { frameWidth: 30, frameHeight: 50 });
        this.load.spritesheet(this.spriteSheetZombies1, 'assets/sprites/zombie_1_spritesheet.png', { frameWidth: 30, frameHeight: 50 });
        this.load.spritesheet(this.spriteSheetZombies2, 'assets/sprites/zombie_2_spritesheet.png', { frameWidth: 30, frameHeight: 50 });
    }

    create() {
        this.gameTimeStartCount = this.gameTimeStart();

        const STAMINA_DECREASE_TIME = 10000;

        this.jsonMap.makeTileMap();
        this.jsonMap.addTileSetImageToMap("tuxmon-sample-32px", this.jsonMap.key);

        this.quantitiOfZombies = this.jsonMap.map.findObject("map_data", mapData => mapData.name === "max_enemies").type;

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.jsonMap.createAndAddLayer("ground", 0);
        this.jsonMap.createAndAddLayer("middle", 0);
        this.jsonMap.createAndAddLayer("above", 0);

        //colisions tiles by excluision
        this.jsonMap.activateColisionToLayer(1);

        //seto a profundidade da camada (no caso acima do player
        const DEPTH_ABOVE_LAYER = 10;
        this.jsonMap.getLayer(2).setDepth(DEPTH_ABOVE_LAYER);

        this.createPlayer(this.jsonMap.map.findObject("spawn", spawn => spawn.name === "player_spawn"))
        this.gerenateZombies(this.player, this.jsonMap.map);
        this.createColisionPlayerEnemy()
        this.createColisionsEntitiesLayer(this.jsonMap.getLayer(1));

        //teclado
        this.inputs = new InputKeyBoard(this.input.keyboard.createCursorKeys());

        this.createCamera(this.jsonMap.map);
        this.createGameHud();
        this.createStaminaDecreaseEvent(STAMINA_DECREASE_TIME);

        // this.mapData(this.jsonMap.map);

    }

    gameTimeStart() {
        return new Date().getTime() / 1000;
    }

    createPlayer(startPoint) {
        this.spawnPoint = startPoint;
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 70, this.spriteSheetPlayer);
        this.createPlayerAnimations();
    }

    createPlayerAnimations() {
        let animation = new Animation(this.game.anims);
        animation.createInfiniteAnimation(this.player.Key, PLAYER_ANIM_KEYS.LEFT, 9, 17);
        animation.createInfiniteAnimation(this.player.Key, PLAYER_ANIM_KEYS.IDLE, 18, 26);
        animation.createInfiniteAnimation(this.player.Key, PLAYER_ANIM_KEYS.RIGHT, 27, 35);
        animation.createInfiniteAnimation(this.player.Key, PLAYER_ANIM_KEYS.DOWN, 18, 26);
        animation.createInfiniteAnimation(this.player.Key, PLAYER_ANIM_KEYS.UP, 0, 8);
    }

    gerenateZombies(player, map) {
        this.enemies = this.add.group();
        let SLOW_CHASE_BEHAVIOR = new SlowChaseBehavior();
        let CHASE_BEHAVIOR = new ChaseBehavior(200);
        let enemy;
        let spawnPointEnemy;
        for (let i = 0; i < this.quantitiOfZombies; i++) {
            spawnPointEnemy = map.findObject("spawn", spawn => spawn.name === "enemy_spawn_" + (i + 1));
            if (i % 2 === 0) {
                enemy = this.createEnemy(SLOW_CHASE_BEHAVIOR, spawnPointEnemy);
            } else {
                enemy = this.createEnemy(CHASE_BEHAVIOR, spawnPointEnemy);
            }
            this.enemies.add(enemy);
        }
        this.createEnemiesAnimations(enemy.key);
    }
    
    createEnemy(behavior, spawnPointEnemy) {
        let enemy = this.createEnemyWhitBehavior(behavior, spawnPointEnemy, this.spriteSheetZombies1);
        let customBehaviorCicleTime = this.generateBehaviorCicleTime(behavior.actionInterval);
        this.createEnemyChaseBehaviorCicle(customBehaviorCicleTime, enemy, this.player);
        return enemy;
    }

    createEnemyWhitBehavior(behavior, spawnPointEnemy, spriteSheet) {
        let randomSpeed = RandomGen.getRandomFloatBetween(behavior.minSpeed, behavior.maxSpeed);
        let enemy = new Enemy(this, spawnPointEnemy.x, spawnPointEnemy.y, spriteSheet, randomSpeed);
        enemy.behavior = behavior;
        return enemy;
    }

    createEnemyChaseBehaviorCicle(delayOfActionInMilis, enemy, enemiesPrey) {
        this.time.addEvent({
            delay: delayOfActionInMilis,
            callback: function () {
                enemy.act(enemiesPrey, enemy);
            },
            callbackScope: this,
            loop: true
        });
    }

    generateBehaviorCicleTime(baseTimeInMilis) {
        return RandomGen.getRandomFloatBetween(0, 2000) + baseTimeInMilis;
    }

    createEnemiesAnimations(enemeyKey) {
        let animation = new Animation(this.game.anims);
        animation.createInfiniteAnimation(enemeyKey, 'zombie_1_turn', 18, 26);
        animation.createInfiniteAnimation(enemeyKey, 'zombie_1_down', 18, 26);
        animation.createInfiniteAnimation(enemeyKey, 'zombie_1_up', 0, 8);
    }

    createColisionPlayerEnemy() {
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            player.die();
        });
    }

    createColisionsEntitiesLayer(layerToColide) {
        this.physics.add.collider(this.player, layerToColide);
        this.physics.add.collider(this.enemies, layerToColide);
    }

    createCamera(pMap) {
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, pMap.widthInPixels, pMap.heightInPixels);
    }

    createGameHud() {
        this.gameHud = new GameHud(this);
        this.showStamina();
    }

    createStaminaDecreaseEvent(decreaseTime) {
        this.time.addEvent({
            delay: decreaseTime,
            callback: function () {
                this.showStamina();
            },
            callbackScope: this,
            loop: true
        });
    }

    showStamina() {
        this.gameHud.showStamina(this.player.lostStamina());
    }

    update() {
        if (this.player.alive) {
            this.movePlayer();
            this.showTime();
        } else {
            this.gameOver();
        }
    }

    showTime() {
        this.gameHud.showTime(this.currentTime());
    }

    movePlayer() {
        this.player.stop();
        if (this.inputs.moveLeft()) {
            this.player.moveLeft();
            this.player.anims.play(PLAYER_ANIM_KEYS.LEFT, true);
        } else if (this.inputs.moveRight()) {
            this.player.moveRight();
            this.player.anims.play(PLAYER_ANIM_KEYS.RIGHT, true);
        } else if (this.inputs.moveUp()) {
            this.player.moveUp();
            this.player.anims.play(PLAYER_ANIM_KEYS.UP, true);
        } else if (this.inputs.moveDown()) {
            this.player.moveDown();
            this.player.anims.play(PLAYER_ANIM_KEYS.DOWN, true);
        } else {
            this.player.anims.play(PLAYER_ANIM_KEYS.IDLE);
        }
    }

    gameOver() {
        this.player.die();
        this.camera.shake(300);
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                this.scene.start("SceneGameOver", { level: 1, survivedTime: this.currentTime() });
            },
            callbackScope: this,
            loop: false
        });
    }

    currentTime() {
        return ((new Date().getTime() / 1000) - this.gameTimeStartCount);
    }

    mapData(pMap) {
        console.log(pMap);
    }
}
