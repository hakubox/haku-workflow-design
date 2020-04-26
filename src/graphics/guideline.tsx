import { createSVGElement, mergeProps } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Line, GraphicsParams } from '.';


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

    getWidth() {
        return 0;
    }

    getHeight() {
        return 0;
    }
    
    setLocation(x: number, y: number) {
        return this;
    }

    render() {
        let _x1 = 0, _y1 = 0, _x2 = 0, _y2 = 0;
        if (this.direction === Direction.Horizontal) {
            _x1 = -9999;
            _x2 = 9999;
            _y1 = _y2 = this.location;
        } else {
            _y1 = -9999;
            _y2 = 9999;
            _x1 = _x2 = this.location;
        }

        return this._render(
            <line
                x1={~~(_x1 + globalTransform.offsetX)}
                y1={~~(_y1 + globalTransform.offsetY)}
                x2={~~(_x2 + globalTransform.offsetX)}
                y2={~~(_y2 + globalTransform.offsetY)}
                stroke={this.stroke}
                transform='translate(0.5 0.5)'
                strokeWidth={this.strokeWidth}
            >
            </line>
        );
    }
}