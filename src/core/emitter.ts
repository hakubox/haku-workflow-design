import EventEmitter from 'eventemitter3';
import AttachData from './attachdata';
import { createModelId } from '@/tools';

/** 事件分发 */
export default class Emitter {
    constructor() {
        this.emitter = new EventEmitter();

        this.emitter['emitterId'] = createModelId(26);
    }

    /** 事件分发器Id */
    emitterId: string;

    /** 事件分发器 */
    emitter: EventEmitter;
    /** 已绑定事件 */
    events: Record<string, Array<Function>> = {};

    /** 事件绑定 */
    on(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        this.emitter.on(eventType, event.bind(bindThis || this));
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType].push(event);
    }

    once(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        this.emitter.once(eventType, event.bind(bindThis || this));
    }

    /** 事件绑定 */
    emit(eventType: EditorEventType, params: any = {}, ...otherParams: any[]) {
        this.emitter.emit(eventType, params, ...otherParams);
    }
}