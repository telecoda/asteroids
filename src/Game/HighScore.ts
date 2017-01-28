namespace Asteroids {

    export class HighScore  {

        private _name : string;
        private _score : number;
        private _level : number;
        // -------------------------------------------------------------------------
        public constructor(name: string, score:number, level:number) {
            this._name = name;
            this._score = score;
            this._level = level;
        }

        public getName = ():string => {
            return this._name;
        }
        public getScore = ():number => {
            return this._score;
        }
        public getLevel = ():number => {
            return this._level;
        }
    }

    
}
