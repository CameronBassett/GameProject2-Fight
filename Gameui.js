class Gameui {
    constructor(stage, assetManager, max_health, enemy_health){

        //setup for the UI (healthbars, reset button, and UI graphics )
        this._stage = stage;
        this._health = max_health;
        this._enemyhealth = enemy_health;

        this._gameOver = new createjs.Event("gameOver");
        this._winGame = new createjs.Event("winGame");

        this._UserInterface = assetManager.getSprite("assets");
        this._UserInterface.gotoAndStop("healthGUI");
        this._UserInterface.x = 0;
        this._UserInterface.y = 0;
        this._stage.addChild(this._UserInterface);

        this._resetButton = assetManager.getSprite("assets");
        this._resetButton.on("click", this.resetB, this);
        this._resetButton.buttonHelper = new createjs.ButtonHelper(this._resetButton, "resetgameUP", "resetgameOVER", "resetgameOVER");
        this._resetButton.x = 0;
        this._resetButton.y = 0;
        this._stage.addChild(this._resetButton);

        this._healthBar = new createjs.Shape();
        this._stage.addChild(this._healthBar);

        this._enemyHealthBar = new createjs.Shape();
        this._stage.addChild(this._enemyHealthBar);

    }
    // have both values set so when functon gets called, valueP is for the players health to decrease, and valueE is for the Enemys
    decreaseHealth(valueP,valueE){
        this._health = this._health - valueP;
        this._enemyhealth = this._enemyhealth - valueE;
        let playerWidth = (this._health * 50);
        let enemyWidth = (this._enemyhealth * 50);

        this._healthBar.graphics.clear();
        this._enemyHealthBar.graphics.clear();
        //when the health is checked, the lower it gets it changes color, and when it reaches zero, it dispatches and event to tell the game its over.
        if(this._health <= 0){
        this._stage.dispatchEvent(this._gameOver);
        }else if(this._health <= 2){
            this._healthBar.graphics.beginFill("#c50c0c").drawRect(50,25,playerWidth,10);
        }else if(this._health <= 5){
            this._healthBar.graphics.beginFill("#ff471a").drawRect(50,25,playerWidth,10);
        }else{
        this._healthBar.graphics.beginFill("#ff6600").drawRect(50,25,playerWidth,10);
        }

        if(this._enemyhealth <= 0){
        this._stage.dispatchEvent(this._winGame);
        }
        else if(this._enemyhealth <=2){
        this._enemyHealthBar.graphics.beginFill("#d966ff").drawRect(50,35,enemyWidth,10);
        }else if(this._enemyhealth <=5){
        this._enemyHealthBar.graphics.beginFill("#a64dff").drawRect(50,35,enemyWidth,10);
        }else{
        this._enemyHealthBar.graphics.beginFill("#9900ff").drawRect(50,35,enemyWidth,10);
        }
        this._healthBar.cache(50,25,playerWidth,10);
        this._enemyHealthBar.cache(50,35,enemyWidth,10);

    }

// resets the health of the enemy and player, then updates the visuals
    resetB(){
        this._health = 10;
        this._enemyhealth = 10;
        this.decreaseHealth(0,0);
    }

// called on ready to update the visuals of the UI
    setupMe(){
        this.decreaseHealth(0,0);
    }


}