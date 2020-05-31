'use strict';

const fs = require('fs');
const path = require('path');
const Trav = require('./Trav');


class FileTrav extends Trav {

    constructor(path, options = {}) {
        super(path, options);
        handerFileOptions();
    }

    handerFileOptions() {

        if (!this.fileStat.isFile())
            return;

        this.isFile = true;
        this.fileName = path.basename(this.fullPath, this.ext);

    }

    importFile(...params) {

        let stat = require(this.fullPath);
        if (stat.default)
            stat = stat.default;

        if (this.importFile === Trav.IMPORT_TYPE.CLASS_INSTANCE) {
            stat = new stat(...params);
        }

        return stat;
    }





}




module.exports = FileTrav;