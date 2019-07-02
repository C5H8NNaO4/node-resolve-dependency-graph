A simple helper to resolve dependencies from a flat dependency tree.

# Setup
`npm install https://github.com/C5H8NNaO4/node-resolve-dep-list`

# Quick Start 

    import {resolve} from 'node-tag-log';
    let {resolved} = resolve ({a: ['b'], b:['c'], c:['d'], d: []})

## Build 
`npm run build`
 
 Runs `babel src --out-dir lib`

### Dev Dependencies
@babel/cli
@babel/core
@babel/node
@babel/preset-env

nodemon
