import BlockGraphics, { BlockGraphicsParams } from './block';
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class CircleParams extends BlockGraphicsParams {
    /** 半径 */
    radius: number;
}

/** 矩形 */
export default class Circle extends BlockGraphics {
    constructor(config: CircleParams) {
        super(config);

        this.radius = config.radius;
    }

    type = GraphicsType.circle;
    description = '矩形';
    /** 半径 */
    radius: number;

    
    getWidth() {
        return this.radius * 2;
    }

    getHeight() {
        return this.radius * 2;
    }
    
    setLocation(x: number, y: number, transform: Transform) {
        this.x = x;
        this.y = y;
        this.graphics.setAttribute('cx', x + this.radius + transform.offsetX + '');
        this.graphics.setAttribute('cy', y + this.radius + transform.offsetY + '');
        return this;
    }

    render(transform: Transform = new Transform()) {
        return this._render(createSVGElement('circle', {
            attrs: {
                cx: this.x + this.radius + transform.offsetX,
                cy: this.y + this.radius + transform.offsetY,
                r: this.radius,
                fill: 'red'
            }
        }));
    }
}