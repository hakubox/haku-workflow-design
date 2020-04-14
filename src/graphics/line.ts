import Transform from '../core/transform';
import Graphics, { GraphicsParams } from '../core/graphics';

/** 图形初始化参数 */
export class LineGraphicsParams extends GraphicsParams {
    /** 提示文本 */
    tooltip?: string;
    /** 标签文本 */
    label?: string;
}

/** 线形 */
export default abstract class Line extends Graphics {
    constructor(config: LineGraphicsParams) {
        super(config);
        this.label = config.label;
    }

    /** 图形id */
    readonly id: string;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;

    /** 图形构造函数 */
    abstract render(transform?: Transform): SVGElement;
}