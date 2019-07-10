A simple module to resolve dependencies from a dependency map. 

# Setup
`npm install https://github.com/C5H8NNaO4/node-resolve-dep-list`

# Quick Start 

    import {resolve, flat: flatten, map, tree: buildTree} from 'node-resolve-dep-list';

    let dependencyMap = {a: ['b', 'c'], b:[], c:['b'], d: ['b','e'], e:['f'], f:[]}
    let resolved = resolve (dependencyMap); 

    [ [ 'b', 'c', 'a' ],        
      [ 'b' ],
      [ 'b', 'c' ],
      [ 'b', 'f', 'e', 'd' ],
      [ 'f', 'e' ],
      [ 'f' ] ]

You can transform the output using the helpers.

`flat` returns a flat list, with duplicate nodes filtered out.  

    let flat     = flatten(resolved);
    [ 'b', 'c', 'a', 'f', 'e', 'd' ]

`map` returns a map with flat arrays for each dependency group. Intermediate groups are included.  

    let mapped   = map (resolved);
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


## Build / ES5
`npm run build`
 
 Runs `babel src --out-dir lib`