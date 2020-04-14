import { createModelId } from '@/tools';
import Transform from './transform';

/** 图形初始化参数 */
export class GraphicsParams {
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    label?: string;
    /** 横坐标点 */
    x?: number;
    /** 纵坐标点 */
    y?: number;
}

/** 图形 */
export default abstract class Graphics {
    constructor(config: GraphicsParams) {
        this.id = createModelId(16);

        this.x = config.x;
        this.y = config.y;
        this.label = config.label;
    }

    /** 图形id */
    readonly id: string;

    /** 图形元素 */
    graphics: SVGElement;
    /** 圆角弧度 */
    // fillet: number = 0;
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    label?: string;
    /** 横坐标 */
    x: number;
    /** 纵坐标 */
    y: number;
    

    protected _render(graphics: SVGElement) {
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(graphics, this.graphics);
            graphics.setAttribute('gid', this.id);
        }
        this.graphics = graphics;
        graphics.setAttribute('gid', this.id);
        return graphics;
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
    abstract render(transform?: Transform): SVGElement;

    /** 设置坐标 */
    abstract setLocation(x: number, y: number, config: Transform): void;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;
}