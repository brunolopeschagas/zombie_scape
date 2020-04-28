class JsonMap extends Map {

    constructor(scene, key, urlMap, urlImageTileSet){
        super(scene, key, urlMap, urlImageTileSet);
    }

    loadMap(){
        this.loadImageTileSet();
        this._scene.load.tilemapTiledJSON(this._key, this._urlMap);
    }
}