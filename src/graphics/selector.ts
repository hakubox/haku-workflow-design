import { createSVGElement } from '@/tools';
import Transform from '@/core/transform';
import { RectParams, Rect } from '.';

export class SelectorParmas extends RectParams {
}

/** 选中时的图形操作工具 */
export default class Selector extends Rect {
    constructor(config: SelectorParmas) {
        super(config);
        
    }

    type = GraphicsType.selector;
    description = '图形选择框';

    /** 设置范围 */
    setArea(width: number, height: number, transform: Transform) {
        this.width = width;
        this.height = height;

        if (!this.graphics) return;

        if (width < 0) {
            const _x = this.x + transform.offsetX + width;
            this.graphics.setAttribute('x', _x + '');
        }
        
        if (height < 0) {
            const _y = this.y + transform.offsetY + height;
            this.graphics.setAttribute('y', _y + '');
        }

        this.graphics.setAttribute('width', Math.abs(this.width) * transform.scale + '');
        this.graphics.setAttribute('height', Math.abs(this.height) * transform.scale + '');
        return this;
    }

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