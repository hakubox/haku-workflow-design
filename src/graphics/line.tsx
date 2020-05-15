import Graphics, { GraphicsParams } from "./graphics";
import { Location } from "@/interface";

/** 图形初始化参数 */
export class LineGraphicsParams extends GraphicsParams {
    /** 开始箭头 */
    startArrow?: any;
    /** 结束箭头 */
    endArrow?: any;
}

/** 线形 */
export default abstract class Line extends Graphics {
    constructor(config: LineGraphicsParams) {
        super(config);

        this.startArrow = config.startArrow;
        this.endArrow = config.endArrow;
    }

    /** 图形id */
    readonly id: string;

    /** 开始箭头配置 */
    startArrow: SVGElement;
    /** 结束箭头配置 */
    endArrow: SVGElement;
    /** 开始箭头元素 */
    startArrowEl: SVGElement;
    /** 结束箭头元素 */
    endArrowEl: SVGElement;

    /** 获取图形宽度 */
    abstract getWidth(): number;
    /** 获取图形高度 */
    abstract getHeight(): number;

    /** 图形构造函数 */
    abstract render(): SVGElement;
    /** 设置线的坐标点 */
    abstract setPoints(...locations: Location[]): this;
}
