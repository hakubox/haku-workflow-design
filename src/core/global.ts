
import Module from './module';
import { Graphics } from '@/graphics';
import EventEmitter from 'eventemitter3';

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
    constructor() {
        this.emitter = new EventEmitter();
    }
    
    /** 事件分发器 */
    emitter: EventEmitter;
    /** 已绑定事件 */
    events: Record<string, Array<Function>> = {};

    /** 事件绑定 */
    on(targetType: ModuleLevel | string, targetId: string, eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        this.emitter.on(eventType, (_targetType: ModuleLevel | string, _targetId: string, _params: any = {}, ..._otherParams: any[]) => {
            if (targetType === _targetType && targetId === _targetId) {
                return event.call(bindThis || this, _params, ..._otherParams);
            }
        }, { targetType, targetId });
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType].push(event);
    }

    once(targetType: ModuleLevel, targetId: string, eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        this.emitter.once(eventType, (_targetType: ModuleLevel | string, _targetId: string, _params: any = {}, ..._otherParams: any[]) => {
            if (targetType === _targetType && targetId === _targetId) {
                return event.call(bindThis || this, _params, ..._otherParams);
            }
        }, { targetType, targetId });
    }

    /** 事件绑定 */
    emit(targetType: ModuleLevel, targetId: string, eventType: EditorEventType, params: any = {}, ...otherParams: any[]) {
        this.emitter.emit(eventType, targetType, targetId, params, ...otherParams);
    }


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
            this.moduleMap[key.name] = {
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