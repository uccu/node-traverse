'use strict';

const assert = require('power-assert');
const path = require('path');
const fs = require('fs');
const Trav = require('../src/trav');

describe('Global', function () {
    before(function () {
        fs.mkdirSync(path.join(__dirname, 'testDirectory'));
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Afile'), 'module.exports=1');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Bfile'), 'module.exports=2');
        fs.mkdirSync(path.join(__dirname, 'testDirectory', 'Adirectory'));
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Adirectory', 'Cfile'), 'module.exports=3');
    });

    after(function () {
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Adirectory', 'Cfile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Afile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Bfile'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory', 'Adirectory'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory'));
    });

    describe('Trav', function () {
        it('should create Trav object successfully', function () {
            const trav = new Trav('testDirectory');
            assert(trav, 'create Trav object failed');
        });
    });
});