import { Editor } from '.';
import { Graphics } from '@/graphics';

export interface ModuleClass {
    /** 安装 */
    install: () => void;
    [key: string]: any;
}

export interface ModuleParams {
    /** 子模块 */
    dependencies: Module[];
    [str: string]: any;
}

/** 模块 */
export default abstract class Module {
    constructor(options: ModuleParams) {
        this.options = options;

        this.dependencies = options.dependencies || [];
    }

    /** 子模块 */
    dependencies: Module[] = [];

    /** 模块类型 */
    abstract moduleType: ModuleLevel;

    /** 模块安装 */
    static install() {

    }

    /** 参数 */
    options: Record<string, any>;
}