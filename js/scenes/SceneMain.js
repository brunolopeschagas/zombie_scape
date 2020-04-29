class SceneMain extends Phaser.Scene {

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
        this.spriteSheeName = 'dude';
        this.jsonMap;
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
        this.load.spritesheet(this.spriteSheeName, 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 28 });
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

        this.mapData(this.jsonMap.map);
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

    createEnemies(map) {
        this.enemies = this.add.group();
        const COMP_LERDO = new CompLerdo();
        const COMP_PERSEGUIR = new CompPerseguir(200);
        let enemy = null;
        for (let i = 0; i < this.quantitiOfZombies; i++) {
            let spawnPointEnemy = map.findObject("spawn", spawn => spawn.name === "enemy_spawn_" + (i + 1));
            console.log(map.findObject("spawn", spawn => spawn.objects));
            if (i % 2 === 0) {
                enemy = this.createEnemiesWhitBehavior(COMP_PERSEGUIR, spawnPointEnemy);
            } else {
                enemy = this.createEnemiesWhitBehavior(COMP_LERDO, spawnPointEnemy);
            }
            this.enemies.add(enemy);
        }
    }

    createColisionPlayerEnemy() {
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            player.die();
        });
    }

    createColisionsEntitiesLayer(layer) {
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.enemies, layer);
    }

    createEnemiesWhitBehavior(comportamento, spawnPointEnemy) {
        let randomSpeed = Phaser.Math.Between(comportamento.minSpeed, comportamento.maxSpeed);
        let enemy = new Enemy(this, spawnPointEnemy.x, spawnPointEnemy.y, this.spriteSheeName, randomSpeed);
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

    gameOver() {
        this.camera.shake(300);
        this.time.addEvent({
            delay: 1000,
            callback: function () {
                this.scene.start("SceneGameOver");
            },
            callbackScope: this,
            loop: false
        });
    }

    mapData(pMap) {
        console.log(pMap);
    }
}
