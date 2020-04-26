import Block, { BlockParams } from './block';
import { createSVGElement } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';

export class RectParams extends BlockParams {
    /** 圆角半径 */
    radius?: number = 0;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
}

/** 矩形 */
export default class Rect extends Block {
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
    
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.contentGraphics.setAttribute('x', x + globalTransform.offsetX + '');
        this.contentGraphics.setAttribute('y', y + globalTransform.offsetY + '');
        this.textGraphics.contentGraphics.setAttribute('x', this.textCoordinate.x + globalTransform.offsetX + '');
        this.textGraphics.contentGraphics.setAttribute('y', this.textCoordinate.y + globalTransform.offsetY + '');
        return this;
    }

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
        return this._render(
            <rect
                x={this.x + globalTransform.offsetX}
                y={this.y + globalTransform.offsetY}
                rx={this.radius}
                ry={this.radius}
                width={this.width}
                height={this.height}
                stroke={this.stroke}
                transform='translate(0.5 0.5)'
                fill={this.fill}
            >
            </rect>
        );
    }
}