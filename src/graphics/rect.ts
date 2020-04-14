import BlockGraphics, { BlockGraphicsParams } from './block';
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class RectParams extends BlockGraphicsParams {
    /** 圆角半径 */
    radius: number;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
}

/** 矩形 */
export default class Rect extends BlockGraphics {
    constructor(config: RectParams) {
        super(config);

        this.radius = config.radius;
        this.width = config.width;
        this.height = config.height;
    }

    type = GraphicsType.rect;
    description = '矩形';
    /** 圆角半径 */
    radius: number;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;

    
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
    
    setLocation(x: number, y: number, transform: Transform): void {
        this.x = x;
        this.y = y;
        this.graphics.setAttribute('x', x + transform.offsetX + '');
        this.graphics.setAttribute('y', y + transform.offsetY + '');
    }

    render(transform: Transform = new Transform()) {
        return this._render(createSVGElement('rect', {
            attrs: {
                x: this.x + transform.offsetX,
                y: this.y + transform.offsetY,
                rx: this.radius,
                ry: this.radius,
                width: this.width,
                height: this.height,
                fill: this.fill
            }
        }));
    }
}