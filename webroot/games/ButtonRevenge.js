(function() {

var ROWS = 3;
var COLS = 3;
devin.games.push(function(requestMove) {
  this.dispose = function() {
    for(var i = 0; i < COLS; i++) {
      for(var j = 0; j < ROWS; j++) {
        buttons[i][j].dispose();
        buttons[i][j] = null;
      }
    }
  };

  var buttons = null;
  this.redraw = function() {
    var availSize = parentDiv.getSize();
    availSize.x -= parentDiv.getStyle('margin-left').toInt() + parentDiv.getStyle('margin-right').toInt();
    availSize.y -= parentDiv.getStyle('margin-top').toInt() + parentDiv.getStyle('margin-bottom').toInt();

    for(var i = 0; i < COLS; i++) {
      for(var j = 0; j< ROWS; j++) {
        var button = buttons[i][j];
        var buttonWidth = availSize.x/COLS;
        var buttonHeight = availSize.y/ROWS;
        button.setStyle('width', buttonWidth);
        button.setStyle('height', buttonHeight);
        button.setStyle('left', buttonWidth*i);
        button.setStyle('top', buttonHeight*j);
      }
    }
  };

  this.applyMove = function(move) {
    var i = move[0];
    var j = move[1];
    buttons[i][j].hide();
  };

  var parentDiv;
  this.initialize = function(div) {
    parentDiv = div;
    buttons = [];
    for(var i = 0; i < COLS; i++) {
      var buttonRow = [];
      buttons.push(buttonRow);
      for(var j = 0; j < ROWS; j++) {
        var button = document.createElement('input');
        button.setStyle('position', 'absolute');
        button.i = i;
        button.j = j;
        button.type = 'button';
        buttonRow.push(button);
        button.addEvent('click', buttonClicked);
        parentDiv.appendChild(button);
      }
    }
  };

  this.setState = function(rand) {
    // nothing to do here for a game so simple =)
    for(var i = 0; i < COLS; i++) {
      for(var j = 0; j < ROWS; j++) {
        var button = buttons[i][j];
        button.show();
      }
    }

  };

  this.isFinished = function() {
    for(var i = 0; i < buttons.length; i++) {
      for(var j = 0; j < buttons[i].length; j++) {
        if(buttons[i][j].isDisplayed()) {
          return false;
        }
      }
    }
    return true;
  };

  function buttonClicked(e) {
    var i = this.i;
    var j = this.j;
    var move = [ i, j ];
    requestMove(move);
  }

});

})();
