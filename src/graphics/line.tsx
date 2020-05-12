import Graphics, { GraphicsParams } from './graphics';
import { Location } from '@/interface';

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

    /** 图形构造函数 */
    abstract render(): SVGElement;
    /** 设置线的坐标点 */
    abstract setPoints(...locations: Location[]): this;
}