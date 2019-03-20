/*
* AssetManager Class for ZOE workflow
* GAME2050 Game Programming I
* Sean Morrow
*/

class AssetManager {

    constructor(stage) {
        this._stage = stage;
        // array of spritesheet objects
        this._spriteSheets = [];
        // array of JSON for each spritesheet
        this._spriteSheetsJSON = [];
        // LoadQueue object
        this._preloader = new createjs.LoadQueue();
        // construct custom event object and initialize it
        this._eventAllLoaded = new createjs.Event("allAssetsLoaded");
    }

	// ------------------------------------------------------ event handlers
    onLoaded(e) {

        console.log("asset loaded: " + e.item.src + " type: " + e.item.type);

        // what type of asset was loaded?
        switch(e.item.type) {
            case createjs.Types.IMAGE:
                // spritesheet loaded
                // get id and source from manifest of currently loaded spritesheet
                let id = e.item.id;
                // store a reference to the actual image that was preloaded
                let image = e.result;
                // get data object from JSON array (previously loaded)
                let data = this._spriteSheetsJSON[id];
                // add images property to data object and tack on loaded spritesheet image from LoadQueue
                // this is so that the SpriteSheet constructor doesn't preload the image again
                // it will do this if you feed it the string path of the spritesheet
                data.images = [image];
                // construct Spritesheet object from source
                let spriteSheet = new createjs.SpriteSheet(data);
                // store spritesheet object for later retrieval
                this._spriteSheets[id] = spriteSheet;
                break;

            case createjs.Types.JSON:
                // get spritesheet this JSON object belongs to and store for spritesheet construction later
                let spriteSheetID = e.item.forSpritesheet;
                this._spriteSheetsJSON[spriteSheetID] = e.result;
                break;
        }
    }

    // called if there is an error loading the spriteSheet (usually due to a 404)
    onError(e) {
        console.log("ASSETMANAGER ERROR > Error Loading asset");
    }

    onComplete(e) {
        console.log(">> All assets loaded");
        this._spriteSheetsJSON = null;
        // kill event listeners
        this._preloader.removeAllEventListeners();
        // dispatch event that all assets are loaded
        this._stage.dispatchEvent(this._eventAllLoaded);
    }

	// ------------------------------------------------------ public methods
    getSprite(spriteSheetID) {
        // construct sprite object to animate the frames (I call this a clip)
        let sprite = new createjs.Sprite(this._spriteSheets[spriteSheetID]);
        sprite.name = spriteSheetID;
        sprite.x = 0;
        sprite.y = 0;
        sprite.currentFrame = 0;
        return sprite;
    }

	getSpriteSheet(id) {
		return this._spriteSheets[id];
	}

    loadAssets(manifest) {
        // register different plugins for sound playback in browsers when available
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
        // if browser doesn't suppot the ogg it will attempt to look for an mp3
        createjs.Sound.alternateExtensions = ["mp3","wav"];
        // registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
        this._preloader.installPlugin(createjs.Sound);

        // best solution is to use createjs on method which is an abstraction on addEventListener
        // third argument let's you pass in the scope of this
        this._preloader.on("fileload", this.onLoaded, this);
        this._preloader.on("error", this.onError, this);
        this._preloader.on("complete", this.onComplete, this);

        this._preloader.setMaxConnections(1);
        // load first spritesheet to start preloading process
        this._preloader.loadManifest(manifest);
    }
}