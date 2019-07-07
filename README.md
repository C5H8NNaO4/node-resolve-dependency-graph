A simple helper to resolve dependencies from a flat dependency tree.

# Setup
`npm install https://github.com/C5H8NNaO4/node-resolve-dep-list`

# Quick Start 

    import {resolve, flat: flatten, map, tree: buildTree} from 'node-resolve-dep-list';
    let resolved = resolve ({a: ['b'], b:['c'], c:['d'], d: [], e:['f'], f:[]})
    let flat     = flatten(resolved);
    let mapped   = map (resolved);
    let tree     = buildTree (resolved)

## Build 
`npm run build`
 
 Runs `babel src --out-dir lib`

### Dev Dependencies
@babel/cli
@babel/core
@babel/node
@babel/preset-env

nodemon
