
[![Build Status](https://www.travis-ci.org/uccu/node-traverse.svg?branch=master)](https://www.travis-ci.org/uccu/node-traverse)
[![Maintainability](https://api.codeclimate.com/v1/badges/d5514d5c92235d5b7d68/maintainability)](https://codeclimate.com/github/uccu/node-traverse/maintainability)
[![codecov](https://codecov.io/gh/uccu/node-traverse/branch/master/graph/badge.svg)](https://codecov.io/gh/uccu/node-traverse)
[![GitHub issues](https://img.shields.io/github/issues/uccu/node-traverse)](https://github.com/uccu/node-traverse/issues)
![GitHub](https://img.shields.io/github/license/uccu/node-traverse)

### LICENSE
MIT

### GOAL
Bind a directory to an object and load the modules in the directory dynamically.

### INSTALL
```javscript
npm i node-traverse
```

### HOW TO USE
```javascript
#   game
#    ├ user
#    │  └ weapon.js -------- exports.id = 3;
#    ├ Fashion.js   -------- exports.getList = function(){ return 1; };
#    ├ Fashion
#    │  └ hair.js   -------- exports.id = 4;
#    ├ friend.js    -------- class A{constructor(n){this.n = n}};A.n=2;module.exports=A;
#    └ user.js      -------- exports.id = 2;


const Trav = require('node-traverse');
const trav = Trav.import('test/game', { baseDir: process.cwd() });

trav.Fashion.getList();   // 1
trav.Fashion.hair.id;     // 4
trav.user.id;             // 2
trav.user.weapon.id;      // 3



const trav = Trav.import('game', {
    baseDir: __dirname,
    importType: Trav.IMPORT_TYPE.CLASS_INSTANCE,
    instanceParams: ['hee'],
});

trav.friend.n;             // hee;

const trav = Trav.import('game', {
    baseDir: __dirname,
    importType: Trav.IMPORT_TYPE.CLASS_AUTO,
});

trav.friend.n;             // 2;
trav.friend('hee').n;      // hee;
```
