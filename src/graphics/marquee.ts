import { createSVGElement } from '@/tools';
import Transform, { globalTransform } from '@/core/transform';
import { RectParams, Rect } from '.';

export class MarqueeParmas extends RectParams {
}

/** 选中时的图形操作工具 */
export default class Marquee extends Rect {
    constructor(config: MarqueeParmas) {
        super(config);
    }

    type = GraphicsType.marquee;
    description = '区域框';

    render() {
        return this._render(createSVGElement('rect', {
            attrs: {
                x: this.x + globalTransform.offsetX,
                y: this.y + globalTransform.offsetY,
                width: this.width,
                height: this.height,
                fill: '#1890FF55',
                stroke: '#1890FF',
                transform: 'translate(0.5 0.5)',
                'pointer-events': 'none'
            }
        }));
    }
}