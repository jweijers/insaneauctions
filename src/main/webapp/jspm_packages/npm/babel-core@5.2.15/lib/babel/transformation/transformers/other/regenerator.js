/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;

var _regenerator = require("regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _import = require("../../../types");

var t = _interopRequireWildcard(_import);

function shouldVisit(node) {
  return t.isFunction(node) && (node.async || node.generator);
}

var Program = {
  enter: function enter(ast) {
    _regenerator2["default"].transform(ast);
    this.stop();
    this.checkSelf();
  }
};
exports.Program = Program;