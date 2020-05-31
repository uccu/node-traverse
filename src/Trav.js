'use strict';

const fs = require('fs');
const path = require('path');
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

        this.options = options;
        this.handerOptions();

    }

    handerOptions() {

        if (!isObject(this.options)) {
            throw new TypeError('param options is not an object');
        }

        this.fullPath = path.resolve(this.rowPath);
        if (!fs.existsSync(this.fullPath)) {
            throw new Error('path \'' + this.fullPath + '\' is not exist');
        }

        this.ext = this.options.ext || Trav.DEFAULT_EXT;
        this.dir = this.options.dir || this.fullPath;
        this.firstLetterType = this.options.firstLetterType || Trav.FIRST_LETTER_TYPE.DEFAULT;
        this.importType = this.options.importType || Trav.IMPORT_TYPE.DEFAULT;

        this.dir = path.resolve(this.dir);
        this.path = path.relative(this.dir, this.fullPath);
        this.directoryArr = this.path ? this.path.split(path.sep).slice(0, -1) : [];


        this.name = path.basename(this.fullPath, this.ext);

        if (this.firstLetterType === Trav.FIRST_LETTER_TYPE.LOWER_CASE) {
            this.name = this.name.replace(this.name[0], this.name[0].toLowerCase());
        }

        if (this.firstLetterType === Trav.FIRST_LETTER_TYPE.UPPER_CASE) {
            this.name = this.name.replace(this.name[0], this.name[0].toUpperCase());
        }

    }





}


Trav.IMPORT_TYPE = {
    DEFAULT: 0,
    CLASS_INSTANCE: 1
};

Trav.DEFAULT_EXT = '.js';

Trav.FIRST_LETTER_TYPE = {
    DEFAULT: 0,
    LOWER_CASE: 1,
    UPPER_CASE: 2
};


module.exports = Trav;