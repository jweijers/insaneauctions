/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;
// https://github.com/rwaldron/exponentiation-operator

var _build = require("../../helpers/build-binary-assignment-operator-transformer");

var _build2 = _interopRequireDefault(_build);

var _import = require("../../../types");

var t = _interopRequireWildcard(_import);

var metadata = {
  stage: 2
};

exports.metadata = metadata;
var MATH_POW = t.memberExpression(t.identifier("Math"), t.identifier("pow"));

_build2["default"](exports, {
  operator: "**",

  build: function build(left, right) {
    return t.callExpression(MATH_POW, [left, right]);
  }
});