import Line, { LineGraphicsParams } from '@/graphics/line';
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';


export class BeeLineParams extends LineGraphicsParams {
    /** 起始点横坐标 */
    x1: number;
    /** 起始点纵坐标 */
    y1: number;
    /** 终止点横坐标 */
    x2: number = 0;
    /** 终止点纵坐标 */
    y2: number = 0;
    /** 线颜色 */
    stroke: string = 'red';
    /** 线宽 */
    width?: number = 1;
}

/** 矩形 */
export default class Beeline extends Line {
    constructor(config: BeeLineParams) {
        super(config);

        this.x1 = config.x1;
        this.y1 = config.y1;
        this.x2 = config.x2;
        this.y2 = config.y2;
        this.stroke = config.stroke;
        this.width = config.width;
    }

    /** 起点横坐标 */
    x1: number;
    /** 起点纵坐标 */
    y1: number;
    /** 终点横坐标 */
    x2: number;
    /** 终点纵坐标 */
    y2: number;
    /** 线颜色 */
    stroke: string;
    /** 线宽 */
    width: number;

    
    getWidth() {
        return Math.abs(this.x2 - this.x1);
    }

    getHeight() {
        return Math.abs(this.y2 - this.y1);
    }
    
    setLocation(config: { offsetX: number; offsetY: number; }): void {
        
    }

    render(transform: Transform = new Transform()) {
        return this._render(createSVGElement('line', {
            attrs: {
                x1: ~~(this.x1 + transform.offsetX),
                y1: ~~(this.y1 + transform.offsetY),
                x2: ~~(this.x2 + transform.offsetX),
                y2: ~~(this.y2 + transform.offsetY),
                stroke: this.stroke,
                transform: 'translate(0.5 0.5)',
                ['stroke-width']: this.width
            }
        }));
    }
}