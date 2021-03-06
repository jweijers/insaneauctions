/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;
exports.ObjectExpression = ObjectExpression;

var _memoiseDecorators = require("../../helpers/memoise-decorators");

var _memoiseDecorators2 = _interopRequireDefault(_memoiseDecorators);

var _import = require("../../helpers/define-map");

var defineMap = _interopRequireWildcard(_import);

var _import2 = require("../../../types");

var t = _interopRequireWildcard(_import2);

var metadata = {
  optional: true,
  stage: 1
};

exports.metadata = metadata;

function shouldVisit(node) {
  return !!node.decorators;
}

function ObjectExpression(node, parent, scope, file) {
  var hasDecorators = false;
  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];
    if (prop.decorators) {
      hasDecorators = true;
      break;
    }
  }
  if (!hasDecorators) return;

  var mutatorMap = {};

  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];
    if (prop.decorators) _memoiseDecorators2["default"](prop.decorators, scope);

    if (prop.kind === "init") {
      prop.kind = "";
      prop.value = t.functionExpression(null, [], t.blockStatement([t.returnStatement(prop.value)]));
    }

    defineMap.push(mutatorMap, prop, "initializer", file);
  }

  var obj = defineMap.toClassObject(mutatorMap);
  obj = defineMap.toComputedObjectFromClass(obj);
  return t.callExpression(file.addHelper("create-decorated-object"), [obj]);
}