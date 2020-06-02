
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
#   myFolder
#    ├ A_CLASS.js
#    ├ B_function.js
#    └ c_Object.js


const path = require('path');
const Trav = require('node-traverse');
const trav = new Trav.import('myFolder');
trav.A_CLASS;   ✔
trav.B_function;   ✔
trav.c_Object;   ✔

```
