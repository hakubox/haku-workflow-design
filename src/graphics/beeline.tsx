import Line, { LineGraphicsParams } from '@/graphics/line';
import { createSVGElement, getAngle } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Location } from '@/interface';
import svgpath from 'svgpath';


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

        if (this.endArrowEl) {
            this.endArrowEl.setAttribute('d', `
                M ${this.x2 - this.x} ${this.y2 - this.y} 
                L ${this.x2 - this.x + 7} ${this.y2 - this.y + 14} 
                L ${this.x2 - this.x} ${this.y2 - this.y + 10} 
                L ${this.x2 - this.x - 6} ${this.y2 - this.y + 14} 
                Z`.replace(/\n|  /g, '')
            );

            
            const _path = svgpath(this.endArrowEl.getAttribute('d')).rotate(getAngle(this.x2 - this.x, this.y2 - this.y), this.x2 - this.x, this.y2 - this.y).toString();
            this.endArrowEl.setAttribute('d', _path);
        }
        
        return this;
    }

    render() {
        let _endArrowEl: SVGElement;
        let _endX = this.x2 - this.x;
        let _endY = this.y2 - this.y;
        if (this.endArrow) {

            _endArrowEl = (<path 
                d={`M${_endX} ${_endY} L ${_endX + 7} ${_endY + 14} L ${_endX} ${_endY + 10} L ${_endX - 6} ${_endY + 14} Z`}
                stroke={this.stroke}
                fill={this.stroke}
            ></path>);
        }

        return this._render(
            <line
                x1="0"
                y1="0"
                x2={_endX}
                y2={_endY}
                stroke={this.stroke}
                transform='translate(0.5 0.5)'
                strokeWidth={this.width}
            >
            </line>,
            this.endArrowEl = _endArrowEl
        );
    }
}