Simple dependecy resolving algorithm. Expects an id map of dependencies.

# Setup
`npm install node-resolve-dependency-graph`

# Quick Start 

    import {resolve,resolveMap, flat as flatten, map, tree as buildTree} from 'node-resolve-dependency-graph';

    let dependencyMap = {
        a: ['b', 'c'], 
        b: [], 
        c: ['b'], 
        d: ['b','e'], 
        e: ['f'], 
        f: []
    }

    let resolved = resolve (dependencyMap); 

    [ [ 'b', 'c', 'a' ],        
      [ 'b' ],
      [ 'b', 'c' ],
      [ 'b', 'f', 'e', 'd' ],
      [ 'f', 'e' ],
      [ 'f' ] ]

## ES5 
`const depResolve = require ("node-resolve-dependency-graph/lib");`

## Views 

You can transform the output using the helpers.

`flat` returns a flat list, with duplicate nodes filtered out.  

    let flat = flatten(resolved);
    [ 'b', 'c', 'a', 'f', 'e', 'd' ]

`map` returns a map with flat arrays for each dependency group. Intermediate groups are included.  

    let mapped = map (resolved);
    let mapped = resolveMap (dependencyMap);

    { f: [ 'f' ],
      e: [ 'f', 'e' ],
      d: [ 'b', 'f', 'e', 'd' ],
      c: [ 'b', 'c' ],
      b: [ 'b' ],
      a: [ 'b', 'c', 'a' ] }

`tree` returns a tree

    let tree = buildTree (resolved)
    { f: null,
      e: { f: null },
      d: { b: { f: [Object] } },
      c: { b: null },
      b: null,
      a: { b: { c: null } } }


## Build  ES5
`npm run build`
 
 Runs `babel src --out-dir lib`

This branch doesn't include the compiled version. If you need a precompiled version checkout master.

## Test
`npm run test`
