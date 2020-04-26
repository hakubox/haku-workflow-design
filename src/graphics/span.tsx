import { createSVGElement, mergeProps } from "@/tools";
import Transform, { globalTransform } from '@/core/transform';
import { Graphics, GraphicsParams } from '.';

export class SpanParams extends GraphicsParams {
    /** 边缘颜色 */
    stroke?: string;
    /** 父级节点 */
    parent: SVGElement;
}

/** 文本 */
export default class Span extends Graphics {
    constructor(config: SpanParams) {
        super(config);
        mergeProps(this, config);
        this.textGraphics = this;
        this.render();
    }

    type = GraphicsType.span;
    textLocation = TextLocation.None;
    description = '文本';

    /** 父级节点 */
    parent: SVGElement;
    /** 边缘颜色 */
    stroke: string;
    /** 水平对齐 */
    textAnchor: string = 'middle';
    /** 垂直对齐 */
    baseline: string = 'middle';

    
    getWidth() {
        return this.contentGraphics.clientWidth;
    }

    getHeight() {
        return this.contentGraphics.clientHeight;
    }
    
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.contentGraphics.setAttribute('x', x + globalTransform.offsetX + '');
        this.contentGraphics.setAttribute('y', y + globalTransform.offsetY + '');
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
                x={this.x + globalTransform.offsetX}
                y={this.y + globalTransform.offsetY}
                textAnchor={this.textAnchor}
                dominantBaseline={this.baseline}
                fill={this.textColor}
            >{ this.text || '' }</text>
        );
        this.parent.appendChild(this.graphics);
        return this.graphics;
    }
}