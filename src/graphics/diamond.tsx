import { createSVGElement } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { RectParams, Rect } from '.';

export class DiamondParams extends RectParams {
}

/** 菱形 */
export default class Diamond extends Rect {
    constructor(config: RectParams) {
        super(config);

        this.radius = config.radius;
        this.width = config.width;
        this.height = config.height;
    }

    type = GraphicsType.diamond;
    description = '菱形';
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
        let _x = this.x + globalTransform.offsetX;
        let _y = this.y + globalTransform.offsetY;
        this.contentGraphics.setAttribute('points', [
            `${_x},${_y + this.height / 2}`,
            `${_x + this.width / 2},${_y}`,
            `${_x + this.width},${_y + this.height / 2}`,
            `${_x + this.width / 2},${_y + this.height}`
        ].join(' '));
        this.textGraphics.textGraphics.setLocation(
            this.textCoordinate.x,
            this.textCoordinate.y
        );
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
        let _x = this.x + globalTransform.offsetX;
        let _y = this.y + globalTransform.offsetY;
        return this._render(
            this.contentGraphics = (
                <polygon
                    points={[
                        `${_x},${_y + this.height / 2}`,
                        `${_x + this.width / 2},${_y}`,
                        `${_x + this.width},${_y + this.height / 2}`,
                        `${_x + this.width / 2},${_y + this.height}`
                    ].join(' ')}
                    stroke={this.stroke}
                    transform="translate(0.5 0.5)"
                    fill={this.fill}
                ></polygon>
            )
        );
        // this.contentGraphics = createSVGElement('path', {
        //     attrs: {
        //         d: [
        //             `M${_x} ${_y + this.height / 2}`,
        //             `L${_x + this.width / 2} ${_y}`,
        //             `L${_x + this.width} ${_y + this.height / 2}`,
        //             `L${_x + this.width / 2} ${_y + this.height}`,
        //             'Z'
        //         ].join(' '),
        //         stroke: this.stroke,
        //         transform: 'translate(0.5 0.5)',
        //         fill: this.fill
        //     }
        // }),
    }
}