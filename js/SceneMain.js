class SceneMain extends Phaser.Scene {

    constructor() {
        super({key: "SceneMain"});
        this.player;
        this.cursors;
        this.camera;
        this.qteZombies = 3;
        this.inicioJogo = new Date().getTime() / 1000;
        this.timeElapsed;
        this.gameHud;
    }

    preload() {
        this.load.tilemapTiledJSON("mapa", "assets/tilemaps/zombie_map_1.json");
        this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px.png");
        this.load.spritesheet('dude', 'assets/sprites/dude.png', {frameWidth: 32, frameHeight: 28});
    }

    create() {

        const STAMINA_DECREASE_TIME = 10000;

        const MAP = this.make.tilemap({key: "mapa"});

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const TILESET = MAP.addTilesetImage("tiled_map", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const CHAO_LAYER = MAP.createStaticLayer("chao", TILESET, 0, 0);
        const MUNDO_LAYER = MAP.createStaticLayer("mundo", TILESET, 0, 0);
        const ACIMA_LAYER = MAP.createStaticLayer("acima", TILESET, 0, 0);
        const DEPTH_ACIMA_LAYER = 10;

        //set the colision tiles to actually collides
        MUNDO_LAYER.setCollisionByProperty({collides: true});

        //seto a profundidade da camada (no caso acima do player
        ACIMA_LAYER.setDepth(DEPTH_ACIMA_LAYER);

        //cria o jogador
        const SPAWN_POINT = MAP.findObject("Objects", obj => obj.name === "spawn_player");

        this.player = new Player(this, SPAWN_POINT.x, SPAWN_POINT.y, 100, 'dude');
        this.animacoes();

        //crio o grupo dos inimigos
        this.enemies = this.add.group();

        //crio os comportamentos dos inimigos
        const COMP_LERDO = new CompLerdo();
        const COMP_PERSEGUIR = new CompPerseguir(200);
        const COMP_VAGAR = new CompVagar();

        //crio e adiciono os inimigos ao grupo de inimigos e seto seus comportamentos
        for (let i = 0; i < this.qteZombies; i++) {
            let randomSpawnX = Phaser.Math.Between(-500, 500);
            let randomSpawnY = Phaser.Math.Between(-500, 500);

            let enemy;
            let randomSpeed;

            if (i % 2 === 0) {
                randomSpeed = Phaser.Math.Between(COMP_PERSEGUIR.minSpeed, COMP_PERSEGUIR.maxSpeed);
                enemy = new Enemy(this, SPAWN_POINT.x + randomSpawnX, SPAWN_POINT.y + randomSpawnY, 'dude', randomSpeed);
                enemy.comportamento = COMP_VAGAR;
            } else {
                randomSpeed = Phaser.Math.Between(COMP_LERDO.minSpeed, COMP_LERDO.maxSpeed);
                enemy = new Enemy(this, SPAWN_POINT.x + randomSpawnX, SPAWN_POINT.y + randomSpawnY, 'dude', randomSpeed);
                enemy.comportamento = COMP_VAGAR;
            }
            this.enemies.add(enemy);
        }

        //colisoes entre jogador e o inimigo
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            player.morrer();
        });

        //teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.configInputs();

        //colisoes
        this.physics.add.collider(this.player, MUNDO_LAYER);
        this.physics.add.collider(this.enemies, MUNDO_LAYER);

        //cria a camera e manda perseguir o personagem no centro da tela
        this.camera = this.configCamera(MAP);

        //hud do game
        this.gameHud = new GameHud(
                this.add.text(50, 50, '', {fontSize: '32px', fill: '#000'}),
                this.add.text(50, 70, '', {fontSize: '32px', fill: '#0f0'})
                );

        this.gameHud.showStamina(this.player.lostStamina());

        //tempo de decremento da stamina
        this.time.addEvent({
            delay: STAMINA_DECREASE_TIME,
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
            this.movimentarPlayer();
            this.gameHud.showTime(this.currentTime());

            let enemyLength = this.enemies.getChildren().length;
            for (let i = 0; i < enemyLength; i++) {
                let enemy = this.enemies.getChildren()[i];
                enemy.agir(this.player, enemy);
                enemy.moveUp();
            }
        }
        this.zoom();
    }

    currentTime() {
        return ((new Date().getTime() / 1000) - this.inicioJogo);
    }

    movimentarPlayer() {
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.moveUp();
            this.player.anims.play('turn', true);
        } else if (this.cursors.down.isDown) {
            this.player.moveDown();
            this.player.anims.play('turn', true);
        } else {
            this.player.anims.play('turn');
        }
//        if (this.cursors.up.isDown && this.player.body.blocked.down) {
//            this.player.setVelocityY(this.auturaPulo);
//        }
    }

    animacoes() {
        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: 'turn',
            frames: [{key: this.player.Key, frame: 4}],
            frameRate: 20
        });

        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(this.player.Key, {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }

    configInputs() {
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }

    configCamera(pMap) {
        let cam = this.cameras.main;
        cam.startFollow(this.player);
        cam.setBounds(0, 0, pMap.widthInPixels, pMap.heightInPixels);
        cam.setZoom(3);

        return cam;
    }

    zoom() {
        if (this.keyZ.isDown) {
            if (this.camera.zoom < 3) {
                this.camera.setZoom(this.camera.zoom + 0.1);
            }
        } else if (this.keyA.isDown) {
            if (this.camera.zoom > 1) {
                this.camera.setZoom(this.camera.zoom - 0.1);
            }
        }
    }
}