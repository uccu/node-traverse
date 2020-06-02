
declare module 'node-traverse' {

    interface Options {
        importType?: number;
        dir?: string;
        rawPath?: string;
        ext?: string;
        firstLetterType?: number;
        instanceParams?: any[];
    }

    class Trav {

        public constructor(options: Options)
        public constructor(path: string, options?: Options)

        public static import(options: Options): object
        public static import(path: string, options?: Options): object

        public isDirectory: boolean
        public isFile: boolean
        public directoryArr: string[]
        public options: Options
        public fullPath: string
        public rawPath: string
        public firstLetterType: number
        public ext: string
        public importType: number
        public path: string
        public dir: string
        public name: string
        public instanceParams: any[]

        public fileName?: string
        public directoryName?: string
        public directoryFullPath?: string

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

        public static Trav: typeof Trav
    }

    export default Trav
    export = Trav


}