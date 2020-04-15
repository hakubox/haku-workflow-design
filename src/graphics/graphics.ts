import { createModelId, mergeProps, createSVGElement } from '@/tools';
import { globalTransform } from '../core/transform';
import { TextAttrs, Location } from '@/interface';

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

    /** 图形id */
    readonly id: string;

    /** 图形元素 */
    graphics: SVGElement;
    /** 有时为内层核心元素 */
    contentGraphics: SVGElement;
    /** text文本元素 */
    textGraphics: SVGElement;
    /** 圆角弧度 */
    // fillet: number = 0;
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    private text?: string;
    /** 文字位置 */
    textLocation = TextLocation.Bottom;
    /** 文字颜色 */
    textColor: string = '#888888';
    /** 横坐标 */
    x: number;
    /** 纵坐标 */
    y: number;
    
    /** 设置标签文本 */
    setText(text: string) {
        this.text = text;
        this.textGraphics.innerHTML = text;
        return this;
    }

    /** 设置标签文本 */
    setTextLocation(location: TextLocation) {
        this.textLocation = location;
        this.render();
        return this;
    }

    protected _render(graphics: SVGElement) {
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(graphics, this.graphics);
            this.contentGraphics.setAttribute('gid', this.id);
            this.contentGraphics.setAttribute('gtype', this.type);
        }
        this.graphics = graphics;
        this.contentGraphics.setAttribute('gid', this.id);
        this.contentGraphics.setAttribute('gtype', this.type);
        return graphics;
    }

    /** 获取图形文本的坐标 */
    get textCoordinate(): Location {
        return {
            none: { },
            top: {
                x: this.x + this.getWidth() / 2 + globalTransform.offsetX,
                y: this.y - 12 + globalTransform.offsetY,
            },
            center: {
                x: this.x + this.getWidth() / 2 + globalTransform.offsetX,
                y: this.y + this.getHeight() / 2 + globalTransform.offsetY
            },
            bottom: {
                x: this.x + this.getWidth() / 2 + globalTransform.offsetX,
                y: this.y + this.getHeight() + 16 + globalTransform.offsetY
            },
            custom: {
                x: this.x + globalTransform.offsetX,
                y: this.y + globalTransform.offsetY
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
        const _textProps = Object.assign({}, this.textAttrs, {
            x: this.textAttrs.x + x,
            y: this.textAttrs.y + y,
            ...config
        });

        return createSVGElement('text', {
            text: this.text,
            attrs: {
                ..._textProps,
                ...config
            }
        });
    }

    private _active = false;
    /** 图形类型 */
    abstract type: GraphicsType;
    /** 描述 */
    abstract description: string;

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