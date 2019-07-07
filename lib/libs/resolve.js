"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = exports.tree = exports.map = exports.flat = void 0;

var _lib = require("node-tag-log/lib");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { if (i % 2) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } else { Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i])); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["Generating flat node list from graph ", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["resolving node ", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["Adding edges to ", " - ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Node = function Node(name) {
  return {
    edges: [],
    name: name
  };
};

function addEdges(nodes, key, edges) {
  var node = nodes[key];
  (0, _lib.debug)(_templateObject(), node.name, edges);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var edge = _step.value;
      if (!nodes[edge]) throw new Error("Unmet dependency '".concat(edge, "' at node ").concat(node.name));
      node.edges.push(nodes[edge]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function resolveDependencies(node, resolved, unresolved, global) {
  (0, _lib.debug)(_templateObject2(), node.name);
  unresolved.push(node);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = node.edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var edge = _step2.value;

      if (!~resolved.indexOf(edge)) {
        if (!!~unresolved.indexOf(edge)) throw new Error('Circular dependency');
        resolveDependencies(edge, resolved, unresolved, global);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  resolved.push(node);
  if (!~global.indexOf(node)) global.push(node);
  unresolved.splice(resolved.indexOf(node), 1);
}

function genNodes(graph) {
  var nodes = {};
  (0, _lib.debug)(_templateObject3(), graph);

  for (var key in graph) {
    nodes[key] = Node(key);
  }

  for (var key in graph) {
    var node = nodes[key],
        edges = graph[key];
    if (node) addEdges(nodes, key, edges);
  }

  return nodes;
}

var list = function list(result) {
  return result.map(function (resolved) {
    return resolved.map(function (node) {
      return node.name;
    });
  });
};

var flat = function flat(result) {
  return result.reduce(function (flat, cur) {
    return [].concat(_toConsumableArray(flat), _toConsumableArray(cur));
  });
};

exports.flat = flat;

var map = function map(result) {
  return result.map(function (sub) {
    return sub.slice(0);
  }).reduce(function (map, result) {
    return _objectSpread(_defineProperty({}, result[result.length - 1], result), map);
  }, {});
};

exports.map = map;

var tree = function tree(result) {
  var tmp = map(result);

  var tree = _objectSpread({}, tmp);

  for (var key in tree) {
    var _flat = tree[key];
    var node = void 0,
        first = node = {};

    for (var i = 0; i < _flat.length - 1; i++) {
      var cur = _flat[i];
      node[cur] = i == _flat.length - 2 ? null : {};
      node = node[cur];
    }

    tree[key] = first;
  }

  return tree;
};

exports.tree = tree;

var resolve = function resolve(depList) {
  var result = [],
      global = [],
      combined,
      map;
  var nodes = genNodes(depList);

  for (var key in nodes) {
    var node = nodes[key];
    if (!!~global.indexOf(node)) continue;
    var resolved = [];
    resolveDependencies(node, resolved, [], global);
    result.push(resolved);
  }

  return list(result);
};

exports.resolve = resolve;