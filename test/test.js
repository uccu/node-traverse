'use strict';

const assert = require('power-assert');
const path = require('path');
const fs = require('fs');
const Trav = require('..');

describe('Global', function() {
    before(function() {
        fs.mkdirSync(path.join(__dirname, 'testDirectory'));
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Afile'), 'module.exports=1');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Bfile'), 'module.exports=2');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Cfile'), 'module.exports={a:1}');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Dirle'), 'module.exports=class Dirle{get a(){return 2}};module.exports.b=3;');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'eirle.js'), 'module.exports=class Eirle{constructor(a){this.b=a}}');
        fs.mkdirSync(path.join(__dirname, 'testDirectory', 'Adirectory'));
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Adirectory', 'Cfile'), 'module.exports=3');
        fs.mkdirSync(path.join(__dirname, 'testDirectory', 'Eirle'));
        fs.mkdirSync(path.join(__dirname, 'testDirectory', 'wEirle'));
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'wEirle.js'), 'module.exports=9');
        fs.writeFileSync(path.join(__dirname, 'testDirectory', 'Eirle', 'wf'), 'module.exports=4');
    });

    after(function() {
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Eirle', 'wf'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Adirectory', 'Cfile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Afile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Bfile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Cfile'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'Dirle'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'eirle.js'));
        fs.unlinkSync(path.join(__dirname, 'testDirectory', 'wEirle.js'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory', 'Adirectory'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory', 'Eirle'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory', 'wEirle'));
        fs.rmdirSync(path.join(__dirname, 'testDirectory'));
    });

    describe('Trav', function() {
        it('normal path', function() {
            const trav = Trav.import('testDirectory', { baseDir: __dirname });
            assert.equal(trav.Afile, 1, 'fail');
            assert.equal(trav.Bfile, 2, 'fail');
            assert.equal(trav.Adirectory.Cfile, 3, 'fail');
            assert(!!trav, 'fail');
        });

        it('path in options', function() {
            const trav = Trav.import({ baseDir: __dirname, rawPath: 'testDirectory' });
            assert.equal(trav.Afile, 1, 'fail');
            assert.equal(trav.Bfile, 2, 'fail');
            assert.equal(trav.Adirectory.Cfile, 3, 'fail');
        });

        it('param options is not a object', function() {
            try {
                // @ts-ignore
                Trav.import(path.join(__dirname, 'testDirectory'), 'sss');
                assert(false, 'not throw');
            } catch (e) { return 0 }
        });
        it('param path is not exist', function() {
            try {
                // @ts-ignore
                Trav.import();
                assert(false, 'not throw');
            } catch (e) { return 0 }
        });
        it('path is not exist', function() {
            try {
                Trav.import('wwwww');
                assert(false, 'not throw');
            } catch (e) { return 0 }
        });

        it('UPPER_CASE', function() {
            const trav = Trav.import('adirectory', {
                baseDir: path.join( __dirname ,'testDirectory'),
                firstLetterType: Trav.FIRST_LETTER_TYPE.UPPER_CASE
            });
            assert(trav.Cfile, 'fail');
            assert(trav.cfile, 'fail');
        });

        it('LOWER_CASE', function() {
            const trav = Trav.import(path.join(__dirname, 'testDirectory'),
                { firstLetterType: Trav.FIRST_LETTER_TYPE.LOWER_CASE }
            );
            assert(trav.wEirle, 'fail');
            assert(trav.WEirle, 'fail');
        });

        it('CLASS_INSTANCE', function() {
            const trav = Trav.import(path.join(__dirname, 'testDirectory'),
                { importType: Trav.IMPORT_TYPE.CLASS_INSTANCE }
            );
            assert.equal(trav.Dirle.a, 2, 'fail');
        });

        it('CLASS_AUTO', function() {
            const trav = Trav.import(path.join(__dirname, 'testDirectory'),
                { importType: Trav.IMPORT_TYPE.CLASS_AUTO }
            );

            const m = require(path.join(__dirname, 'testDirectory', 'Dirle'));
            assert(trav.Dirle() instanceof m, 'fail');
            assert.equal(trav.Dirle.b, 3, 'fail');
        });

        it('constructor', function() {
            new Trav(path.join(__dirname, 'testDirectory'));
        });

        it('instanceParams', function() {
            const trav = Trav.import(
                path.join(__dirname, 'testDirectory'),
                { instanceParams: ['test'], importType: Trav.IMPORT_TYPE.CLASS_INSTANCE }
            );
            assert.equal(trav.eirle.b, 'test', 'fail');
        });
    });
});