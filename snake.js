"use strict";

(function (root) {
  
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});
  var Snake = SnakeGame.Snake = function(dir, segments){
    this.dir = dir;
    this.segments = segments;

  };
  
  Snake.prototype.moveHead = function () {
    var head = _.first(this.segments);
    var x = head[0];
    var y = head[1];
    
    switch (this.dir) {
      case "N":
        y -= 1;
        break;
    
      case "E":
        x += 1;
        break;
    
      case "S":
        y += 1;
        break;
    
      case "W":
        x -= 1;
    }

      head[0] = x;
      head[1] = y;    
  };
  
  Snake.prototype.move = function() {
    var that = this;
    
    for (var i = this.segments.length - 1; i > 0; i--) {
      var segment = this.segments[i];
      var nextSeg = that.nextSegment(segment);
      that.stepTowardSegment(segment, nextSeg);
    }
    
    this.moveHead();
   
    return true;
  };
  
  Snake.prototype.addSegment = function () {
    var tail = _.last(this.segments);
    var body = this.segments[this.segments.length - 2];
    var x = tail[0];
    var y = tail[1];
    
    if (body[0] > x) {
      x -= 1;
    } else if (body[0] < x) {
      x += 1;
    } else if (body[1] > y) {
      y -= 1;
    } else if (body[1] < y) {
      y += 1;
    }
    
    this.segments.push([x, y]);
  };
  
  Snake.prototype.isSegment = function (pos) {
    return !!_.findWhere(this.segments, {
      0: pos[0],
      1: pos[1]
    });
  };
  
  Snake.prototype.nextSegment = function (segment) {
    var index = _.indexOf(this.segments, segment);
    
    // FIXME: next segment should be allowed to be undefined
    return this.segments[index - 1] || _.first(this.segments);
  };
  
  Snake.prototype.stepTowardSegment = function (srcSeg, dstSeg) {
    var x1 = srcSeg[0];
    var y1 = srcSeg[1];
    
    var x2 = dstSeg[0];
    var y2 = dstSeg[1];
    
    if (x1 > x2) {
      x1 -= 1;
    } else if (x1 < x2) {
      x1 += 1;
    } else if (y1 > y2) {
      y1 -= 1;
    } else if (y1 < y2) {
      y1 += 1;
    }
    
    srcSeg[0] = x1;
    srcSeg[1] = y1;
  };
  
  Snake.prototype.moveCalc = function (dir, segment) {
    var x = segment[0];
    var y = segment[1];
    switch (dir) {
    case "N":
      y--;
      break;
    case "S":
      y++;
      break;
    case "W":
      x--;
      break;
    case "E":
      x++;
      break;
    }
    return [x, y];
  };
  
  Snake.prototype.turn = function (dir) {
    var head = this.segments[0];
    var pos = this.moveCalc(dir, head);
    
    if (!this.isSegment(pos)) {
      this.dir = dir;
    }
  };
  
  Snake.prototype.isCollided = function () {
    var head = this.segments[0];
    var tail = this.segments.slice(1);
    var pos = this.moveCalc(this.dir, head);
    var collision = _.findWhere(tail, {
      0: pos[0],
      1: pos[1]
    });
    return !!collision;
  };
  
  var Board = SnakeGame.Board = function(losingCallback) {
    this.snake = new Snake("S", [
      [0,2],
      [0,1],
      [0,0]
    ]);
    this.apples = [[10,10]];
    this.losingCallback = losingCallback;
  };
  
  Board.DIM_X = 20;
  Board.DIM_Y = 20;
  
  Board.prototype.render = function () {
    var output = "";
    
    for (var j = 0; j < Board.DIM_Y; j++) {
      for (var i = 0; i < Board.DIM_X; i++) {
        var segment = _.findWhere(this.snake.segments,{
          0: i,
          1: j
        });
        
        var apple = _.findWhere(this.apples, {
          0: i,
          1: j
        });
        
        if (segment) {
          output += '<li class="snake"></li>';
        } else if (apple) {
          output += '<li class="apple"></li>';
        } else {
          output += '<li></li>';
        }
      }
      
    }
    
    return output;
  };
  
  Board.prototype.addApple = function () {
    var x = Math.floor(Math.random() * (Board.DIM_X - 1));
    var y = Math.floor(Math.random() * (Board.DIM_Y - 1));
    
    this.apples.push([x, y]);
  };
  
  Board.prototype.step = function () {
    var snake = this.snake;
    var head = snake.segments[0];
    
    snake.move();
    if (snake.isCollided()) {
      this.losingCallback();
      return;
    }
    
    var apple = _.findWhere(this.apples, {
      0: head[0],
      1: head[1]
    });
    
    if (apple) {
      this.apples = _.without(this.apples, apple);
      snake.addSegment();
      this.addApple();
    };  
  };
  


  
})(this);