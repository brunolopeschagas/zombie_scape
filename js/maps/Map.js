class Map {

    constructor(scene, key, urlMap, urlImageTileSet) {
        this._scene = scene;
        this._key = key;
        this._urlMap = urlMap;
        this._urlImageTileSet = urlImageTileSet;
        this._layers = new Array();
    }

    loadMap(){}

    loadImageTileSet(){
        this._scene.load.image(this._key, this._urlImageTileSet);
    }

    get key(){
        return this._key;
    }
}