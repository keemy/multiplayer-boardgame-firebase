(function() {

function assert(bool, reason) {
	if(!bool) {
		alert('uh oh ' + reason);
	}
}

devin.games.push(function(requestMove) {
  this.dispose = function() {

  };

  var buttons = null;
  var CIRCLE_COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'yellow'];
  var rowLens=[2,3,2];
  this.redraw = function() {
    var availSize = parentDiv.getSize();
    availSize.x -= parentDiv.getStyle('margin-left').toInt() + parentDiv.getStyle('margin-right').toInt();
    availSize.y -= parentDiv.getStyle('margin-top').toInt() + parentDiv.getStyle('margin-bottom').toInt();

	var cardMargin = 15;	
	var buttonWidth=availSize.x/3 - cardMargin*2;
	var buttonHeight=availSize.y/3 - cardMargin*2;

	var k=0;
	for(var i =0; i < rowLens.length; i++) {
      for(var j = 0; j < rowLens[i]; j++) {
		var button= buttons[k];
		
		button.setStyle('width',buttonWidth);
		button.setStyle("height",buttonHeight);
		button.setStyle('top', i*buttonHeight + cardMargin*i);
		button.setStyle('left', buttonWidth*(3-rowLens[i])/2 + j*buttonWidth + cardMargin*j);
		
		for(var r = 0; r < button.circleDivs.length; r++) {
			var circleDiv = button.circleDivs[r];
			var circleSize = Math.min(buttonWidth/5, buttonHeight/7);
			circleDiv.setStyle('width', circleSize);
			circleDiv.setStyle('height', circleSize);
			circleDiv.setStyle('top', (buttonHeight-3*circleSize)/4 * ((r%3)+1) + (r%3)*circleSize);
			circleDiv.setStyle('left', (buttonWidth-2*circleSize)/3 * ((r%2)+1) + (r%2)*circleSize );
		}
		
		k++;
	  }
	}
  };

  function compare(a,b){
      return b-a;
  }
  this.moveValue = function(move){
  //console.log(move);//<<<
	return move.length;
   };
   
   function findLegalMove(){
		var l=0;
		var abc= [1,2,3,4,5,6,7];
		for(var c=0; c<=6;c++){
			l ^=deck[c];
		}
		if(l==0){
			return "lol win";
		}
		for(var i=0;i<5;i++){
			for(var j=0; j<5-i;j++){
				for(var k=0;k<5-i-j ;k++){
				    if((deck[i] ^ deck[i+j+1] ^ deck[i+j+k+2]) == 0){
					    return [i+1, i+j+2, i+j+k+3];
					}else if( (deck[i] ^ deck[i+j+1] ^ deck[i+j+k+2])==l){	
						abc.splice(abc.indexOf(i+j+k+3),1);
						abc.splice(abc.indexOf(i+j+2),1);
						abc.splice(abc.indexOf(i+1),1);
						return  abc;
					}else if((deck[i] ^ deck[i+j+1])==l){
						console.log(deck[i]);
						console.log(deck[i+j+1]);
						console.log(l);
						abc.splice(abc.indexOf(i+j+2),1);
						abc.splice(abc.indexOf(i+1),1);
						return  abc;
					}else if((deck[i+j+1] ^ deck[i+j+k+2])==l){
						abc.splice(abc.indexOf(i+j+k+3),1);
						abc.splice(abc.indexOf(i+j+2),1);
						return  abc;
					}else if((deck[i] ^ deck[i+j+k+2])==l){
						abc.splice(abc.indexOf(i+j+k+3),1);
						abc.splice(abc.indexOf(i+1),1);
						return  abc;
					}else if(deck[i]==l){
						abc.splice(abc.indexOf(i+1),1);
						return  abc;
					}else if(deck[i+k+1]==l){
						abc.splice(abc.indexOf(i+j+2),1);
						return  abc;
					}else if(deck[i+j+k+2]==l){
						abc.splice(abc.indexOf(i+j+k+3),1);
						return  abc;
					}
					
				}
				
			}
		}
		
		
		return [0,0,0];
   }
   function isLegalMove(move){
		if(move.length===0){
			return false;
		}
		var temp=0;
		for(var a=0; a<move.length;a++){
			assert(move[a]<=6, "you cheating piece of shit");
			temp ^= deck[move[a]];
		}
		return !temp;
    }
  this.applyMove = function(move) {
	
	move.sort(compare);
	for(var a=0; a<move.length; a++){	
		deck.splice(move[a],1);
	}
	
	redrawBoard();
  };

  function numToBitstring(num){
	var out= [0,0,0,0,0,0];
	for(var i=0; i<6;i++){
		out[i]=!!(num & (1<<i));
	}
	return out
  }
  var parentDiv;
  this.initialize = function(div) {
  //TODO WUT IF END OF GAME LOL WHOOPS
    parentDiv = div;
    buttons = [];
	var k=0;
    for(var i =0; i < rowLens.length; i++) {
      for(var j = 0; j < rowLens[i]; j++) {
        var button = document.createElement('div');
		button.addClass("setCard");
		
        button.setStyle('position', 'absolute');
		button.i = k;
        buttons.push(button);
        button.addEvent('click', buttonClicked);
        parentDiv.appendChild(button);
		
		button.circleDivs=[];

		for(var r=0; r<6; r++){
			var circleDiv= document.createElement('div');
			circleDiv.setStyle('background-color', CIRCLE_COLORS[r]);
			button.circleDivs.push(circleDiv);
			button.appendChild(circleDiv);
			circleDiv.addClass('setCircle');
			circleDiv.setStyle('position','absolute');
		}
		
		k++;
      }
    }
  };
  function redrawBoard(){
   for(var i=0; i<7 && i<deck.length ;i++){
	var circles= numToBitstring(deck[i]);
	for(var k=0; k<6;k++){
		if(circles[k]){
			buttons[i].circleDivs[k].show();
		}else{
			buttons[i].circleDivs[k].hide();
		}
	}
	
   }
   lol=findLegalMove();
   //alert(lol.join(" "));
   console.log(lol)
  }
  
  var deck= null;
  this.setState = function(rand) {
    deck = [];

	for(i=1; i<64;i++){
		deck.push(i);
	}
		
	for(i=0;i<1000;i++){
		var a=rand.genrand_int32()%deck.length;
		var b=rand.genrand_int32()%deck.length;
		var temp=deck[a];
		deck[a]=deck[b];
		deck[b]=temp;
	}
	redrawBoard();
  };

  this.isFinished = function() {
    if(deck.length){
		return false;
	}
    return true;
  };
	var move=[];
  function buttonClicked(e) {
    var i = this.i;
	if(move.indexOf(i)>=0){
		move.splice(move.indexOf(i),1);
		this.removeClass("selectedCard");
	}else{
		move.push(i);
		this.addClass("selectedCard");
	}
	if(isLegalMove(move)){
		requestMove(move);
	}
		
  }

});

})();