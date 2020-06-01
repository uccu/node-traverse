/// <reference types="node" />

declare module 'node-traverse' {

    interface Options {
        importType?: number;
        dir?: string;
        rawPath?: string;
        ext?: string;
        firstLetterType?: number;
    }

    export class Trav {

        constructor(options: Options): void
        constructor(path: string, options?: Options): void

        static importDirectory(options: Options): object
        static importDirectory(path: string, options?: Options): object

        public isDirectory: boolean
        public isFile: boolean
        public childrens: Trav[]
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

        public fileName?: string
        public directoryName?: string
        public directoryFullPath?: string

    }

    export default Trav
    export = Trav



}