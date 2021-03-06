/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.__esModule = true;

var _normalizeAst = require("./normalize-ast");

var _normalizeAst2 = _interopRequireDefault(_normalizeAst);

var _estraverse = require("estraverse");

var _estraverse2 = _interopRequireDefault(_estraverse);

var _import = require("../../acorn");

var acorn = _interopRequireWildcard(_import);

exports["default"] = function (code) {
  var opts = arguments[1] === undefined ? {} : arguments[1];

  var comments = [];
  var tokens = [];

  var parseOpts = {
    allowImportExportEverywhere: opts.looseModules,
    allowReturnOutsideFunction: opts.looseModules,
    allowHashBang: true,
    ecmaVersion: 6,
    strictMode: opts.strictMode,
    sourceType: opts.sourceType,
    locations: true,
    onComment: comments,
    features: opts.features || {},
    plugins: opts.plugins || {},
    onToken: tokens,
    ranges: true
  };

  if (opts.nonStandard) {
    parseOpts.plugins.jsx = true;
    parseOpts.plugins.flow = true;
  }

  var ast = acorn.parse(code, parseOpts);

  _estraverse2["default"].attachComments(ast, comments, tokens);
  ast = _normalizeAst2["default"](ast, comments, tokens);
  return ast;
};

module.exports = exports["default"];