(function() {

var braceRef = new Firebase('keemy.firebaseIO.com/');

function stringToBytes(str) {
  var ch, st, re = [];
  for(var i = 0; i < str.length; i++ ) {
    ch = str.charCodeAt(i);  // get char 
    st = [];                 // set up "stack"
    do {
      st.push( ch & 0xFF );  // push byte to stack
      ch = ch >> 8;          // shift value down by 1 byte
    } while(ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  var temp2 = 0;
  for(i = 0; i < re.length; i++) {
    temp2 ^= re[i];
  }
  return temp2;
}

var userId = 0;

var channelName, channelRef, usersRef, movesRef, lastMoveIdRef, lastGameIdRef;
var userRef;

var game;
var gameId;
function joinChannel(channel_) {
  if(movesRef) {
    // TODO gah, wtf is this shit, do we need it?
    movesRef.off('child_added', moveAdded);
    usersRef.off('child_added', userAdded);
  }

  if(channel_ === "") {
    document.location.hash = "pimps@sea";
    return;
  }
  channelName = document.location.hash.substring(1);

  // TODO - check for valid chars?
  channelRef = braceRef.child(channelName);
  usersRef = channelRef.child('users');
  usersRef.on('child_changed', userJoined);
  usersRef.on('child_added', userJoined);
  
  
  var lastUserIdRef = channelRef.child('lastUserId');
  lastUserIdRef.transaction(function(lastUserId) {
    return lastUserId+1;
  }, function(success, snapshot) {
    if(success) {
      userId = snapshot.val();

	  var fname=prompt("name: ", "Player "+userId);
	  
      userRef = usersRef.child(userId);
      userRef.set({ id: userId, name: fname });
      userRef.removeOnDisconnect();
	  /*presenceRef = userRef.child('online');
      presenceRef.setOnDisconnect(false);
      presenceRef.set(true);*/
    }
  });

  // TODO - store the game somewhere?
  var gameClass = devin.games[0];
  if(game) {
    game.dispose();
  }
  game = new gameClass(requestMove);
  game.initialize(gameDiv);

  lastGameIdRef = channelRef.child('lastGameId');
  var gamesRef = channelRef.child('games');
  lastGameIdRef.on('value', function(lastGameId) {
    gameId = lastGameId.val() || 0;
    gameRef = gamesRef.child(gameId);
		
    var seed = stringToBytes(channelName) + lastGameId;
    var rand = new MersenneTwister(seed);
    game.setState(rand);
    windowResized();

    // We can't start reacting to turns until we have initialized our board!
    movesRef = gameRef.child('moves');
    movesRef.on('child_added', moveAdded);

    lastMoveIdRef = gameRef.child('lastMoveId');
  });
}

var onlineUsers = {};
function userJoined(snapshot, prevChildName) {
  var user = snapshot.val();
    onlineUsers[user.id] = user;
  /*if(user.online) {
    onlineUsers[user.id] = user;
  } else {
    delete onlineUsers[user.id];
  }*/

  userList.empty();
  var list = document.createElement('ul');
  userList.appendChild(list);
  for(var id in onlineUsers) {
    if(onlineUsers.hasOwnProperty(id)) {
      user = onlineUsers[id];
      var userEntry = document.createElement('li');
      var txt = user["name"]+":  "+user["score"];// JSON.stringify(user);
      userEntry.appendChild(document.createTextNode(txt));
      list.appendChild(userEntry);
    }
  }
}

function urlChanged() {
  joinChannel(document.location.hash.substring(1));
}

function requestMove(move) {
  // TODO - is this really the firebase way?
  jsonMove = JSON.stringify(move);

  //movesRef.push().set(move);

  // TODO - this stuff is slow, and i don't think it works
  lastMoveIdRef.transaction(function(currLastMoveId) {
    return currLastMoveId + 1;   
  }, function(success, snapshot) {
    if(success) {
      // TODO - i don't see any reason why this would actually provide the
      // atomicity we are looking for
      movesRef.push().set(jsonMove);

      var myself = onlineUsers[userId];
      //TODO query game for value of move
      myself.score = (myself.score || 0) + game.moveValue(move);
      userRef.set(myself);
    }
  });
}

function moveAdded(snapshot) {
  var move = JSON.parse(snapshot.val());
  game.applyMove(move);
  if(game.isFinished()) {
    alert("Game over! Starting a new one...");
    //TODO - comment on why we don't want to use transaction here...
    lastGameIdRef.set(gameId+1);
  }
}

function windowResized() {
  var userListWidth = 200;

  var availSpace = window.getSize();
  availSpace.x -= document.body.getStyle('margin-left').toInt() + document.body.getStyle('margin-right').toInt();
  availSpace.y -= document.body.getStyle('margin-top').toInt() + document.body.getStyle('margin-bottom').toInt();

  gameDiv.setStyle('width', availSpace.x - userListWidth);
  gameDiv.setStyle('height', availSpace.y);
  userList.setStyle('top', 0);
  userList.setStyle('left', availSpace.x - userListWidth);
  if(game) {
    game.redraw(gameDiv);
  }
}


var gameDiv, userList;
window.addEvent('load', function() {
  gameDiv = document.getElementById('gameDiv');
  userList = document.getElementById('userList');
  gameDiv.setStyle('display', 'inline-block');
  userList.setStyle('position', 'absolute');
  
  window.addEventListener("hashchange", urlChanged, false);
  window.addEvent("resize", windowResized);
  urlChanged();
});

})();
