class Fighters{
    constructor(stage, assetManager, max_health, enemy_health){
        //basic setup of the player/enemy fighters and their animation loops
        this._stage = stage;
        this._health = max_health;
        this._enemyhealth = enemy_health;

        this._playerFighter = assetManager.getSprite("assets");
        this._playerFighter.gotoAndStop("playeridle");
        this._playerFighter.x = -20;
        this._playerFighter.y = 0;
        this._stage.addChild(this._playerFighter);

        this._enemyFighter = assetManager.getSprite("assets");
        this._enemyFighter.gotoAndStop("enemyidle");
        this._enemyFighter.x = -20;
        this._enemyFighter.y = 0;
        this._stage.addChild(this._enemyFighter);


    }
//plays the punch animation then makes them go back to idle
    playerattack(e){
        this._playerFighter.gotoAndPlay("playerpunch");
        this._playerFighter.on("animationend", this.startidlePlayer, this);
    }

    enemyattack(e){
        this._enemyFighter.gotoAndPlay("enemypunch");
        this._enemyFighter.on("animationend", this.startidleEnemy, this);
    }

    startidlePlayer(e){
        this._playerFighter.gotoAndPlay("playeridle");
    }

    startidleEnemy(e){
        this._enemyFighter.gotoAndPlay("enemyidle");
    }
}