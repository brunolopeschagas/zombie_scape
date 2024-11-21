export default class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGameOver" });
        this.title;
        this.level;
        this.txtLevel;
        this.survivedTime;
        this.txtSurvivedTime;
    }

    init(data) {
        this.level = data.level;
        this.survivedTime = data.survivedTime;
    }

    preload() {
        this.loadImageButtons();
    }

    loadImageButtons() {
        this.load.image("sprXShare", "assets/images/buttons/sprXShare.png");
        this.load.image("sprXShareHover", "assets/images/buttons/sprXShareHover.png");
        this.load.image("sprXShareDown", "assets/images/buttons/sprXShareDown.png");
        this.load.image("sprBtnRestart", "assets/images/buttons/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/images/buttons/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "assets/images/buttons/sprBtnRestartDown.png");
    }

    create() {

        this.addTexts();
        this.addButtonRestart();
        this.addButtonShare();
    }

    addTexts() {
        this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);
        this.txtLevel = this.add.text(this.game.config.width * 0.3, this.game.config.height * 0.3, "Level: " + this.level, {
            fontFamily: 'monospace',
            fontSize: 36,
            fontStyle: 'bold',
            color: '#ffff00',
            align: 'center'
        });
        this.txtSurvivedTime = this.add.text(
            this.game.config.width * 0.2,
            this.game.config.height * 0.5,
            "Survived Time: " + this.survivedTime.toFixed(3),
            {
                fontFamily: 'monospace',
                fontSize: 36,
                fontStyle: 'bold',
                color: '#ff0000',
                align: 'center'
            }
        );
    }

    addButtonRestart() {
        this.btnRestart = this.add.sprite(
            this.game.config.width * 0.3,
            this.game.config.height * 0.9,
            "sprBtnRestart"
        );
        this.btnRestart.setInteractive();
        this.btnRestart.on("pointerover", function () {
            this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
        }, this);
        this.btnRestart.on("pointerout", function () {
            this.setTexture("sprBtnRestart");
        });
        this.btnRestart.on("pointerdown", function () {
            this.btnRestart.setTexture("sprBtnRestartDown");
        }, this);
        this.btnRestart.on("pointerup", function () {
            this.btnRestart.setTexture("sprBtnRestart");
            this.scene.start("SceneMain");
        }, this);
    }

    addButtonShare() {
        this.btnShare = this.add.sprite(
            this.game.config.width * 0.7,
            this.game.config.height * 0.9,
            "sprXShare"
        );
        this.btnShare.setInteractive();
        this.btnShare.on("pointerover", function () {
            this.btnShare.setTexture("sprXShareDown"); // set the button texture to sprBtnPlayHover
        }, this);
        this.btnShare.on("pointerout", function () {
            this.setTexture("sprXShare");
        });
        this.btnShare.on("pointerdown", function () {
            this.btnShare.setTexture("sprXShareHover");
        }, this);
        this.btnShare.on("pointerup", function () {
            this.btnShare.setTexture("sprXShare");
            var url = encodeURIComponent("https://sobreviva.caofalante.com.br/");
            var titulo = encodeURIComponent("Eu sobrevivi por " + this.survivedTime.toFixed(3) + " segundos");
            var via = encodeURIComponent("BrunoLChagas"); //nome de usuário do twitter do seu site
            document.location.href = "https://twitter.com/intent/tweet?url=" + url + "&text=" + titulo + "&via=" + via;
        }, this);
    }
}