export default class RandomGen{
    static getRandomIntBetween(minInt, maxInt){
        return Math.floor(Math.random() * maxInt) + minInt;
    }
}