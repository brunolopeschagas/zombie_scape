class JsonMap extends Map {

    constructor(scene, key, urlMap, urlImageTileSet){
        super(scene, key, urlMap);
        this._urlImageTileSet = urlImageTileSet;
    }

    loadMap(){
        this.loadImageTileSet();
        this.loadTileMapJson();
    }

    loadTileMapJson(){
        this._scene.load.tilemapTiledJSON(this._key, this._urlMap);
    }

    loadImageTileSet(){
        this._scene.load.image(this._key, this._urlImageTileSet);
    }

    makeTileMap(){
       this._map = this._scene.make.tilemap({ key: this._key });
    }

    addTileSetImageToMap(tileSetName, key){
        this._map.addTilesetImage(tileSetName, key);
    }

    createAndAddLayer(layerId, tileSetIndex){
        let tileset = this._map.tilesets[tileSetIndex];
        let layer = this._map.createStaticLayer(layerId, tileset);
        this.addLayer(layer);
    }

    activateColisionToLayer(laierIndex){
        this.getLayer(laierIndex).setCollisionByExclusion([-1])
    }
}