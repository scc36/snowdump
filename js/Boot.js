/*** SnowDump - Boot
*/

var BasicGame = {};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {
  init: function () {
    // single touch
    this.input.maxPointers = 1;

    // pause if the browser tab the game is in loses focus
    this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop)
    {
      // desktop specific settings, they can go in here
      this.scale.pageAlignHorizontally = true;
    }
    else
    {
      // mobile settings
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.setScreenSize();
      this.scale.setMinMax(480, 320, 1280, 720);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }
  },
  preload: function () {
    // load the assets required for preloader
    this.load.image('preloaderBackground', 'images/preload.jpg');
    this.load.image('preloaderBar', 'images/loadbar.jpg');
  },
  create: function () {
    this.state.start('Preloader');
  }
};
