import { Editor } from '.';
import { Graphics } from '@/graphics';

export class ModuleClass {
    /** 安装 */
    install: () => void;
    /** 模块名 */
    moduleType: string;
    [key: string]: any;
}

export class ModuleParams {
    /** 子模块 */
    dependencies: Module[];
    [str: string]: any;
}

/** 模块 */
export default abstract class Module {
    constructor(options: ModuleParams) {
        this.options = options;

        this.dependencies = options.dependencies;
    }

    /** 子模块 */
    dependencies: Module[] = [];

    /** 模块名称 */
    abstract moduleName: string;

    /** 模块类型 */
    abstract moduleType: ModuleLevel;

    /** 模块安装 */
    static install() {

    }

    /** 参数 */
    options: Record<string, any>;
}