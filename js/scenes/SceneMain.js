import JsonMap from '../maps/JsonMap.js';
import Player from '../entities/Player.js';
import CompLerdo from '../AI/CompLerdo.js';
import CompPerseguir from '../AI/CompPerseguir.js';
import CompPerseguirPlus from '../AI/CompPerseguirPlus.js';
import Enemy from '../entities/Enemy.js';
import InputKeyBoard from '../inputs/InputKeyBoard.js';
import GameHud from '../GUI/GameHud.js';

export default class SceneMain extends Phaser.Scene {

    constructor() {
        super({ key: "SceneMain" });
        this.player;
        this.cursors;
        this.inputs;
        this.camera;
        this.quantitiOfZombies;
        this.gameBegin = new Date().getTime() / 1000;
        this.timeElapsed;
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
        this.createEnemies(this.jsonMap.map);
        this.createColisionPlayerEnemy()
        this.createColisionsEntitiesLayer(this.jsonMap.getLayer(1));

        //teclado
        this.inputs = new InputKeyBoard(this.input.keyboard.createCursorKeys());

        this.createCamera(this.jsonMap.map);
        this.createGameHud();
        this.createStaminaDecreaseEvent(STAMINA_DECREASE_TIME);

        // this.mapData(this.jsonMap.map);

    }

    createPlayer(startPoint) {
        this.spawnPoint = startPoint;
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 70, this.spriteSheetPlayer);
        this.createPlayerAnimations();
    }

    createPlayerAnimations() {
        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 9, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'turn',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 18, end: 26 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 27, end: 35 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'down',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 18, end: 26 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'up',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createEnemies(map) {
        this.enemies = this.add.group();
        const COMP_LERDO = new CompLerdo();
        const COMP_PERSEGUIR = new CompPerseguir(200);
        const COMP_PERSEGUIR_PLUS = new CompPerseguirPlus(200);
        let enemy;
        let spawnPointEnemy;
        for (let i = 0; i < this.quantitiOfZombies; i++) {
            spawnPointEnemy = map.findObject("spawn", spawn => spawn.name === "enemy_spawn_" + (i + 1));
            if (i % 2 === 0) {
                enemy = this.createEnemiesWhitBehavior(COMP_LERDO, spawnPointEnemy, this.spriteSheetZombies1);
            }else {
                enemy = this.createEnemiesWhitBehavior(COMP_PERSEGUIR_PLUS, spawnPointEnemy, this.spriteSheetZombies2);
            }
            this.enemies.add(enemy);
        }
        this.createEnemiesAnimations(enemy.key)
    }

    createEnemiesAnimations(enemeyKey) {
        this.game.anims.create({
            key: 'zombie_1_left',
            frames: this.game.anims.generateFrameNumbers(enemeyKey, { start: 9, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'zombie_1_turn',
            frames: this.game.anims.generateFrameNumbers(enemeyKey, { start: 18, end: 26 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'zombie_1_right',
            frames: this.game.anims.generateFrameNumbers(enemeyKey, { start: 27, end: 35 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'zombie_1_down',
            frames: this.game.anims.generateFrameNumbers(enemeyKey, { start: 18, end: 26 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'zombie_1_up',
            frames: this.game.anims.generateFrameNumbers(enemeyKey, { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
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

    createEnemiesWhitBehavior(behavior, spawnPointEnemy, spriteSheet) {
        let randomSpeed = Phaser.Math.Between(behavior.minSpeed, behavior.maxSpeed);
        let enemy = new Enemy(this, spawnPointEnemy.x, spawnPointEnemy.y, spriteSheet, randomSpeed);
        enemy.behavior = behavior;
        return enemy;
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
            this.player.stop();
            this.movePlayer();
            this.showTime();
            this.enemyActions();
        } else {
            this.gameOver();
        }
    }

    showTime() {
        this.gameHud.showTime(this.currentTime());
    }

    movePlayer() {
        if (this.inputs.moveLeft()) {
            this.player.moveLeft();
            this.player.anims.play('left', true);
        } else if (this.inputs.moveRight()) {
            this.player.moveRight();
            this.player.anims.play('right', true);
        } else if (this.inputs.moveUp()) {
            this.player.moveUp();
            this.player.anims.play('up', true);
        } else if (this.inputs.moveDown()) {
            this.player.moveDown();
            this.player.anims.play('down', true);
        } else {
            this.player.anims.play('turn');
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
        return ((new Date().getTime() / 1000) - this.gameBegin);
    }

    enemyActions() {
        let enemyLength = this.enemies.getChildren().length;
        let enemy;
        for (let i = 0; i < enemyLength; i++) {
            enemy = this.enemies.getChildren()[i];
            enemy.act(this.player, enemy);
        }
    }

    mapData(pMap) {
        console.log(pMap);
    }
}
