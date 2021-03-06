/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;
exports.Literal = Literal;

var _rewritePattern = require("regexpu/rewrite-pattern");

var _rewritePattern2 = _interopRequireDefault(_rewritePattern);

var _import = require("../../helpers/regex");

var regex = _interopRequireWildcard(_import);

function shouldVisit(node) {
  return regex.is(node, "u");
}

function Literal(node) {
  if (!regex.is(node, "u")) return;
  node.regex.pattern = _rewritePattern2["default"](node.regex.pattern, node.regex.flags);
  regex.pullFlag(node, "u");
}