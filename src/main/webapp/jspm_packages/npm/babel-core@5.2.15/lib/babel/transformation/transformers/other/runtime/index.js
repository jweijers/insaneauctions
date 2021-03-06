/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _includes = require("lodash/collection/includes");

var _includes2 = _interopRequireDefault(_includes);

var _traverse = require("../../../../traversal");

var _traverse2 = _interopRequireDefault(_traverse);

var _import = require("../../../../util");

var util = _interopRequireWildcard(_import);

var _has = require("lodash/object/has");

var _has2 = _interopRequireDefault(_has);

var _import2 = require("../../../../types");

var t = _interopRequireWildcard(_import2);

var _definitions = require("./definitions");

var _definitions2 = _interopRequireDefault(_definitions);

var isSymbolIterator = t.buildMatchMemberExpression("Symbol.iterator");

var RUNTIME_MODULE_NAME = "babel-runtime";

var astVisitor = _traverse2["default"].explode({
  Identifier: function Identifier(node, parent, scope, file) {
    if (!this.isReferenced()) return;
    if (t.isMemberExpression(parent)) return;
    if (!_has2["default"](_definitions2["default"].builtins, node.name)) return;
    if (scope.getBindingIdentifier(node.name)) return;

    // Symbol() -> _core.Symbol(); new Promise -> new _core.Promise
    var modulePath = _definitions2["default"].builtins[node.name];
    return file.addImport("" + RUNTIME_MODULE_NAME + "/core-js/" + modulePath, node.name, "absoluteDefault");
  },

  CallExpression: function CallExpression(node, parent, scope, file) {
    // arr[Symbol.iterator]() -> _core.$for.getIterator(arr)

    var callee = node.callee;
    if (node.arguments.length) return;

    if (!t.isMemberExpression(callee)) return;
    if (!callee.computed) return;

    var prop = callee.property;
    if (!isSymbolIterator(prop)) return;

    return t.callExpression(file.addImport("" + RUNTIME_MODULE_NAME + "/core-js/get-iterator", "getIterator", "absoluteDefault"), [callee.object]);
  },

  BinaryExpression: function BinaryExpression(node, parent, scope, file) {
    // Symbol.iterator in arr -> core.$for.isIterable(arr)

    if (node.operator !== "in") return;

    var left = node.left;
    if (!isSymbolIterator(left)) return;

    return t.callExpression(file.addImport("" + RUNTIME_MODULE_NAME + "/core-js/is-iterable", "isIterable", "absoluteDefault"), [node.right]);
  },

  MemberExpression: {
    enter: function enter(node, parent, scope, file) {
      // Array.from -> _core.Array.from

      if (!this.isReferenced()) return;

      var obj = node.object;
      var prop = node.property;

      if (!t.isReferenced(obj, node)) return;

      if (node.computed) return;

      if (!_has2["default"](_definitions2["default"].methods, obj.name)) return;

      var methods = _definitions2["default"].methods[obj.name];
      if (!_has2["default"](methods, prop.name)) return;

      if (scope.getBindingIdentifier(obj.name)) return;

      var modulePath = methods[prop.name];
      return file.addImport("" + RUNTIME_MODULE_NAME + "/core-js/" + modulePath, "" + obj.name + "$" + prop.name, "absoluteDefault");
    },

    exit: function exit(node, parent, scope, file) {
      if (!this.isReferenced()) return;

      var prop = node.property;
      var obj = node.object;

      if (!_has2["default"](_definitions2["default"].builtins, obj.name)) return;
      if (scope.getBindingIdentifier(obj.name)) return;

      var modulePath = _definitions2["default"].builtins[obj.name];
      return t.memberExpression(file.addImport("" + RUNTIME_MODULE_NAME + "/core-js/" + modulePath, "" + obj.name, "absoluteDefault"), prop);
    }
  }
});

exports.metadata = {
  optional: true
};

exports.Program = function (node, parent, scope, file) {
  this.traverse(astVisitor, file);
};

exports.pre = function (file) {
  file.set("helperGenerator", function (name) {
    return file.addImport("" + RUNTIME_MODULE_NAME + "/helpers/" + name, name, "absoluteDefault");
  });

  file.setDynamic("regeneratorIdentifier", function () {
    return file.addImport("" + RUNTIME_MODULE_NAME + "/regenerator", "regeneratorRuntime", "absoluteDefault");
  });
};

exports.Identifier = function (node, parent, scope, file) {
  if (this.isReferencedIdentifier({ name: "regeneratorRuntime" })) {
    return file.get("regeneratorIdentifier");
  }
};