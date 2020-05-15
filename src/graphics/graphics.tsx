import { createModelId, mergeProps, createSVGElement } from '@/tools';
import { TextAttrs, Location, BasicEventType } from '@/interface';
import { Span, Circle } from '.';
import Module from '@/core/module';
import { Haku } from '@/core/global';
import GraphicsModule, { GraphicsModuleParams } from '@/core/graphicsmodule';
import Emitter from '@/core/emitter';
import { cloneForce } from "@/lib/clone";
import { globalTransform } from '@/core/transform';
import { debug } from 'webpack';
import { Editor } from '@/core';
import AttachData from '@/core/attachdata';

/** 图形初始化参数 */
export class GraphicsParams {
    /** 编辑器（可空） */
    editor?: Editor;
    /** 文字颜色 */
    textColor?: string;
    /** 文本位置 */
    textLocation?: TextLocation;
    /** 横坐标点 */
    x?: number;
    /** 纵坐标点 */
    y?: number;
    /** 附加数据 */
    data?: Record<string, any> = {};
    /** 不加载模块 */    
    notModule?: boolean = false;
}

/** 图形 */
export default abstract class Graphics extends AttachData {
    constructor(config: GraphicsParams = {}) {
        super();
        this.id = createModelId(16);
        mergeProps(this, config);
        Object.entries(config.data || {}).forEach(([key, value]) => this.setData(key, value));

        // 绑定事件
        Object.keys(config).filter(i => i.startsWith('on')).forEach(i => {
            let _eventName = i.slice(2).toLowerCase();
            if (!this.events[_eventName]) this.events[_eventName] = [];
            this.events[_eventName].push(config[i]);
        });

        // 绑定模块
        if (!this.notModule) {
            this.modules = [...Haku.modules.map(i => {
                if (i.module.__proto__.name === 'GraphicsModule') {
                    // @ts-ignore
                    return { module: new (i.module)(i.options).moduleInit(this, config.editor), options: cloneForce(i.options) };
                }
            })].filter(i => i);
        }

        // 设置坐标
        // this.setLocation = new Proxy(this.setLocation, {
        //     apply: (target, thisArg, [x, y]: [number, number]) => {
        //         if (x !== this.x || y !== this.y) {
        //             this.emit(EditorEventType.GraphicsLocationChange, { x, y });
        //             return target.call(this, x, y);
        //         }
        //     }
        // });

        const __setLocation = this.setLocation;
        this.setLocation = (x: number, y:number) => {
            if (x !== this.x || y !== this.y) {
                this.emit(EditorEventType.GraphicsLocationChange, { graphics: this, x, y });
                return __setLocation.call(this, x, y);
            }
        }
    }

    private _active = false;
    private _isEdit: boolean = false;
    private _isShow: boolean = true;

    /** 是否为辅助图形（不参与操作） */
    isGuide: boolean = false;
    /** 不加载模块 */
    notModule: boolean = false;

    // 图形模块
    modules: {
        module: GraphicsModule;
        options: Record<string, any>;
    }[] = [];
    
    /** 图形id */
    readonly id: string;
    /** 顶点位置 */
    apex: Location[] = [];

    /** 点击顶点 */
    onClickPoint?: (e: any) => void;

    /** 事件类型 */
    events: Record<string, Array<(e: any) => void>> = {};

    /** 事件绑定 */
    on(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        Haku.on(ModuleLevel.Editor, this.id, eventType, event, bindThis);
    }
    /** 单次事件绑定 */
    once(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        Haku.once(ModuleLevel.Editor, this.id, eventType, event, bindThis);
    }
    /** 事件绑定 */
    emit(params: any = {}, ...otherParams: any[]) {
        Haku.emit(ModuleLevel.Editor, this.id, params, ...otherParams);
    }

    /** 新增事件 */
    // addEvent<K extends keyof GlobalEventHandlersEventMap>(type: K, listener: (e: GlobalEventHandlersEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
    //     if (!this.events[type]) this.events[type] = [];
    //     this.events[type].push(listener);
    //     this.contentGraphics.addEventListener(type, listener, options);
    // }

    /** 移除事件 */
    // removeEvent<K extends keyof GlobalEventHandlersEventMap>(type: K, listener: (ev: GlobalEventHandlersEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
    //     this.events[type].push(listener);
    //     this.contentGraphics.removeEventListener(type, listener, options);
    // }

    /** 图形元素 */
    graphics: SVGElement;
    /** 有时为内层核心元素 */
    contentGraphics: SVGElement;
    /** text文本元素 */
    // textGraphics: Span;
    /** 圆角弧度 */
    // fillet: number = 0;
    /** 提示文本 */
    tooltip?: string;
    /** 文字位置 */
    textLocation = TextLocation.Bottom;
    /** 文字颜色 */
    textColor: string = '#888888';
    /** 横坐标 */
    x: number;
    /** 纵坐标 */
    y: number;

    /** 是否为编辑状态 */
    get isEdit() {
        return this._isEdit;
    }
    set isEdit(val: boolean) {
        this._isEdit = val;
    }
    /** 是否显示 */
    get isShow() {
        return this._isShow;
    }
    set isShow(val: boolean) {
        this._isShow = val;
        if (val) this.graphics.classList.add('hidden');
        else this.graphics.classList.remove('hidden');
    }

    /** 是否为选中状态 */
    get active() {
        return this._active;
    }
    set active(val: boolean) {
        if(val !== undefined && this._active !== val) {
            this.emit(EditorEventType.GraphicsActive, val);
            if (val) {
                this.attr('filter', 'url(#graphics-light)');
                this.graphics.classList.add('active');
            } else {
                this.removeAttr('filter');
                this.graphics.classList.remove('active');
            }
            this._active = val;
        }
    }

    // getText() {
    //     return this.text;
    // }
    
    /** 设置标签文本 */
    // setText(text: string) {
    //     this.text = text;
    //     this.textGraphics.graphics.textContent = text;
    //     return this;
    // }

    /** 设置标签文本位置 */
    // setTextLocation(location: TextLocation) {
    //     this.textLocation = location;
    //     this.textGraphics.render();
    //     return this;
    // }

    
    protected _renderOrigin(graphics: SVGElement) {
        let _graphics: SVGElement = graphics;
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(_graphics, this.graphics);
        }
        this.graphics = _graphics;
        this.attr({ gid: this.id, gtype: this.type });
        return _graphics;
    }

    public refresh() {
        this.graphics.parentElement.replaceChild(this.graphics, this.render());
    }

    protected _render(contentGraphics: SVGElement, ...graphics: SVGElement[]) {
        this.contentGraphics = contentGraphics;
        let _graphics: SVGElement = (<g
            className="graphics-node"
            transform={`translate(${this.x + globalTransform.offsetX},${this.y + globalTransform.offsetY})`}
        >{ contentGraphics }{ graphics }</g>);
        if (this?.graphics?.parentNode) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(_graphics, this.graphics);
        }
        this.graphics = _graphics;
        // this.textGraphics = this._renderText();
        // this.graphics.appendChild(this.textGraphics.graphics);
        this.attr({ gid: this.id, gtype: this.type });

        this.contentGraphics.classList.add('graphics-node-content');

        // 绑定事件
        Object.entries(this.events).forEach(([eventName, events]) => {
            events.forEach(event => {
                this.contentGraphics.addEventListener(eventName.slice(2).toLowerCase(), event);
            });
        });

        this.contentGraphics.addEventListener('mouseenter', (e) => {
            this.emit(EditorEventType.GraphicsMouseEnter, e);
        });
        this.contentGraphics.addEventListener('mouseout', (e) => {
            this.emit(EditorEventType.GraphicsMouseOut, e);
        });
        this.contentGraphics.addEventListener('mousedown', (e) => {
            this.emit(EditorEventType.GraphicsMouseDown, e);
        });
        this.contentGraphics.addEventListener('mouseup', (e) => {
            this.emit(EditorEventType.GraphicsMouseUp, e);
        });

        // 加载图形模块
        if (!this.notModule) {
            for (let i = 0; i < this.modules.length; i++) {
                if (this.modules[i].module.moduleType === ModuleLevel.Graphics) {
                    _graphics = this.modules[i].module.render(_graphics) || _graphics;
                }
            }
        }

        return _graphics;
    }

    /** 获取图形文本的坐标 */
    get textCoordinate(): Location {
        return {
            none: { },
            top: {
                x: this.x + this.getWidth() / 2,
                y: this.y - 12,
            },
            center: {
                x: this.x + this.getWidth() / 2,
                y: this.y + this.getHeight() / 2
            },
            bottom: {
                x: this.x + this.getWidth() / 2,
                y: this.y + this.getHeight() + 16
            },
            custom: {
                x: this.x,
                y: this.y
            }
        }[this.textLocation] as Location;
    }

    /** 获取图形文本的所有属性 */
    get textAttrs(): TextAttrs {
        return {
            fill: this.textColor,
            class: 'graphics-label',
            ...this.textCoordinate,
            ...{
                none: { class: 'display-none' }
            }[this.textLocation]
        } as TextAttrs;
    }

    /**
     * 重绘文字部分（可传入自定义参数
     * @param {number} [x=0] X坐标偏移量
     * @param {number} [y=0] Y坐标偏移量
     * @param {object} [config={}] 额外配置
     */
    // protected _renderText(x: number = 0, y: number = 0, config: Record<string, any> = {}) {
    //     if (this?.textGraphics?.graphics) {
    //         this.textGraphics.graphics.parentElement.removeChild(this.textGraphics.graphics);
    //     }
    //     return new Span({
    //         parent: this.graphics,
    //         text: this.text,
    //         x: this.textAttrs.x + x,
    //         y: this.textAttrs.y + y,
    //         ...config
    //     });
    // }

    /** 图形类型 */
    abstract type: GraphicsType;
    /** 描述 */
    abstract description: string;

    /** 获取核心元素属性 */
    protected attr(key: string): string;
    /** 设置核心元素属性 */
    protected attr(key: string, value?: any): void;
    /** 设置核心元素属性 */
    protected attr(props: Record<string, any>): void;

    protected attr(key: string | Record<string, any>, value?: any) {
        if (typeof(key) === 'string') {
            if (value === undefined) {
                return this.contentGraphics.getAttribute(key);
            } else {
                this.contentGraphics.setAttribute(key, '' + value);
            }
        } else {
            Object.entries(key).forEach(([key, value]) => {
                this.contentGraphics.setAttribute(key, '' + value);
            });
        }
    }

    /** 删除属性 */
    protected removeAttr(...props: string[]) {
        props.forEach(prop => {
            this.contentGraphics.removeAttribute(prop);
        })
    }

    /** 移除节点 */
    public destroy() {
        this.graphics.parentNode.removeChild(this.graphics);
        this.graphics = null;
    }

    /** 图形构造函数 */
    abstract render(): SVGElement;

    /** 重绘 */
    painting() {

    }

    refreshLocation() {
        this.setLocation(this.x, this.y);
    }

    /** 设置坐标 */
    abstract setLocation(x: number, y: number): this;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;

    /** 绑定顶点处理 */
    private _bindApex() {

    }

    static install() {

    }
}