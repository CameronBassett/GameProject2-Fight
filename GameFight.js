//Game Project 2 - Cameron Bassett
//FIGHT!
// QTE game where you fight a CPU player with a random button popup

(function() {

    
    // game variables
    let stage = null;
    let canvas = null;
    // frame rate of game
    let frameRate = 24;


    //const varis
    const max_health = 10;
    const enemy_health = 10;

    let playerInput = false;

    // game objects
    let assetManager;
    let background;
    let introOverlay;
    let winOverlay;
    let gameOverOverlay;
    let gameUi;
    let fighters;
    let quickTimeEvent;
    let randomkeyOutput;

    //sound
    let cheering;
    //time related
    let gameLose = false;
    let qteTimer = null;
    let countdown = 500;
    let reactionTimer = null;
    let QTE = 4;


/*
    function onHealthChange(e){
        gameUi.health = fighters.newhealth;
    }
*/

//when the game starts/resets, setups on the basic construct of assets and sets variables to their default state
    function onStartGame(e){
        e.remove();
        stage.removeChild(introOverlay);
        gameUi.resetB();
        gameLose = false;

        stopTimer();

        fighters.startidlePlayer();
        fighters.startidleEnemy();
        cheering = createjs.Sound.play("cheering");
        cheering.volume = 0.1;
        createjs.Sound.volume = 1;

        let playerInput = false;

        document.onkeyup = onKeyUp;

    }
//when the game is called to be reset
    function onResetGame(e){
        stage.removeChild(gameOverOverlay);
        stage.removeChild(winOverlay);
        cheering.volume = 0.1;
        background.on("click", onStartGame);
        stage.addChild(introOverlay);
        fighters.startidlePlayer();
        fighters.startidleEnemy();
    }

// the fuction gets called whenever it detects the UP state
// of a key after its been pressed asto not have a holdable button, it must be pressed then released
    function onKeyUp(e){
        console.log("key pressed :" + e.keyCode);
        console.log("framekey :" + randomkeyOutput);
        //when it gets called, it checks if players input of the keys is allowed, if not or the is incorrect, the enemy punches instead of you.
        if(playerInput == true){
            if ((e.keyCode == 37) && (randomkeyOutput == 37)){
                playerPunch();
                stopQTE(2);
            }
            else if ((e.keyCode == 38) && (randomkeyOutput == 38)){
                playerPunch();
                stopQTE(2);
            }
            else if ((e.keyCode == 39) && (randomkeyOutput == 39)){
                playerPunch();
                stopQTE(2);
            }
            else if ((e.keyCode == 40) && (randomkeyOutput == 40)){
                playerPunch();
                stopQTE(2);
            }else{
                enemyPunch();
                stopQTE(2);
            }
        }else{
            enemyPunch();
        }
    }

    function onReady(e) {
        console.log(">> setup");
        // kill event listener
        e.remove();
        

        background = assetManager.getSprite("assets");
        background.gotoAndStop("background");
        stage.addChild(background);

        background.on("click", onStartGame);
        stage.on("gameOver", onGameOver);
        stage.on("winGame", onWinGame);

        gameUi = new Gameui(stage, assetManager, max_health,enemy_health);
        gameUi.setupMe();

        fighters = new Fighters(stage,assetManager,max_health,enemy_health);

        quickTimeEvent = new QuickTimeEvent(stage, assetManager);


        introOverlay = assetManager.getSprite("assets");
        introOverlay.gotoAndStop("introscreen");
        introOverlay.x = 0;
        introOverlay.y = 0;
        stage.addChild(introOverlay);

        winOverlay = assetManager.getSprite("assets");
        winOverlay.gotoAndStop("winoverlay");
        winOverlay.x = 0;
        winOverlay.y = 0;

        gameOverOverlay = assetManager.getSprite("assets");
        gameOverOverlay.gotoAndStop("gameover");
        gameOverOverlay.x = 0;
        gameOverOverlay.y = 0;
        //stage.addChild(gameOverOverlay);

        console.log(">> game ready");
        // startup the ticker
        createjs.framerate = frameRate;
        createjs.Ticker.on("tick", onTick);

    }
// called when the game detects a loss, displays loss screen and sets content not continue
    function onGameOver(){
        stage.addChild(gameOverOverlay);
        gameLose = true;
        playerInput = false;
        gameOverOverlay.on("click", onResetGame);
        
    }
// called when the game detects a win
    function onWinGame(){
        stage.addChild(winOverlay);
        winOverlay.on("click", onResetGame);
        playerInput = false;
        cheering.volume = 0.3;
        gameLose = true;

    }
// function to give a random num between low and high when called
    function randomhit(low, high) {
        // returns a random number
        return Math.floor(Math.random() * (1 + high - low)) + low;
    }
//when the player punches, it plays the animations, sound, and deals the correct damage set between (0.25 and 1)
    function playerPunch(e){
        fighters.playerattack();
        createjs.Sound.play("oof");
        gameUi.decreaseHealth(0,randomhit(0.25,1));

    }
//when the enemy punches, it plays the animations, sound, and deals the correct damage set between (0.25 and 1)
    function enemyPunch(e){
        fighters.enemyattack();
        createjs.Sound.play("ooh");
        gameUi.decreaseHealth(0.25,0);
    }
// timers setup, for the qte timer and timer to call the qte timer.
    function startTimer(){
        qteTimer = window.setInterval(onTimerUpdate, 1000);
    }
    function stopTimer(){
        if(gameLose == true){
            countdown = 500;
        }else{
        window.clearInterval(qteTimer);
        countdown = randomhit(3,6);
        qteTimer = null;
        }
    }
    function onTimerUpdate(e){
        countdown--;
        console.log("timer :" + countdown);
//check if the countdown reached zero, when it does it check if the player had lost, if not, starts the qte popup timer
        if (countdown == 0){
            stopTimer();
            if(gameLose == true){
            stopQTE(500);
            }else{
            startQTE(2);
            }
        }
    }

    function startQTE(e){
        QTE = e;
        reactionTimer = window.setInterval(onReactionUpdate, 1000);
    }

    function stopQTE(e){
        window.clearInterval(reactionTimer);
        playerInput = false;
        QTE = e;
        reactionTimer = null;
        quickTimeEvent.hideKey();
    }

    function onReactionUpdate(e){
// allow player input to not get smacked for reacting
        playerInput = true;
// when the qte hits 2 seconds, display the random key to press to punch
        if(QTE == 2){
            randomkeyOutput = quickTimeEvent.randomKey();
            quickTimeEvent.showKey();
            }
        QTE--;
        console.log("QTE timer :" + QTE);
// if they dont react in time so the timer reaches zero, enemy punchs and it hides the key and starts again
        if(QTE <= 0){
            stopQTE(2);
            quickTimeEvent.hideKey();
            enemyPunch();
        }
    }

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        if (qteTimer == null){
            startTimer();
        }

        // update the stage!
        stage.update();
    }

    function main() {
        console.log(">> initializing");

        // get reference to canvas
        canvas = document.getElementById("myCanvas");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.StageGL(canvas);
        stage.setClearColor("#669900");
        stage.enableMouseOver(10);

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.on("allAssetsLoaded", onReady);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    main();

})(); 