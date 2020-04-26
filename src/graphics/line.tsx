import Graphics, { GraphicsParams } from './graphics';

/** 图形初始化参数 */
export class LineGraphicsParams extends GraphicsParams {
}

/** 线形 */
export default abstract class Line extends Graphics {
    constructor(config: LineGraphicsParams) {
        super(config);
    }

    /** 图形id */
    readonly id: string;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;

    protected _render(graphics: SVGElement) {
        if (this.graphics) {
            let _parent = this.graphics.parentNode as SVGElement;
            _parent.replaceChild(graphics, this.graphics);
            graphics.setAttribute('lid', this.id);
        }
        this.graphics = graphics;
        graphics.setAttribute('lid', this.id);
        return graphics;
    }

    /** 图形构造函数 */
    abstract render(): SVGElement;
}