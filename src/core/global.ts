
import Module from './module';
import { Graphics } from '@/graphics';

export class ModuleClass {
    /** 安装 */
    install: () => void;
    [key: string]: any;
}

export class GraphicsClass {
    /** 安装 */
    install: () => void;
    /** 图形类型 */
    type: string;
    [key: string]: any;
}

class Global {

    /** 现有图形 */
    private graphicsMap: Record<string, { graphics: GraphicsClass, options: Record<string, any> }> = {};
    /** 现有模块 */
    private moduleMap: Record<string, { module: ModuleClass, options: Record<string, any> }> = {};

    /** 获取图形 */
    graphics(key: string): { graphics: GraphicsClass, options: Record<string, any> };
    /** 配置图形 */
    graphics(graphics: GraphicsClass, options?: Record<string, any>): void;

    graphics(key: string | GraphicsClass, options: Record<string, any> = {}) {
        if (typeof(key) === 'string') {
            return this.graphicsMap[key];
        } else {
            this.graphicsMap[key.name] = {
                graphics: key,
                options: options
            };
        }
    }

    /** 获取模块 */
    module(key: string): { module: ModuleClass, options: Record<string, any> };
    /** 配置模块 */
    module(module: ModuleClass, options?: Record<string, any>): void;

    module(key: string | ModuleClass, options: Record<string, any> = {}) {
        if (typeof(key) === 'string') {
            return this.moduleMap[key];
        } else {
            // @ts-ignore
            const _module = new key(options);
            this.moduleMap[_module.moduleName] = {
                module: key,
                options: options
            };
        }
    }

    /** 模块列表 */
    get modules() {
        return Object.values(this.moduleMap);
    }

    use(plugin: GraphicsClass | ModuleClass, options?: Record<string, any>) {
        let type = '';
        let _plugin = plugin;
        do {
            _plugin = _plugin.__proto__;
            if (_plugin.name) type = _plugin.name;
        } while (_plugin.name);
        if (type === 'Module') {
            this.module(plugin, options);
        } else if (type === 'Graphics') {
            this.graphics(plugin as GraphicsClass, options);
        }
    }
}

export const Haku = new Global();