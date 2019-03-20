class QuickTimeEvent {
    constructor(stage, assetManager){
        // sets up visuals for the qte popup keys

        this._stage = stage;

        //setup button symbols here
        this._key = assetManager.getSprite("assets");
        this._key.gotoAndStop("blank");
        this._key.x = 0;
        this._key.y = 0;

    }
// hide and show the key when the player has to react to it
    showKey(){
        this._stage.addChild(this._key);
    }

    hideKey(){
        this._stage.removeChild(this._key);
    }
// sets the key graphics name to the random key pulled as to display the key that need to be pressed.
// this could techinqually have every key on the keyboard if i wanted it to. but i use arrow keys for "motion"
    randomKey(){
        let frameKey = this.randomKeyCode(37,40);
        let frameKeyString = String(frameKey);
        this._key.gotoAndStop("key" + frameKeyString);
        console.log("keycode :" + frameKey);
        console.log("framkeystring : " + frameKeyString);
        //37,38,39,40
        //left up right down
        return frameKey;
    }
// choses a random number between 37-40, the keycodes for up,down,left,right
    randomKeyCode(low, high) {
        // returns a random number
        return Math.floor(Math.random() * (1 + high - low)) + low;
    }

}