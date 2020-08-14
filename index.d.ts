

/// <reference types="node" />


export interface Options {
    importType?: number;
    baseDir?: string;
    rawPath?: string;
    ext?: string;
    firstLetterType?: number;
    instanceParams?: any[];
}

class Trav {

    constructor(options: Options)
    constructor(path: string, options?: Options)

    public static import(options: Options): any
    public static import(path: string, options?: Options): any

    public static DEFAULT_EXT: '.js';
    public static IMPORT_TYPE: {
        DEFAULT: 0,
        CLASS_INSTANCE: 1,
        CLASS_AUTO: 2
    }
    public static FIRST_LETTER_TYPE: {
        DEFAULT: 0,
        LOWER_CASE: 1,
        UPPER_CASE: 2
    }

}

export default Trav
export = Trav