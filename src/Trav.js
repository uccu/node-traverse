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
            this.rawPath = path;
        }

        this.isFile = false;
        this.isDirectory = false;
        this.childrens = [];
        this.directoryArr = [];
        this.instanceParams = [];

        this.options = options;
        this._handerOptions();
        this._handerFileOptions();
        this._handerDirectoryOptions();
    }

    _handerOptions() {

        if (!isObject(this.options)) {
            throw new TypeError('param options is not an object');
        }

        this.options.rawPath = this.rawPath = this.rawPath || this.options.rawPath;
        if (!this.rawPath) {
            throw new Error('path is not exist');
        }

        this.fullPath = Path.resolve(this.rawPath);
        if (!fs.existsSync(this.fullPath)) {
            throw new Error('path \'' + this.fullPath + '\' is not exist');
        }

        this.ext = this.options.ext || Trav.DEFAULT_EXT;

        this.firstLetterType = this.options.firstLetterType || Trav.FIRST_LETTER_TYPE.DEFAULT;
        this.importType = this.options.importType || Trav.IMPORT_TYPE.DEFAULT;
        this.instanceParams = this.options.instanceParams || [];

        this._setDir();
        this.path = Path.relative(this.dir, this.fullPath);


        this._setName();
        this._setDirectoryArr();

    }

    _setDir() {
        this.dir = this.options.dir || this.fullPath;
        this.dir = Path.resolve(this.dir);
    }

    _setDirectoryArr() {
        if (this.path) {
            this.directoryArr = this.path.split(Path.sep).slice(0, -1);
        }
    }

    _setName() {

        this.name = Path.basename(this.fullPath, this.ext);
        let changedMethod;

        switch (this.firstLetterType) {
            case Trav.FIRST_LETTER_TYPE.LOWER_CASE:
                changedMethod = 'toLowerCase'; break;
            case Trav.FIRST_LETTER_TYPE.UPPER_CASE:
                changedMethod = 'toUpperCase'; break;
        }

        if (changedMethod) {
            this.name = this.name.replace(this.name[0], this.name[0][changedMethod]());
        }

    }

    _handerFileOptions() {

        const stat = fs.statSync(this.fullPath);
        if (!stat.isFile())
            return;

        this.isFile = true;
        this.fileName = Path.basename(this.fullPath, this.ext);

    }

    _handerDirectoryOptions() {

        const stat = fs.statSync(this.fullPath);
        if (!stat.isDirectory())
            return;

        this.isDirectory = true;
        this.directoryName = Path.basename(this.fullPath);
        this.directoryFullPath = this.fullPath;

        const childrens = {}, directorys = {};
        const cloneOptions = Object.assign(
            {},
            this.options,
            { dir: this.dir }
        );

        fs.readdirSync(this.fullPath).forEach(name => {

            const path = Path.join(this.fullPath, name);
            const trav = new Trav(path, cloneOptions);

            if (trav.isDirectory) {
                directorys[trav.name] = trav;
            } else {
                childrens[trav.name] = trav;
            }
        });

        this._setChildrens(childrens, directorys);

    }

    _setChildrens(childrens, directorys) {
        for (const d in directorys) {
            if (childrens[d]) {
                childrens[d]._mergeDirectory(directorys[d]);
            } else {
                childrens[d] = directorys[d];
            }
        }
        for (const c in childrens) {
            this.childrens.push(childrens[c]);
        }
    }


    _mergeDirectory(trav) {
        this.isDirectory = true;
        this.directoryFullName = trav.directoryFullName;
        this.directoryName = trav.directoryName;
        this.childrens = trav.childrens;
    }


    _import() {

        let cla = {};

        if (this.isFile) {
            let cl = require(this.fullPath);

            switch (this.importType) {
                case Trav.IMPORT_TYPE.CLASS_INSTANCE:
                    cl = new cl(...this.instanceParams); break;
                case Trav.IMPORT_TYPE.CLASS_AUTO: {
                    const f = cl;
                    cl = (...x) => new f(...x);
                    Object.assign(cl, f);
                }
            }

            cla = cl;
        }

        if (this.isDirectory) {
            this.childrens.forEach(child => {

                Object.defineProperty(
                    cla,
                    child.name,
                    {
                        get: () => child._import()
                    }
                );
            })
        }

        return cla;
    }

    static import(path, options = {}) {
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