/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;
exports.JSXAttribute = JSXAttribute;
exports.JSXIdentifier = JSXIdentifier;
exports.JSXNamespacedName = JSXNamespacedName;
exports.JSXMemberExpression = JSXMemberExpression;
exports.JSXSpreadAttribute = JSXSpreadAttribute;
exports.JSXExpressionContainer = JSXExpressionContainer;
exports.JSXElement = JSXElement;
exports.JSXOpeningElement = JSXOpeningElement;
exports.JSXClosingElement = JSXClosingElement;
exports.JSXEmptyExpression = JSXEmptyExpression;

var _each = require("lodash/collection/each");

var _each2 = _interopRequireDefault(_each);

var _import = require("../../types");

var t = _interopRequireWildcard(_import);

function JSXAttribute(node, print) {
  print(node.name);
  if (node.value) {
    this.push("=");
    print(node.value);
  }
}

function JSXIdentifier(node) {
  this.push(node.name);
}

function JSXNamespacedName(node, print) {
  print(node.namespace);
  this.push(":");
  print(node.name);
}

function JSXMemberExpression(node, print) {
  print(node.object);
  this.push(".");
  print(node.property);
}

function JSXSpreadAttribute(node, print) {
  this.push("{...");
  print(node.argument);
  this.push("}");
}

function JSXExpressionContainer(node, print) {
  this.push("{");
  print(node.expression);
  this.push("}");
}

function JSXElement(node, print) {
  var _this = this;

  var open = node.openingElement;
  print(open);
  if (open.selfClosing) return;

  this.indent();
  _each2["default"](node.children, function (child) {
    if (t.isLiteral(child)) {
      _this.push(child.value, true);
    } else {
      print(child);
    }
  });
  this.dedent();

  print(node.closingElement);
}

function JSXOpeningElement(node, print) {
  this.push("<");
  print(node.name);
  if (node.attributes.length > 0) {
    this.push(" ");
    print.join(node.attributes, { separator: " " });
  }
  this.push(node.selfClosing ? " />" : ">");
}

function JSXClosingElement(node, print) {
  this.push("</");
  print(node.name);
  this.push(">");
}

function JSXEmptyExpression() {}