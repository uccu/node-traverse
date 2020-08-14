'use strict';

const assert = require('power-assert');
const path = require('path');
const fs = require('fs');
const Trav = require('..');

describe('Global', function() {
    before(function() {
        fs.mkdirSync(path.join(__dirname, 'game'));
        fs.mkdirSync(path.join(__dirname, 'game', 'user'));
        fs.mkdirSync(path.join(__dirname, 'game', 'Fashion'));
        fs.writeFileSync(path.join(__dirname, 'game', 'user', 'weapon.js'), 'exports.id = 3;');
        fs.writeFileSync(path.join(__dirname, 'game', 'Fashion.js'), 'exports.getList = function(){ return 1; };');
        fs.writeFileSync(path.join(__dirname, 'game', 'Fashion', 'hair.js'), 'exports.id = 4;');
        fs.writeFileSync(path.join(__dirname, 'game', 'friend.js'), 'module.exports=class{constructor(n){this.n = n};static n=2;};');
        fs.writeFileSync(path.join(__dirname, 'game', 'user.js'), 'exports.id = 2');
    });

    after(function() {
        fs.unlinkSync(path.join(__dirname, 'game', 'Fashion', 'hair.js'));
        fs.unlinkSync(path.join(__dirname, 'game', 'user', 'weapon.js'));
        fs.unlinkSync(path.join(__dirname, 'game', 'Fashion.js'));
        fs.unlinkSync(path.join(__dirname, 'game', 'friend.js'));
        fs.unlinkSync(path.join(__dirname, 'game', 'user.js'));
        fs.rmdirSync(path.join(__dirname, 'game', 'Fashion'));
        fs.rmdirSync(path.join(__dirname, 'game', 'user'));
        fs.rmdirSync(path.join(__dirname, 'game'));
    });

    describe('TravMd', function() {
        it('test 1', function() {
            const trav = Trav.import('test/game', { baseDir: process.cwd() });
            assert.equal(trav.Fashion.getList(), 1, 'fail');
            assert.equal(trav.Fashion.hair.id, 4, 'fail');
            assert.equal(trav.user.id, 2, 'fail');
            assert.equal(trav.user.weapon.id, 3, 'fail');
        });

        it('test 2', function() {
            const trav = Trav.import('game', {
                baseDir: __dirname,
                importType: Trav.IMPORT_TYPE.CLASS_INSTANCE,
                instanceParams: ['hee'],
            });
            assert.equal(trav.friend.n, 'hee', 'fail');
        });

        it('test 3', function() {
            const trav = Trav.import('game', {
                baseDir: __dirname,
                importType: Trav.IMPORT_TYPE.CLASS_AUTO
            });
            assert.equal(trav.friend.n, 2, 'fail');
            assert.equal(trav.friend('ge').n, 'ge', 'fail');
        });
    });
});