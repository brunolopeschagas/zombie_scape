export default class RandomGen{
    static getRandomFloatBetween(min, max){
        return Math.random() * (max - min) + min;
    }
}