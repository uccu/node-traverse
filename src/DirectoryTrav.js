'use strict';

const fs = require('fs');
const path = require('path');
const Trav = require('./Trav');


class DirectoryTrav extends Trav {

    constructor(path, options = {}) {
        super(path, options);
        handerDirectoryOptions();
    }


    handerDirectoryOptions() {

        this.fileStat = fs.statSync(this.fullPath);

        if (!this.fileStat.isDirectory())
            return;

        this.isDirectory = true;
        this.directoryName = path.basename(this.fullPath);

        const directorys = [], files = [];

        fs.readdirSync(this.fullPath).forEach(fileName => {
            const filePath = path.join(this.fullPath, fileName);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory()) {
                directorys.push(filePath)
            } else {

            }
        });

    }

}

module.exports = DirectoryTrav;