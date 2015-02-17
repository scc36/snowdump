/*** SnowDump - MainMenu
*/
BasicGame.MainMenu = function (game) {
	this.music = null;
	this.playButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.add.sprite(0, 0, 'background');
    this.cloud = this.add.sprite(100, 50, 'player');
    this.cloud.frame = 1;
    this.house = this.add.sprite(880, 50, 'house');
    this.house.frame = 1;

    this.startText = this.game.add.bitmapText(
      220, 550, 'alaska', 'Tap here to start SnowDump', 64
    );
    this.startText.inputEnabled = true;
    this.startText.events.onInputDown.add(this.startGame, this);

	},

	update: function () {
	},

	startGame: function (pointer) {
		//	And start the actual game
		this.state.start('Game');
	}

};
