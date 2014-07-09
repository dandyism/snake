"use strict";

(function(root) {
  
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});
  var View = SnakeGame.View = function($el){
    this.$el = $el;
  };
  
  View.handleKeyEvent = function(event) {
    switch (event.keyCode) {
    case 37:
      return "W";
    case 38:
      return "N";
    case 39:
      return "E";
    case 40:
      return "S";
    }
  };
  
  View.prototype.start = function () {
    var that = this;
    this.board = new SnakeGame.Board( function() {
      clearInterval(that.intervalID);
    });
    $('body').on("keydown", function(event) {
      var dir = SnakeGame.View.handleKeyEvent(event);
      that.board.snake.turn(dir);
    })
    
    this.intervalID = setInterval(this.step.bind(this), 250);
  };
  
  View.prototype.step = function () {
    this.board.step();
    this.$el.empty();
    this.$el.html(this.board.render());
  };
  
})(this)