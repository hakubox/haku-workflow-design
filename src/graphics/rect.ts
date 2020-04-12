import BlockGraphics, { BlockGraphicsParams } from './block';
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class RectParams extends BlockGraphicsParams {
    /** 半径 */
    radius: number;
}

/** 矩形 */
export default class Rect extends BlockGraphics {
    constructor(config: RectParams) {
        super(config);

        this.radius = config.radius;
    }

    /** 半径 */
    radius: number;

    
    getWidth() {
        return this.radius * 2;
    }

    getHeight() {
        return this.radius * 2;
    }
    
    setLocation(config: { x: number; y: number; offsetX: number; offsetY: number; }): void {
        
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