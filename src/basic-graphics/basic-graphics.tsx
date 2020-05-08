import { createModelId, mergeProps, createSVGElement } from '@/tools';
import { TextAttrs, Location, BasicEventType } from '@/interface';

/** 图形初始化参数 */
export class BasicGraphicsParams {
    /** 横坐标点 */
    x?: number;
    /** 纵坐标点 */
    y?: number;
}

/** 图形 */
export default abstract class BasicGraphics {
    constructor(config: BasicGraphicsParams) {
        mergeProps(this, config);
    }

    /** 图形元素 */
    graphics: SVGElement;
    /** 横坐标 */
    x: number;
    /** 纵坐标 */
    y: number;
    
    protected _renderOrigin(graphics: SVGElement) {
        let _graphics: SVGElement = graphics;
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(_graphics, this.graphics);
        }
        this.graphics = _graphics;
        this.attr('gtype', this.type);
        return _graphics;
    }

    public refresh() {
        this.graphics.parentElement.replaceChild(this.graphics, this.render());
    }

    protected _render(contentGraphics: SVGElement, ...graphics: SVGElement[]) {
        if (this.graphics) {
            let _parent = this.graphics.parentNode;
            _parent.replaceChild(contentGraphics, this.graphics);
        }
        this.graphics = contentGraphics;
        this.attr({ gtype: this.type });

        return this;
    }

    /** 图形类型 */
    abstract type: GraphicsType;
    /** 描述 */
    abstract description: string;

    protected setActive(isActive: boolean) {
        if (isActive) {

        } else {

        }
    }

    /** 获取核心元素属性 */
    protected attr(key: string): string;
    /** 设置核心元素属性 */
    protected attr(key: string, value?: any): void;
    /** 设置核心元素属性 */
    protected attr(props: Record<string, any>): void;

    protected attr(key: string | Record<string, any>, value?: any) {
        if (typeof(key) === 'string') {
            if (value === undefined) {
                return this.graphics.getAttribute(key);
            } else {
                this.graphics.setAttribute(key, '' + value);
            }
        } else {
            Object.entries(key).forEach(([key, value]) => {
                this.graphics.setAttribute(key, '' + value);
            });
        }
    }

    /** 删除属性 */
    protected removeAttr(...props: string[]) {
        props.forEach(prop => {
            this.graphics.removeAttribute(prop);
        })
    }

    /** 移除节点 */
    public destroy() {
        this.graphics.parentNode.removeChild(this.graphics);
        this.graphics = null;
    }

    /** 图形构造函数 */
    abstract render(): SVGElement;

    /** 设置坐标 */
    abstract setLocation(x: number, y: number): this;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;

    static install() {

    }
}