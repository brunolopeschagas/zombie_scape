class SceneMain extends Phaser.Scene {

    constructor() {
        super({key: "SceneMain"});
        this.player;
        this.cursors;
        this.camera;
        this.qteZombies = 10;
        this.inicioJogo = new Date().getTime() / 1000;
        this.timeElapsed;
        this.timeElapsedText;
    }

    preload() {
        this.load.tilemapTiledJSON("mapa", "assets/tilemaps/zombie_map_1.json");
        this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px.png");
        this.load.spritesheet('dude', 'assets/sprites/dude.png', {frameWidth: 32, frameHeight: 28});
    }

    create() {


        const map = this.make.tilemap({key: "mapa"});

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("tiled_map", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const chaoLayer = map.createStaticLayer("chao", tileset, 0, 0);
        const mundoLayer = map.createStaticLayer("mundo", tileset, 0, 0);
        const acimaLayer = map.createStaticLayer("acima", tileset, 0, 0);

        //set the colision tiles to actually collides
        mundoLayer.setCollisionByProperty({collides: true});

        //seto a profundidade da camada (no caso acima do player
        acimaLayer.setDepth(10);

        //cria o jogador
        const spawnPoint = map.findObject("Objects", obj => obj.name === "spawn_player");

        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'dude');
        this.animacoes();

        //crio o grupo dos inimigos
        this.enemies = this.add.group();

        //crio os comportamentos dos inimigos
        const comportamentoLerdo = new ComportamentoLerdo();
        const comportamentoLerdo2 = new ComportamentoLerdo2(200);

        //crio e adiciono os inimigos ao grupo de inimigos e seto seus comportamentos
        for (let i = 0; i < this.qteZombies; i++) {
            let randomSpawnX = Phaser.Math.Between(-500, 500);
            let randomSpawnY = Phaser.Math.Between(-500, 500);

            let enemy;
            let randomSpeed;

            if (i % 2 === 0) {
                randomSpeed = Phaser.Math.Between(5, 20);
                enemy = new Enemy(this, spawnPoint.x + randomSpawnX, spawnPoint.y + randomSpawnY, 'dude', randomSpeed);
                enemy.comportamento = comportamentoLerdo2;
            } else {
                randomSpeed = Phaser.Math.Between(2, 11);
                enemy = new Enemy(this, spawnPoint.x + randomSpawnX, spawnPoint.y + randomSpawnY, 'dude', randomSpeed);
                enemy.comportamento = comportamentoLerdo;
            }
            this.enemies.add(enemy);
        }

        //colisoes entre jogador e o inimigo
        this.physics.add.overlap(this.player, this.enemies, function (player, enemy) {
            console.log("pegou");
        });

        //teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.configInputs();

        //colisoes
        this.physics.add.collider(this.player, mundoLayer);
        this.physics.add.collider(this.enemies, mundoLayer);

        //cria a camera e manda perseguir o personagem no centro da tela
        this.camera = this.configCamera(map);

        this.timeElapsedText = this.add.text(50, 50, 'Tempo:', {fontSize: '32px', fill: '#000'});
        this.timeElapsedText.setScrollFactor(0);
        this.timeElapsedText.setDepth(11);

    }

    update() {
        this.player.stop();
        this.movimentarPlayer();
        this.zoom();

        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            let enemy = this.enemies.getChildren()[i];
            enemy.perseguir(this.player, enemy);
        }

        this.timeElapsedText.setText(this.relogio());
    }
    
    relogio(){
        return ((new Date().getTime() / 1000) - this.inicioJogo).toFixed(3);
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