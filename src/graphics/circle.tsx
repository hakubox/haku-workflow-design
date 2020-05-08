import Block, { BlockParams } from './block';
import Transform, { globalTransform } from '@/core/transform';

export class CircleParams extends BlockParams {
    /** 半径 */
    radius: number;
}

/** 圆形 */
export default class Circle extends Block {
    constructor(config: CircleParams) {
        super(config);

        this.radius = config.radius;
    }

    static type = GraphicsType.circle;
    type = GraphicsType.circle;
    description = '圆形';
    /** 半径 */
    radius: number;

    
    getWidth() {
        return this.radius * 2;
    }

    getHeight() {
        return this.radius * 2;
    }
    
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.graphics.setAttribute('cx', x + this.radius + globalTransform.offsetX + '');
        this.graphics.setAttribute('cy', y + this.radius + globalTransform.offsetY + '');
        return this;
    }

    render() {
        return this._render(
            <circle
                cx={this.x + this.radius + globalTransform.offsetX}
                cy={this.y + this.radius + globalTransform.offsetY}
                r={this.radius}
                fill="red"
            ></circle>
        );
    }
}