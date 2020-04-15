import Line, { LineGraphicsParams } from '@/graphics/line';
import { createSVGElement } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';


export class BeeLineParams extends LineGraphicsParams {
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
export default class BeeLine extends Line {
    constructor(config: BeeLineParams) {
        super(config);

        this.x2 = config.x2;
        this.y2 = config.y2;
        this.stroke = config.stroke;
        this.width = config.width;
    }

    type = GraphicsType.beeline;
    description = '直线';
    /** 终点横坐标 */
    x2: number;
    /** 终点纵坐标 */
    y2: number;
    /** 线颜色 */
    stroke: string;
    /** 线宽 */
    width: number;

    
    getWidth() {
        return Math.abs(this.x2 - this.x);
    }

    getHeight() {
        return Math.abs(this.y2 - this.y);
    }
    
    setLocation(x: number, y: number) {
        return this;
    }

    render() {
        return this._render(createSVGElement('line', {
            attrs: {
                x1: ~~(this.x + globalTransform.offsetX),
                y1: ~~(this.y + globalTransform.offsetY),
                x2: ~~(this.x2 + globalTransform.offsetX),
                y2: ~~(this.y2 + globalTransform.offsetY),
                stroke: this.stroke,
                transform: 'translate(0.5 0.5)',
                ['stroke-width']: this.width
            }
        }));
    }
}