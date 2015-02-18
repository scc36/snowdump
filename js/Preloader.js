/*** SnowDump - Preloader
*/

BasicGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

BasicGame.Preloader.prototype = {
	preload: function () {
		// load bar assets
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(332, 150, 'preloaderBar');

		// set the preloadBar sprite as a loader sprite.
		this.load.setPreloadSprite(this.preloadBar);
    
		// game assets
		this.load.image('background', 'images/background.jpg');
    this.load.spritesheet('player', 'images/cloud-faces.png', 300, 300);
    this.load.spritesheet('house', 'images/all-houses.png', 300, 300);
    this.load.spritesheet('snowfall', 'images/snow-fall.png', 300, 400);
    
    // fonts
    this.load.bitmapFont('alaska', 'fonts/alaska.png', 'fonts/alaska.fnt');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},
  
  update: function () {
    // removed sound encoding condition
    if (this.ready == false) {
      this.ready = true;
      this.state.start('MainMenu');
    }
  }
};
