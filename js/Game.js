/*** SnowDump - Game
*/

// Some useful constants
constants = {
  "numWeeks": 16,
  "houseStartX": 1300,
  "houseStartY": 580,
  "houseSpeed": 500,
  "houseAcel": 20,
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

    // here we add an Player object to the stage. This is constructed using a prototype as defined below.
    this.game.add.existing(
      this.player = new Player(this.game, 250, 200, this.game.input)
    );
    this.player.frame = 1;
    
    // player movement (bounce when snowing)
    this.moveCloud = this.game.add.tween(this.player);
    this.moveCloud.to( { y: 150 }, 100, Phaser.Easing.Linear.None, true, 0, 1000, true);
    this.moveCloud.pause();
    
    // add House object. Constructed using prototype defined below
    this.game.add.existing(
      this.house = new House(this.game)
    );
    
    // snowing animation bitmap
    this.snowfall = this.add.sprite(100, 300, 'snowfall');
    this.snowfall.animations.add('snow');
    this.snowfall.animations.play('snow', 10, true);
    this.snowfall.renderable = false;
    
    // top left score counter
    this.scoreText = this.game.add.text(
      20, 20, "Score: 0", { font: '16px Arial', fill: '#ffffff' }
    );
    // top middle time left counter
    this.timeLeft = this.game.add.text(
      520, 20, "Houses Left Until Spring: " + constants.numWeeks, { font: '16px Arial', fill: '#ffffff' }
    );
    // central messages to player
    this.message = this.game.add.text(
      700, 170, "Tap to dump your honoured snow", { font: '32px Arial', fill: '#ffffff' }
    );
    
    this.score = 0;
  },

  update: function () {
    // tap anywhere in game to run action
    if (this.input.activePointer.isDown && this.house.snowedOn == false) {
      // if spring has arrived, end game
      if (this.house.houseCount > constants.numWeeks) {
        this.quitGame();
      }
      else {
        this.house.snowedOn = true;
        
        // hide certain faces until enough houses have passed
        if (this.house.houseCount > 4) {
          this.player.frame = Math.floor(Math.random()*4) + 2;
          this.message.setText("");
        }
        else {
          this.player.frame = Math.floor(Math.random()*2) + 2;
          this.message.setText("Aim for when directly over the house");
        }
        
        // calculated score of snow action, start snow animation
        var  snowValue = 300 - Math.floor(Math.abs(this.player.x - this.house.x))
        if (snowValue > 0) {
          this.score += Math.floor(snowValue * snowValue / 10) + 1;
          this.house.frame += 1;
        }
        this.moveCloud.resume();
        this.snowfall.renderable = true;
        
        // stop snow animation after 1 second
        this.time.events.add(Phaser.Timer.SECOND / 2, function () {
          this.moveCloud.pause();
          this.player.frame = 1;
          this.snowfall.renderable = false;
        }, this);
      }
    }
    
    this.scoreText.setText('Score: ' + this.score);
    this.timeLeft.setText('Weeks Left Until Spring: ' + (constants.numWeeks-this.house.houseCount));
    
    // remove gameplay elements once reach end
    if (this.house.houseCount > constants.numWeeks) {
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
}

//We give our player a type of Phaser.Sprite and assign it's constructor method.
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// House
var House = function(game) {
  //Give the blimp an x offscreen, a random y, and a speed between -150 and -250
  var x = constants.houseStartX;
  var y = constants.houseStartY;
  
  // create a sprite with the blimp graphic
  Phaser.Sprite.call(this, game, x, y, 'house');

  // the anchor is the 'center point' of the sprite. 0.5, 0.5 means it will be aligned and rotated by its center point.
  this.anchor.setTo(0.5, 0.5);
  
  // use physics engineto automatically move house
  game.physics.enable(this, Phaser.Physics.ARCADE);  
  this.body.velocity.x = -1 * constants.houseSpeed;
  this.body.acceleration.x = -1 * constants.houseAcel;
  
  // unique house object properties
  this.houseCount = 0;
  this.snowedOn = false;
}

House.prototype = Object.create(Phaser.Sprite.prototype);
House.prototype.constructor = House;
House.prototype.update = function(){
  // "create" a new house once it reaches the left side
  if (this.body.x < -300) {
    this.body.x = constants.houseStartX;
    this.snowedOn = false;
    this.houseCount++;
    
    // assign a house appearance based
    if (this.houseCount < 4) {
      // go through original sprites (0, 3, 6, 9)
      this.frame = this.houseCount*3;
    }
    else {
      // select a random house appearance from sprite map (0, 1, 3, 4...)
      var houseFrame = Math.floor(Math.random()*8);
      this.frame = Math.floor(houseFrame/2)*3 + (houseFrame%2);
    }
  }
}

function newGame(){
  //This sets the state of your game to a fresh version of GameState, starting it all over again.
  game.state.add('game', GameState, true);
}