import EventEmitter from 'eventemitter3';

/** 事件分发 */
export default class Emitter {
    constructor() {
        this.emitter = new EventEmitter();
    }

    /** 事件分发器 */
    private emitter: EventEmitter;
    /** 已绑定事件 */
    listeners: Record<string, Array<{ node, handler }>> = {};

    /** 事件绑定 */
    on(eventType: EditorEventType, event: (source) => void, bindThis?: any) {
        this.emitter.on(eventType, event.bind(bindThis || this));
    }

    /** 事件绑定 */
    emit(eventType: EditorEventType, params: Record<string, any> = {}) {
        this.emitter.emit(eventType, params);
    }
  
    handleDOM(event, ...args) {
        (this.listeners[event.type] || []).forEach(function({ node, handler }) {
            if (event.target === node || node.contains(event.target)) {
                handler(event, ...args);
            }
        });
    }
  
    listenDOM(eventName, node, handler) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push({ node, handler })
    }
}