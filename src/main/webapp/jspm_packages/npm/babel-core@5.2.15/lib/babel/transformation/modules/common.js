/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _DefaultFormatter2 = require("./_default");

var _DefaultFormatter3 = _interopRequireDefault(_DefaultFormatter2);

var _includes = require("lodash/collection/includes");

var _includes2 = _interopRequireDefault(_includes);

var _import = require("../../util");

var util = _interopRequireWildcard(_import);

var _import2 = require("../../types");

var t = _interopRequireWildcard(_import2);

var CommonJSFormatter = (function (_DefaultFormatter) {
  function CommonJSFormatter() {
    _classCallCheck(this, CommonJSFormatter);

    if (_DefaultFormatter != null) {
      _DefaultFormatter.apply(this, arguments);
    }
  }

  _inherits(CommonJSFormatter, _DefaultFormatter);

  CommonJSFormatter.prototype.init = function init() {
    this._init(this.hasLocalExports);
  };

  CommonJSFormatter.prototype._init = function _init(conditional) {
    var file = this.file;
    var scope = file.scope;

    scope.rename("module");
    scope.rename("exports");

    if (!this.noInteropRequireImport && conditional) {
      var templateName = "exports-module-declaration";
      if (this.file.isLoose("es6.modules")) templateName += "-loose";
      var declar = util.template(templateName, true);
      declar._blockHoist = 3;
      file.path.unshiftContainer("body", [declar]);
    }
  };

  CommonJSFormatter.prototype.transform = function transform(program) {
    _DefaultFormatter3["default"].prototype.transform.apply(this, arguments);

    if (this.hasDefaultOnlyExport) {
      program.body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), t.memberExpression(t.identifier("exports"), t.identifier("default")))));
    }
  };

  CommonJSFormatter.prototype.importSpecifier = function importSpecifier(specifier, node, nodes) {
    var variableName = specifier.local;

    var ref = this.getExternalReference(node, nodes);

    // import foo from "foo";
    if (t.isSpecifierDefault(specifier)) {
      if (this.isModuleType(node, "absolute")) {} else if (this.isModuleType(node, "absoluteDefault")) {
        this.internalRemap[variableName.name] = ref;
      } else if (this.noInteropRequireImport) {
        this.internalRemap[variableName.name] = t.memberExpression(ref, t.identifier("default"));
      } else {
        var uid = this.scope.generateUidBasedOnNode(node, "import");

        nodes.push(t.variableDeclaration("var", [t.variableDeclarator(uid, t.callExpression(this.file.addHelper("interop-require-default"), [ref]))]));

        this.internalRemap[variableName.name] = t.memberExpression(uid, t.identifier("default"));
      }
    } else {
      if (t.isImportNamespaceSpecifier(specifier)) {
        if (!this.noInteropRequireImport) {
          ref = t.callExpression(this.file.addHelper("interop-require-wildcard"), [ref]);
        }

        // import * as bar from "foo";
        nodes.push(t.variableDeclaration("var", [t.variableDeclarator(variableName, ref)]));
      } else {
        // import { foo } from "foo";
        this.internalRemap[variableName.name] = t.memberExpression(ref, specifier.imported);
      }
    }
  };

  CommonJSFormatter.prototype.importDeclaration = function importDeclaration(node, nodes) {
    // import "foo";
    nodes.push(util.template("require", {
      MODULE_NAME: node.source
    }, true));
  };

  CommonJSFormatter.prototype.exportSpecifier = function exportSpecifier(specifier, node, nodes) {
    if (this.doDefaultExportInterop(specifier)) {
      this.hasDefaultOnlyExport = true;
    }

    _DefaultFormatter3["default"].prototype.exportSpecifier.apply(this, arguments);
  };

  CommonJSFormatter.prototype.exportDeclaration = function exportDeclaration(node, nodes) {
    if (this.doDefaultExportInterop(node)) {
      this.hasDefaultOnlyExport = true;
    }

    _DefaultFormatter3["default"].prototype.exportDeclaration.apply(this, arguments);
  };

  CommonJSFormatter.prototype._getExternalReference = function _getExternalReference(node, nodes) {
    var source = node.source.value;

    var call = t.callExpression(t.identifier("require"), [node.source]);
    var uid;

    if (this.isModuleType(node, "absolute")) {} else if (this.isModuleType(node, "absoluteDefault")) {
      call = t.memberExpression(call, t.identifier("default"));
    } else {
      uid = this.scope.generateUidBasedOnNode(node, "import");
    }

    uid = uid || node.specifiers[0].local;

    var declar = t.variableDeclaration("var", [t.variableDeclarator(uid, call)]);
    nodes.push(declar);
    return uid;
  };

  return CommonJSFormatter;
})(_DefaultFormatter3["default"]);

exports["default"] = CommonJSFormatter;
module.exports = exports["default"];

// absolute module reference

// absolute module reference