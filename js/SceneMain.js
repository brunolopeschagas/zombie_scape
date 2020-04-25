class SceneMain extends Phaser.Scene {

    constructor() {
        super({ key: "SceneMain" });
        this.player;
        this.cursors;
        this.inputs;
        this.camera;
        this.quantitiOfZombies = 7;
        this.gameBegin = new Date().getTime() / 1000;
        this.timeElapsed;
        this.gameHud;
        this.spawnPoint;
        this.spriteSheeName = 'dude';
    }

    preload() {
        this.loadMap();
        this.loadSpriteSheets();
    }

    loadMap() {
        this.load.tilemapTiledJSON("mapa", "assets/tilemaps/zombie_map_1.json");
        this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px.png");
    }

    loadSpriteSheets() {
        this.load.spritesheet(this.spriteSheeName, 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 28 });
    }

    create() {
        const STAMINA_DECREASE_TIME = 10000;
        const MAP = this.make.tilemap({ key: "mapa" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const TILESET = MAP.addTilesetImage("tiled_map", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const GROUND_LAYER = MAP.createStaticLayer("chao", TILESET);
        const PLAYER_LAYER = MAP.createStaticLayer("mundo", TILESET);
        const ABOVE_LAYER = MAP.createStaticLayer("acima", TILESET);
        const DEPTH_ABOVE_LAYER = 10;

        //set the colision tiles to actually collides
        PLAYER_LAYER.setCollisionByProperty({ collides: true });

        //seto a profundidade da camada (no caso acima do player
        ABOVE_LAYER.setDepth(DEPTH_ABOVE_LAYER);

        this.createPlayer(MAP.findObject("Objects", obj => obj.name === "spawn_player"))
        this.createEnemies();
        this.createColisionPlayerEnemy()
        this.createColisionsEntitiesLayer(PLAYER_LAYER);

        //teclado
        this.inputs = new InputKeyBoard(this.input.keyboard.createCursorKeys());
        
        this.createCamera(MAP);
        this.createGameHud();
        this.createStaminaDecreaseEvent(STAMINA_DECREASE_TIME);

        this.mapData(MAP);
    }

    createPlayer(startPoint) {
        this.spawnPoint = startPoint;
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 70, this.spriteSheeName);
        this.criarAnimacoes();
    }

    criarAnimacoes() {
        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.game.anims.create({
            key: 'turn',
            frames: [{ key: this.player.Key, frame: 4 }],
            frameRate: 20
        });
        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    createEnemies() {
        this.enemies = this.add.group();
        const COMP_LERDO = new CompLerdo();
        const COMP_PERSEGUIR = new CompPerseguir(200);
        let enemy = null;
        for (let i = 0; i < this.quantitiOfZombies; i++) {
            if (i % 2 === 0) {
                enemy = this.createEnemiesBehavior(COMP_PERSEGUIR);
            } else {
                enemy = this.createEnemiesBehavior(COMP_LERDO);
            }
            this.enemies.add(enemy);
        }
    }

    createColisionPlayerEnemy() {
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            player.die();
        });
    }

    createColisionsEntitiesLayer(layer){
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.enemies, layer);
    }

    createEnemiesBehavior(comportamento) {
        let randomSpawnX = Phaser.Math.Between(-500, 500);
        let randomSpawnY = Phaser.Math.Between(-500, 500);
        let randomSpeed = Phaser.Math.Between(comportamento.minSpeed, comportamento.maxSpeed);
        let enemy = new Enemy(this, this.spawnPoint.x + randomSpawnX, this.spawnPoint.y + randomSpawnY, this.spriteSheeName, randomSpeed);
        enemy.comportamento = comportamento;
        return enemy;
    }

    createCamera(pMap) {
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, pMap.widthInPixels, pMap.heightInPixels);
    }

    createGameHud() {
        this.gameHud = new GameHud(this);
        this.gameHud.showStamina(this.player.lostStamina());
    }

    createStaminaDecreaseEvent(decreaseTime){
        this.time.addEvent({
            delay: decreaseTime,
            callback: function () {
                this.gameHud.showStamina(this.player.lostStamina());
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.player.alive) {
            this.player.stop();
            this.movePlayer();
            this.gameHud.showTime(this.currentTime());
            this.enemyActions();
        } else {
            this.scene.start("SceneGameOver");
        }
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
            this.player.anims.play('turn', true);
        } else if (this.inputs.moveDown()) {
            this.player.moveDown();
            this.player.anims.play('turn', true);
        } else {
            this.player.anims.play('turn');
        }
    }

    currentTime() {
        return ((new Date().getTime() / 1000) - this.gameBegin);
    }

    enemyActions() {
        let enemyLength = this.enemies.getChildren().length;
        for (let i = 0; i < enemyLength; i++) {
            let enemy = this.enemies.getChildren()[i];
            enemy.agir(this.player, enemy);
        }
    }

    mapData(pMap) {
        console.log(pMap);
    }
}
