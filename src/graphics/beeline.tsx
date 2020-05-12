import Line, { LineGraphicsParams } from '@/graphics/line';
import { createSVGElement } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Location } from '@/interface';


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

    setPoints(loc1: Location, loc2: Location): this {
        if (loc1) {
            this.x = loc1.x;
            this.y = loc1.y;
            this.graphics.setAttribute('transform', `translate(${this.x + globalTransform.offsetX},${this.y + globalTransform.offsetY})`);
        }
        
        if (loc2) {
            this.x2 = loc2.x;
            this.y2 = loc2.y;
        }
        this.contentGraphics.setAttribute('x2', this.x2 - this.x + '');
        this.contentGraphics.setAttribute('y2', this.y2 - this.y + '');
        
        return this;
    }

    render() {
        return this._render(
            <line
                x1="0"
                y1="0"
                x2={~~(this.x2 - this.x)}
                y2={~~(this.y2 - this.y)}
                stroke={this.stroke}
                transform='translate(0.5 0.5)'
                strokeWidth={this.width}
            >
            </line>
        );
    }
}