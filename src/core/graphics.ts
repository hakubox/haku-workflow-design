import { createModelId } from '@/tools';
import Transform from './transform';

/** 图形初始化参数 */
export class GraphicsParams {
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    label?: string;
}

/** 图形 */
export default abstract class Graphics {
    constructor(config: GraphicsParams) {
        this.id = createModelId(16);

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

    /** 移除节点 */
    public destroy() {
        this.graphics.parentNode.removeChild(this.graphics);
        this.graphics = null;
    }

    protected _render(graphics: SVGElement) {
        let _parent: SVGElement;
        if (this.graphics) {
            _parent = this.graphics.parentNode as SVGElement;
            this.destroy();
        }
        this.graphics = graphics;
        if (_parent) {
            _parent.appendChild(graphics);
        }
        return graphics;
    }

    /** 图形构造函数 */
    abstract render(transform?: Transform): SVGElement;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;
}