window.onload = function() {
  //	Create Phaser game and inject it into the gameContainer div
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'gameContainer');

  //	Add the States
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);

  //	Now start the Boot state
  game.state.start('Boot');
};

//http://examples.phaser.io/
//http://examples.phaser.io/_site/view_full.html?d=tweens&f=bubbles.js&t=bubbles