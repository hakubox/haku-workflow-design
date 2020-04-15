import { createSVGElement } from '@/tools';
import Transform, { globalTransform } from '@/core/transform';
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
    setArea(width: number, height: number) {
        this.width = width;
        this.height = height;

        if (!this.graphics) return;

        if (width < 0) {
            const _x = this.x + globalTransform.offsetX + width;
            this.graphics.setAttribute('x', _x + '');
        }
        
        if (height < 0) {
            const _y = this.y + globalTransform.offsetY + height;
            this.graphics.setAttribute('y', _y + '');
        }

        this.graphics.setAttribute('width', Math.abs(this.width) * globalTransform.scale + '');
        this.graphics.setAttribute('height', Math.abs(this.height) * globalTransform.scale + '');
        return this;
    }

    render() {
        return this._render(this.contentGraphics = createSVGElement('rect', {
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