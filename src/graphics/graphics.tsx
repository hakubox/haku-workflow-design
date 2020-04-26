import { createModelId, mergeProps, createSVGElement } from '@/tools';
import { globalTransform } from '../core/transform';
import { TextAttrs, Location } from '@/interface';
import { Span } from '.';

/** 图形初始化参数 */
export class GraphicsParams {
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    text?: string;
    /** 文字颜色 */
    textColor?: string;
    /** 文本位置 */
    textLocation?: TextLocation;
    /** 横坐标点 */
    x?: number;
    /** 纵坐标点 */
    y?: number;
}

/** 图形 */
export default abstract class Graphics {
    constructor(config: GraphicsParams) {
        this.id = createModelId(16);
        mergeProps(this, config);
    }

    private _active = false;
    private _isEdit: boolean = false;
    private _isShow: boolean = true;
    /** 图形id */
    readonly id: string;

    /** 图形元素 */
    graphics: SVGElement;
    /** 有时为内层核心元素 */
    contentGraphics: SVGElement;
    /** text文本元素 */
    textGraphics: Span;
    /** 圆角弧度 */
    // fillet: number = 0;
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    protected text?: string;
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
        if (val) {
            this.contentGraphics.setAttribute('filter', 'url(#graphics-light)');
        } else {
            this.contentGraphics.removeAttribute('filter');
        }
        this._active = val;
    }

    getText() {
        return this.text;
    }
    
    /** 设置标签文本 */
    setText(text: string) {
        this.text = text;
        this.textGraphics.graphics.innerHTML = text;
        return this;
    }

    /** 设置标签文本位置 */
    setTextLocation(location: TextLocation) {
        this.textLocation = location;
        this.textGraphics.render();
        return this;
    }

    
    protected _renderOrigin(graphics: SVGElement) {
        let _graphics: SVGElement = graphics;
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(_graphics, this.graphics);
            this.contentGraphics.setAttribute('gid', this.id);
            this.contentGraphics.setAttribute('gtype', this.type);
        }
        this.graphics = _graphics;
        this.contentGraphics.setAttribute('gid', this.id);
        this.contentGraphics.setAttribute('gtype', this.type);
        return _graphics;
    }

    public refresh() {
        this.graphics.parentElement.replaceChild(this.graphics, this.render());
    }

    protected _render(contentGraphics: SVGElement, ...graphics: SVGElement[]) {

        

        this.contentGraphics = contentGraphics;
        let _graphics: SVGElement = createSVGElement('g', {
            attrs: {}
        }, contentGraphics, ...graphics);
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(_graphics, this.graphics);
        }
        this.graphics = _graphics;
        this.textGraphics = this._renderText();
        this.graphics.appendChild(this.textGraphics.graphics);
        this.contentGraphics.setAttribute('gid', this.id);
        this.contentGraphics.setAttribute('gtype', this.type);
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
    protected _renderText(x: number = 0, y: number = 0, config: Record<string, any> = {}) {
        if (this?.textGraphics?.graphics) {
            this.textGraphics.graphics.parentElement.removeChild(this.textGraphics.graphics);
        }
        return new Span({
            parent: this.graphics,
            text: this.text,
            x: this.textAttrs.x + x,
            y: this.textAttrs.y + y,
            ...config
        });
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

    /** 移除节点 */
    public destroy() {
        this.graphics.parentNode.removeChild(this.graphics);
        this.graphics = null;
    }

    /** 图形构造函数 */
    abstract render(): SVGElement;

    refreshLocation() {
        this.setLocation(this.x, this.y);
    }

    /** 设置坐标 */
    abstract setLocation(x: number, y: number): this;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;
}