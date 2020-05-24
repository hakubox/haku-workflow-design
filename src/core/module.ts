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

        const __init = this.init;
        this.init = (...args) => {
            if (this.isInit === false) {
                this.isInit = true;
                return __init.call(this, ...args);
            }
        }
    }

    private isInit = false;

    /** 子模块 */
    dependencies: Module[] = [];

    /** 模块类型 */
    abstract moduleType: ModuleLevel;

    /** 模块安装 */
    static install() {

    }

    /** 初始化 */
    abstract init();

    /** 参数 */
    options: Record<string, any>;
}