import { createSVGElement, mergeProps } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Graphics, GraphicsParams } from '.';

export class SpanParams extends GraphicsParams {
    text?: string;
    /** 边缘颜色 */
    stroke?: string;
}

/** 文本 */
export default class Span extends Graphics {
    constructor(config: SpanParams) {
        super(config);
        mergeProps(this, config);
        // this.textGraphics = this;
        this.render();
    }

    type = GraphicsType.span;
    textLocation = TextLocation.None;
    description = '文本';

    
    /** 标签文本 */
    protected text?: string;
    /** 边缘颜色 */
    stroke: string;
    /** 水平对齐 */
    textAnchor: string = 'middle';
    /** 垂直对齐 */
    baseline: string = 'middle';

    
    getWidth() {
        return this.graphics?.clientWidth || 0;
    }

    getHeight() {
        return this.graphics?.clientHeight || 0;
    }
    
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
        // this.contentGraphics.setAttribute('x', x + globalTransform.offsetX + '');
        // this.contentGraphics.setAttribute('y', y + globalTransform.offsetY + '');
        this.contentGraphics.setAttribute('transform', `translate(${x + globalTransform.offsetX},${y + globalTransform.offsetY})`);
        return this;
    }

    /** 设置范围 */
    setArea(width: number, height: number) {
        return this;
    }

    render() {
        this.graphics = this.contentGraphics = (
            <text
                className='graphics-label'
                gid={this.id}
                gtype={this.type}
                x='0'
                y='0'
                transform={`translate(${this.x + globalTransform.offsetX},${this.y + globalTransform.offsetY})`}
                textAnchor={this.textAnchor}
                dominantBaseline={this.baseline}
                fill={this.textColor}
            >{ this.text || '' }</text>
        );
        return this.graphics;
    }
}