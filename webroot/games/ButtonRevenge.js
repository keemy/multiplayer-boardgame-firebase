(function() {

devin.games.push(function(requestMove) {
  this.dispose = function() {
  };

  var button;
  this.redraw = function(div) {
    if(!button) {
      button = document.createElement('input');
      button.type = 'button';
      div.appendChild(button);
    }

    var availSize = div.getSize();
    button.setStyle('width', div.x);
    button.setStyle('height', div.y);
  };

  this.applyMove = function(move) {
    //button.
  };

  this.initialize = function(rand) {
    
  };

});

})();
