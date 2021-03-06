/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
// https://github.com/leebyron/ecmascript-more-export-from

var _import = require("../../../types");

var t = _interopRequireWildcard(_import);

var metadata = {
  stage: 1
};

exports.metadata = metadata;

function shouldVisit(node) {
  return t.isExportDefaultSpecifier(node) || t.isExportNamespaceSpecifier(node);
}

function build(node, nodes, scope) {
  var first = node.specifiers[0];
  if (!t.isExportNamespaceSpecifier(first) && !t.isExportDefaultSpecifier(first)) return;

  var specifier = node.specifiers.shift();
  var uid = scope.generateUidIdentifier(specifier.exported.name);

  var newSpecifier;
  if (t.isExportNamespaceSpecifier(specifier)) {
    newSpecifier = t.importNamespaceSpecifier(uid);
  } else {
    newSpecifier = t.importDefaultSpecifier(uid);
  }

  nodes.push(t.importDeclaration([newSpecifier], node.source));
  nodes.push(t.exportNamedDeclaration(null, [t.exportSpecifier(uid, specifier.exported)]));

  build(node, nodes, scope);
}

function ExportNamedDeclaration(node, parent, scope) {
  var nodes = [];
  build(node, nodes, scope);
  if (!nodes.length) return;

  if (node.specifiers.length >= 1) {
    nodes.push(node);
  }

  return nodes;
}