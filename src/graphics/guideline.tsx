import { createSVGElement, mergeProps } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Line, GraphicsParams } from '.';
import { Location } from '@/interface';

export class GuideLineParams extends GraphicsParams {
    /** 方向 */
    direction: Direction;
    location: number;
    /** 线颜色 */
    stroke: string = 'green';
    /** 线宽 */
    strokeWidth?: number = 1;
}

/** 参考线 */
export default class GuideLine extends Line {
    constructor(config: GuideLineParams) {
        super(config);
        mergeProps(this, config);

        let _x1 = 0, _y1 = 0, _x2 = 0, _y2 = 0;
        if (this.direction === Direction.Horizontal) {
            _x1 = -99999;
            _x2 = 99999;
            _y1 = _y2 = this.location;
        } else {
            _y1 = -99999;
            _y2 = 99999;
            _x1 = _x2 = this.location;
        }
        this.x = _x1;
        this.y = _y1;
    }

    type = GraphicsType.guideline;
    direction: Direction;
    description = '参考线';
    /** 位置 */
    location: number;
    /** 线颜色 */
    stroke: string;
    /** 线宽 */
    strokeWidth: number;
    isGuide = true;

    getWidth() {
        return 0;
    }

    getHeight() {
        return 0;
    }
    
    setLocation(x: number, y: number) {
        return this;
    }

    setPoints(loc1: Location): this {
        if (loc1) {
            if (this.direction === Direction.Horizontal) {
                this.y = loc1.y;
                this.contentGraphics.setAttribute('y1', this.y + globalTransform.offsetY + '');
            } else if (this.direction === Direction.Vertical) {
                this.x = loc1.x;
                this.contentGraphics.setAttribute('x1', this.x + globalTransform.offsetX + '');
            }
        }
        return this;
    }

    render() {
        let _x1 = 0, _y1 = 0, _x2 = 0, _y2 = 0;
        if (this.direction === Direction.Horizontal) {
            _x2 = 200000;
        } else {
            _y2 = 200000;
        }

        return this._render(
            <line
                x1={_x1}
                y1={_y1}
                x2={_x2}
                y2={_y2}
                stroke={this.stroke}
                transform='translate(0.5 0.5)'
                style="pointer-events: none;"
                strokeWidth={this.strokeWidth}
            >
            </line>
        );
    }
}