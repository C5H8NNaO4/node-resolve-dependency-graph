"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveMap = exports.resolve = exports.tree = exports.map = exports.flat = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Node = function Node(name) {
  return {
    edges: [],
    name: name
  };
};

function addEdges(nodes, key, edges) {
  var node = nodes[key];
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

function resolveDependencies(node, resolved, unresolved) {
  unresolved.push(node);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = node.edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var edge = _step2.value;

      if (!~resolved.indexOf(edge)) {
        if (!!~unresolved.indexOf(edge)) throw new Error("Circular dependency '".concat(edge, "' at node '").concat(node.name));
        resolveDependencies(edge, resolved, unresolved);
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
  unresolved.splice(resolved.indexOf(node), 1);
  return resolved;
}

function genNodes(graph) {
  var nodes = {};

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
  }).reverse().filter(function (e, i, a) {
    return !~a.indexOf(e, i + 1);
  }).reverse();
};

exports.flat = flat;

var map = function map(result) {
  return result.map(function (sub) {
    return sub.slice(0);
  }).reduce(function (map, result) {
    return Object.assign(_defineProperty({}, result[result.length - 1], result), map);
  }, {});
};

exports.map = map;

var tree = function tree(result) {
  var tmp = map(result);
  var tree = Object.assign({}, tmp);

  for (var key in tree) {
    var _flat = tree[key];
    var node = void 0,
        first = node = _flat.length == 1 ? null : {};

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

var resolve = function resolve(depMap) {
  var result = [],
      nodes = genNodes(depMap);

  for (var key in nodes) {
    var node = nodes[key],
        resolved = resolveDependencies(node, [], []);
    result.push(resolved);
  }

  return list(result);
};

exports.resolve = resolve;

var resolveMap = function resolveMap(depMap) {
  return map(resolve(depMap));
};

exports.resolveMap = resolveMap;