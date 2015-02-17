/*** SnowDump - Game
*/

// Some useful constants
constants = {
  "numDays": 50,
  "houseStartX": 1300,
  "houseStartY": 580,
  "houseSpeed": 400,
  "houseAcel": 2,
};

BasicGame.Game = function (game) {
  // When a State is added to Phaser it automatically has the following properties set on it, even if they already exists
  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
};

BasicGame.Game.prototype = {
  create: function () {
    this.add.sprite(0, 0, 'background');

    //Here we add an Player object to the stage. This is constructed using a prototype as defined below.
    this.game.add.existing(
      this.player = new Player(this.game, 250, 200, this.game.input)
    );
    this.player.frame = 1;
    this.moveCloud = this.game.add.tween(this.player);
    this.moveCloud.to( { y: 150 }, 100, Phaser.Easing.Linear.None, true, 0, 1000, true);
    this.moveCloud.pause();
    
    this.game.add.existing(
      this.house = new House(this.game)
    );
    
    this.snowfall = this.add.sprite(100, 300, 'snowfall');
    this.snowfall.animations.add('snow');
    this.snowfall.animations.play('snow', 10, true);
    this.snowfall.renderable = false;
    
    // Top left score counter
    this.scoreText = this.game.add.text(
      20, 20, "Score: 0", { font: '16px Arial', fill: '#ffffff' }
    );
    // Top middle time left counter
    this.timeLeft = this.game.add.text(
      520, 20, "Houses Left Until Spring: " + constants.numDays, { font: '16px Arial', fill: '#ffffff' }
    );
    // Central messages to player
    this.message = this.game.add.text(
      700, 170, "Tap to dump your honoured snow", { font: '32px Arial', fill: '#ffffff' }
    );
      
    this.score = 0;
  },

  update: function () {
    if (this.input.activePointer.isDown && this.house.snowedOn == false) {
      if (this.house.houseCount > constants.numDays) {
        this.quitGame();
      }
      else {
        this.house.snowedOn = true;
        if (this.house.houseCount > 4) {
          this.player.frame = Math.floor(Math.random()*4) + 2;
          this.message.setText("");
        }
        else {
          this.player.frame = Math.floor(Math.random()*2) + 2;
          this.message.setText("Aim for when directly over the house");
        }
        
        var  snowValue = 300 - Math.floor(Math.abs(this.player.x - this.house.x))
        if (snowValue > 0) {
          this.score += snowValue;
          this.house.frame += 1;
        }
        
        this.moveCloud.resume();
        this.snowfall.renderable = true;
        this.time.events.add(Phaser.Timer.SECOND, function () {
          this.moveCloud.pause();
          this.player.frame = 1;
          this.snowfall.renderable = false;
        }, this);
      }
    }
    
    this.scoreText.setText('Score: ' + this.score);
    this.timeLeft.setText('Days Left Until Spring: ' + (constants.numDays-this.house.houseCount));
    
    if (this.house.houseCount > constants.numDays) {
      this.player.destroy();
      this.house.destroy();
      this.snowfall.destroy();
      this.timeLeft.setText("SPRING!");
      this.game.add.text(
        350, 400, "Spring has arrived. Final Score: " + this.score, { font: '32px Arial', fill: '#ffffff' }
      );
    }
  },

  quitGame: function () {
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');
  }

};

// The player cloud
var Player = function(game, x, y, target){
  //Here's where we create our player sprite.
  Phaser.Sprite.call(this, game, x, y, 'player');
  
  //We set the game input as the target
  this.target = target;
  //The anchor is the 'center point' of the sprite. 0.5, 0.5 means it will be aligned and rotated by its center point.
  this.anchor.setTo(0.5, 0.5);
  
  //And an easing constant to smooth the movement
  this.easer = .5;
  
  this.snowing = 0;     // Whether to be snowing
  this.snowed = false;  // can only snow if haven't snowed before
  this.face = 0;        // What cloud face to show
  //game.add.tween(sprite).to({ y: -256 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);
}

//We give our player a type of Phaser.Sprite and assign it's constructor method.
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(){
  if (this.snowing > 0) {
    this.snowing--;
  }
  else {
    // Set cloud face to neutral
  }
}

// House
var House = function(game) {

  //Give the blimp an x offscreen, a random y, and a speed between -150 and -250
  var x = constants.houseStartX;
  var y = constants.houseStartY;
  
  //Create a sprite with the blimp graphic
  Phaser.Sprite.call(this, game, x, y, 'house');

  game.physics.enable(this, Phaser.Physics.ARCADE);
  
  //The anchor is the 'center point' of the sprite. 0.5, 0.5 means it will be aligned and rotated by its center point.
  this.anchor.setTo(0.5, 0.5);
  
  this.body.velocity.x = -1 * constants.houseSpeed;
  this.body.acceleration.x = -1 * constants.houseAcel;
  
  this.houseCount = 0;
  this.snowedOn = false;
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;
House.prototype.update = function(){
  if (this.body.x < -300) {
    this.body.x = constants.houseStartX;
    this.snowedOn = false;
    this.houseCount++;
    if (this.houseCount < 4) {
      this.frame = this.houseCount*3;
    }
    else {
      var houseFrame = Math.floor(Math.random()*8);
      this.frame = Math.floor(houseFrame/2)*3 + (houseFrame%2);
    }
  }
}

function newGame(){
  //This sets the state of your game to a fresh version of GameState, starting it all over again.
  game.state.add('game', GameState, true);
}