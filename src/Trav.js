'use strict';

const fs = require('fs');
const Path = require('path');
const isObject = require('./utils/isObject');
const isString = require('./utils/isString');


class Trav {

    constructor(path, options = {}) {

        if (isObject(path)) {
            options = path;
        }

        if (isString(path)) {
            this.rowPath = path;
        }

        this.isFile = false;
        this.isDirectory = false;
        this.childrens = [];

        this.options = options;
        this.handerOptions();
        this.handerFileOptions();
        this.handerDirectoryOptions();
    }

    handerOptions() {

        if (!isObject(this.options)) {
            throw new TypeError('param options is not an object');
        }

        this.options.rowPath = this.rowPath = this.rowPath || this.options.rowPath;
        if (!this.rowPath) {
            throw new Error('path is not exist');
        }

        this.fullPath = Path.resolve(this.rowPath);
        if (!fs.existsSync(this.fullPath)) {
            throw new Error('path \'' + this.fullPath + '\' is not exist');
        }


        this.ext = this.options.ext || Trav.DEFAULT_EXT;
        this.dir = this.options.dir || this.fullPath;
        this.firstLetterType = this.options.firstLetterType || Trav.FIRST_LETTER_TYPE.DEFAULT;
        this.importType = this.options.importType || Trav.IMPORT_TYPE.DEFAULT;

        this.dir = Path.resolve(this.dir);
        this.path = Path.relative(this.dir, this.fullPath);
        this.directoryArr = this.path ? this.path.split(Path.sep).slice(0, -1) : [];

        this.name = Path.basename(this.fullPath, this.ext);

        if (this.firstLetterType === Trav.FIRST_LETTER_TYPE.LOWER_CASE) {
            this.name = this.name.replace(this.name[0], this.name[0].toLowerCase());
        }

        if (this.firstLetterType === Trav.FIRST_LETTER_TYPE.UPPER_CASE) {
            this.name = this.name.replace(this.name[0], this.name[0].toUpperCase());
        }

    }

    handerFileOptions() {

        const stat = fs.statSync(this.fullPath);
        if (!stat.isFile())
            return;

        this.isFile = true;
        this.fileName = Path.basename(this.fullPath, this.ext);

    }

    handerDirectoryOptions() {

        const stat = fs.statSync(this.fullPath);
        if (!stat.isDirectory())
            return;

        this.isDirectory = true;
        this.directoryName = Path.basename(this.fullPath);
        this.directoryFullName = this.fullPath;

        const childrens = {}, directorys = {};
        const cloneOptions = Object.assign({}, this.options, { dir: this.dir });

        fs.readdirSync(this.fullPath).forEach(name => {
            const path = Path.join(this.fullPath, name);
            const trav = new Trav(path, cloneOptions);
            if (trav.isDirectory) {
                directorys[trav.name] = trav;
            } else {
                childrens[trav.name] = trav;
            }
        });


        for (const d in directorys) {
            if (childrens[d]) {
                childrens[d].mergeDirectory(directorys[d]);
            } else {
                childrens[d] = directorys[d];
            }

        }
        for (const c in childrens) {
            this.childrens.push(childrens[c]);
        }
    }


    mergeDirectory(trav) {
        this.isDirectory = true;
        this.directoryFullName = trav.directoryFullName;
        this.directoryName = trav.directoryName;
        this.childrens = trav.childrens;
    }


    _import(...p) {

        let cla = {};
        if (this.isFile) {
            cla = require(this.fullPath);
            if (this.importType === Trav.IMPORT_TYPE.CLASS_INSTANCE) {
                cla = new cla(...p);
            }
            if (this.importType === Trav.IMPORT_TYPE.CLASS_AUTO) {
                const f = cla;
                cla = (...x) => new f(...x);
                Object.assign(cla, f);
            }
        }
        if (this.isDirectory) {
            this.childrens.forEach(child => {
                Object.defineProperty(cla, child.name, {
                    get: function() {
                        return child._import();
                    }
                });
            })
        }

        return cla;
    }

    static importDirectory(path, options = {}) {
        const trav = new Trav(path, options);
        return trav._import();
    }


}


Trav.IMPORT_TYPE = {
    DEFAULT: 0,
    CLASS_INSTANCE: 1,
    CLASS_AUTO: 2
};

Trav.DEFAULT_EXT = '.js';

Trav.FIRST_LETTER_TYPE = {
    DEFAULT: 0,
    LOWER_CASE: 1,
    UPPER_CASE: 2
};


module.exports = Trav;