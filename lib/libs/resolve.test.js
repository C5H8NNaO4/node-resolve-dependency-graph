"use strict";

var _resolve = require("./resolve");

var dependencyMap = {
  a: ['b', 'c'],
  b: [],
  c: ['b'],
  d: ['b', 'e'],
  e: ['f'],
  f: []
};
var preResolved = [['b', 'c', 'a'], ['b'], ['b', 'c'], ['b', 'f', 'e', 'd'], ['f', 'e'], ['f']];
var preFlattened = ['b', 'c', 'a', 'f', 'e', 'd'];
var preMapped = {
  f: ['f'],
  e: ['f', 'e'],
  d: ['b', 'f', 'e', 'd'],
  c: ['b', 'c'],
  b: ['b'],
  a: ['b', 'c', 'a']
};
var expectedTree = {
  f: null,
  e: {
    f: null
  },
  d: {
    b: {
      f: {
        e: null
      }
    }
  },
  c: {
    b: null
  },
  b: null,
  a: {
    b: {
      c: null
    }
  }
};
describe('Resolve dependency maps', function () {
  it('resolves a dependency map', function () {
    var resolved = (0, _resolve.resolve)(dependencyMap);
    expect(resolved).toEqual(preResolved);
  });
  it('flattens a dependency map', function () {
    var resolved = (0, _resolve.resolve)(dependencyMap);
    var flattened = (0, _resolve.flat)(resolved);
    expect(flattened).toEqual(preFlattened);
  });
  it('builds a map of resolved groups', function () {
    var resolved = (0, _resolve.resolve)(dependencyMap);
    var mapped = (0, _resolve.map)(resolved);
    expect(mapped).toEqual(preMapped);
  });
  it('builds a tree of resolved groups', function () {
    var resolved = (0, _resolve.resolve)(dependencyMap);
    var tree = (0, _resolve.tree)(resolved);
    expect(tree).toEqual(expectedTree);
  });
  it('aliases map(resolve())', function () {
    var resolved = (0, _resolve.resolve)(dependencyMap);
    var mapped = (0, _resolve.map)(resolved);
    var mapped2 = (0, _resolve.resolveMap)(dependencyMap);
    expect(mapped).toEqual(mapped2);
  });
});