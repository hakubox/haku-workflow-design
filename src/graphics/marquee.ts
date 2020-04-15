import { createSVGElement } from '@/tools';
import Transform from '@/core/transform';
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

    render(transform: Transform = new Transform()) {
        return this._render(createSVGElement('rect', {
            attrs: {
                x: this.x + transform.offsetX,
                y: this.y + transform.offsetY,
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