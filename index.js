var Uno = require("./src/Uno.js");
var RULE = require("./src/Rules");

const RULES = [RULE.ACUMULATE_TAKE_CARDS];

const uno = new Uno(4, RULES);
