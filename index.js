var Uno = require("./src/Uno.js");
var RULE = require("./src/Rules");

// Define an array of rules to be applied in the Uno game
const RULES = [RULE.ACUMULATE_TAKE_CARDS];
const PLAYERS = 4;

// Create a new Uno game instance with X players and the specified rules
new Uno(PLAYERS, RULES);
