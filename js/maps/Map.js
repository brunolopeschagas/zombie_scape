export default class Map {

    constructor(scene, key, urlMap) {
        this._scene = scene;
        this._key = key;
        this._urlMap = urlMap;
        this._layers = new Array();
        this._map;
    }

    loadMap(){}

    createStaticLayer(){}

    addLayer(layer){
        this._layers.push(layer);
    }

    removeTopLayer(layer){
        this._layers.pop();
    }

    getLayer(indexLayer){
        return this._layers[indexLayer];
    }

    get key(){
        return this._key;
    }

    get map(){
        return this._map;
    }


}