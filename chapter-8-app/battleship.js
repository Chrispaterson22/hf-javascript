var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
          {locations: [0, 0, 0], hits: ["", "", ""]},
          {locations: [0, 0, 0], hits: ["", "", ""]}],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      }
      while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2); // generate random number 0 or 1
    var row;
    var col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1))); // to gen random no. between 0-4 (based on boardSize = 7)
    }
    else {
      row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = []; // empty array for new ship loc
    for (var i = 0; i < this.shipLength; i++) { // loop for number of lactions in a ship
      if (direction === 1) { // need diff code for horizontal/vert ship orientation
        newShipLocations.push(row + "" + (col + i)); // + i used to add additional locations as iterates through ship length.
      }
      else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;

  },

  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) { // iterating through ships locations array and checking for var locations allready in array.
          return true;
        }
      }

    }
    return false; // there was no collision
  }
};

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
                              this.guesses + " guesses");
      }
    }
  },
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.")
  }
  else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    }
    else if (row < 0 || row >= model.boardSize || column < 0 ||
              column >= model.boardSize) {
      alert("Oops, that's off the board!");
    }
    else {
      return row + column; // concatenating num + string = string
    }
  }
  return null; // if get here there was a failed check, so return null
}

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress; // key press event handler
  model.generateShipLocations(); // generate ship locs on init
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput"); // get reference to input form element
  var guess = guessInput.value; // store guess from guess input
  controller.processGuess(guess); // passing players guess to controller
  guessInput.value = ""; // reset form input to empty string
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) { // keyCode for RETURN is 13.
    fireButton.click(); // if RETURN 13, then act like fire button clicked
    return false; // ret false to stop any further actions
  }
}

window.onload = init;

// test code for view object
/*
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Tap tap, is this thing on?");
*/

// test code for model object
/*
model.fire("53"); // miss

model.fire("06"); // hit
model.fire("16"); // hit
model.fire("26"); // hit

model.fire("34"); // hit
model.fire("24"); // hit
model.fire("44"); // hit

model.fire("12"); // hit
model.fire("11"); // hit
model.fire("10"); // hit
*/

// test code for parseGuess function
/*
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));
*/

// controller test code
// You should see three ships on the board, one miss, and the message
// "You sank all my battleships in 10 guesses"
/*
controller.processGuess("A0"); // miss

controller.processGuess("A6"); // hit
controller.processGuess("B6"); // hit
controller.processGuess("C6"); // hit

controller.processGuess("C4"); // hit
controller.processGuess("D4"); // hit
controller.processGuess("E4"); // hit

controller.processGuess("B0"); // hit
controller.processGuess("B1"); // hit
controller.processGuess("B2"); // hit
*/
