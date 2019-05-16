Everything you need to get started with Babel 7. - Includes *nodemon* as dependency

# Setup
`npm install`
Installs all the depencies needed to compile your project + nodemon. 

## Build 
`npm run build`
 
 Runs `babel src --out-dir lib`

## Babel node + nodemon
`npm start`

Runs `nodemon --exec babel-node src/index.js`

### Dependencies
@babel/cli
@babel/core
@babel/node
@babel/preset-env

nodemon