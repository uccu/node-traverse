'use strict';

const fs = require('fs');
const Path = require('path');
const is = require('is');

class Trav {

    constructor(path, options = {}) {

        if (is.object(path)) {
            options = path;
        }

        if (is.string(path)) {
            this.rawPath = path;
        }

        this.isFile = false;
        this.isDirectory = false;
        this.directoryArr = [];
        this.instanceParams = [];

        this.options = options;
        this._handerOptions();
        this._handerFileOptions();
        this._handerDirectoryOptions();
    }

    _handerOptions() {

        if (!is.object(this.options)) {
            throw new TypeError('param options is not an object');
        }

        const defaults = {
            rawPath: this.rawPath,
            baseDir: process.cwd(),
            ext: Trav.DEFAULT_EXT,
            firstLetterType: Trav.FIRST_LETTER_TYPE.DEFAULT,
            importType: Trav.IMPORT_TYPE.DEFAULT,
            instanceParams: [],
        }

        this.options = Object.assign(defaults, this.options);

        if (!this.options.rawPath) {
            throw new Error('path is not exist');
        }

        this._setName();

        if (Path.isAbsolute(this.options.rawPath)) {
            this.fullPath = this.options.rawPath;
        } else {
            this.fullPath = Path.resolve(this.options.baseDir, this.options.rawPath);
        }

        this.fullPath = Path.join(Path.dirname(this.fullPath), this.name);
        this.path = Path.relative(this.options.baseDir, this.fullPath);
    }

    _setName() {

        this.name = Path.basename(this.options.rawPath);
        let changedMethod;

        switch (this.options.firstLetterType) {
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


        let filePath = this.fullPath;
        if (fs.existsSync(filePath + this.options.ext)) {
            filePath += this.options.ext;
        } else if (!fs.existsSync(filePath)) {
            return;
        }

        const stat = fs.statSync(filePath);
        if (!stat.isFile())
            return;

        this.isFile = true;
        this.filePath = filePath;
    }

    _handerDirectoryOptions() {

        if (!fs.existsSync(this.fullPath)) {
            return;
        }

        const stat = fs.statSync(this.fullPath);
        if (!stat.isDirectory())
            return;

        this.isDirectory = true;
        this.directoryPath = this.fullPath;
    }


    _import() {

        let cla = {};

        if (this.isFile) {
            let cl = require(this.filePath);

            switch (this.options.importType) {
                case Trav.IMPORT_TYPE.CLASS_INSTANCE:
                    cl = new cl(...this.options.instanceParams);
                    break;
                case Trav.IMPORT_TYPE.CLASS_AUTO: {
                    const f = cl;
                    cl = (...x) => new f(...x);
                    Object.assign(cl, f);
                }
            }

            cla = cl;
        }

        return cla;
    }

    static import(path, options = {}) {
        const trav = new Trav(path, options);
        let importData = trav._import();

        if (!trav.isDirectory) {
            if (!trav.isFile)
                return undefined;
            return importData;
        }

        if (!is.object(importData) && !is.function(importData)) {
            importData = {};
        }

        return new Proxy(importData, {
            get: function get(target, key) {
                if (is.defined(target[key])) return target[key];

                const newPath = Path.join(trav.fullPath, key.toString());
                target[key] = Trav.import(newPath, options);

                return target[key];
            }
        });
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