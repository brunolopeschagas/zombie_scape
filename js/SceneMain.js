class SceneMain extends Phaser.Scene {

    constructor() {
        super({key: "SceneMain"});
        this.player;
        this.cursors;
        this.camera;
    }

    preload() {
        this.load.tilemapTiledJSON("mapa", "assets/tilemaps/tiled_map_json.json");
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

        //set the colision tiles to actually collides
        mundoLayer.setCollisionByProperty({collides: true});

        //cria o jogador
        this.player = new Player(this, 20, 480, 'dude');
        this.animacoes();

        //teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.configInputs();

        const acimaLayer = map.createStaticLayer("acima", tileset, 0, 0);

        //colisao entre jogador de tiles
        this.physics.add.collider(this.player, mundoLayer);

        //cria a camera e manda perseguir o personagem no centro da tela
        this.camera = this.configCamera(map);

    }

    update() {
        this.player.stop();
        this.movimentarPlayer();
        this.zoom();
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
            frames: this.game.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
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