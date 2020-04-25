class SceneMain extends Phaser.Scene {

    constructor() {
        super({ key: "SceneMain" });
        this.player;
        this.cursors;
        this.inputs;
        this.camera;
        this.qteZombies = 7;
        this.inicioJogo = new Date().getTime() / 1000;
        this.timeElapsed;
        this.gameHud;
        this.spawn_point;
        this.spriteSheeName = 'dude';
    }

    preload() {
        this.carregarMapa();
        this.carregarSpriteSheets();
    }

    carregarMapa() {
        this.load.tilemapTiledJSON("mapa", "assets/tilemaps/zombie_map_1.json");
        this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px.png");
    }

    carregarSpriteSheets() {
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

        //cria o jogador
        this.spawn_point = MAP.findObject("Objects", obj => obj.name === "spawn_player");

        this.player = new Player(this, this.spawn_point.x, this.spawn_point.y, 70, this.spriteSheeName);
        this.criarAnimacoes();

        //crio o grupo dos inimigos
        this.enemies = this.add.group();

        this.criarInimigos();

        //colisoes entre jogador e o inimigo
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            player.die();
        });

        //teclado
        this.inputs = new InputKeyBoard(this.input.keyboard.createCursorKeys());

        //colisoes
        this.physics.add.collider(this.player, PLAYER_LAYER);
        this.physics.add.collider(this.enemies, PLAYER_LAYER);

        //cria a camera e manda perseguir o personagem no centro da tela
        this.camera = this.criarCamera(MAP);

        this.criarGameHud();

        //tempo de decremento da stamina
        this.time.addEvent({
            delay: STAMINA_DECREASE_TIME,
            callback: function () {
                this.gameHud.showStamina(this.player.lostStamina());
            },
            callbackScope: this,
            loop: true
        });

        this.mapData(MAP);
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

    criarInimigos() {
        //crio os comportamentos dos inimigos
        const COMP_LERDO = new CompLerdo();
        const COMP_PERSEGUIR = new CompPerseguir(200);
        let enemy = null;

        //crio e adiciono os inimigos ao grupo de inimigos e seto seus comportamentos
        for (let i = 0; i < this.qteZombies; i++) {
            if (i % 2 === 0) {
                enemy = this.criarComportamentoInimigo(COMP_PERSEGUIR);
            } else {
                enemy = this.criarComportamentoInimigo(COMP_LERDO);
            }
            this.enemies.add(enemy);
        }
    }

    criarComportamentoInimigo(comportamento) {
        let randomSpawnX = Phaser.Math.Between(-500, 500);
        let randomSpawnY = Phaser.Math.Between(-500, 500);
        let randomSpeed = Phaser.Math.Between(comportamento.minSpeed, comportamento.maxSpeed);
        let enemy = new Enemy(this, this.spawn_point.x + randomSpawnX, this.spawn_point.y + randomSpawnY, this.spriteSheeName, randomSpeed);
        enemy.comportamento = comportamento;
        return enemy;
    }

    criarCamera(pMap) {
        let cam = this.cameras.main;
        cam.startFollow(this.player);
        cam.setBounds(0, 0, pMap.widthInPixels, pMap.heightInPixels);
        return cam;
    }

    criarGameHud() {
        //hud do game
        this.gameHud = new GameHud(this);

        this.gameHud.showStamina(this.player.lostStamina());
    }

    update() {
        if (this.player.alive) {
            this.player.stop();
            this.movePlayer();
            this.gameHud.showTime(this.currentTime());

            let enemyLength = this.enemies.getChildren().length;
            for (let i = 0; i < enemyLength; i++) {
                let enemy = this.enemies.getChildren()[i];
                enemy.agir(this.player, enemy);
            }
        } else {
            this.scene.start("SceneGameOver");
        }
    }

    currentTime() {
        return ((new Date().getTime() / 1000) - this.inicioJogo);
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



    

    mapData(pMap) {
        console.log(pMap);
    }
}
