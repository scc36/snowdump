/*** SnowDump - start
 * http://examples.phaser.io/
 */
window.onload = function() {
  // create Phaser game and inject it into the gameContainer div
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'gameContainer');

  //add the States
  game.state.add('Boot', BasicGame.Boot);
  game.state.add('Preloader', BasicGame.Preloader);
  game.state.add('MainMenu', BasicGame.MainMenu);
  game.state.add('Game', BasicGame.Game);

  //start the Boot state
  game.state.start('Boot');
};