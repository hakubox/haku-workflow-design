import BlockGraphics, { BlockGraphicsParams } from './block';
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class RectParams extends BlockGraphicsParams {
    /** 圆角半径 */
    radius?: number = 0;
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
    
    setLocation(x: number, y: number, transform: Transform) {
        this.x = x;
        this.y = y;
        this.graphics.setAttribute('x', x + transform.offsetX + '');
        this.graphics.setAttribute('y', y + transform.offsetY + '');
        return this;
    }

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
                rx: this.radius,
                ry: this.radius,
                width: this.width,
                height: this.height,
                fill: this.fill
            }
        }));
    }
}