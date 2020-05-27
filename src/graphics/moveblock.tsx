import { createSVGElement } from '@/tools';
import Transform, { globalTransform } from '@/core/transform';
import { Rect, RectParams } from '.';

export class MoveBlockParmas extends RectParams {
}

/** 选中时的图形操作工具 */
export default class MoveBlock extends Rect {
    constructor(config: MoveBlockParmas) {
        super(config);
    }

    type = GraphicsType.moveblock;
    description = '图形操作框';
    
    private _isMove: boolean = false;
    /** 拖拽标记(9个) */
    dragmarks: SVGElement[] = [];
    /** 拉线标记(5个) */
    linemarks: SVGElement[] = [];
    /** 连接标记(5个) */
    linkmarks: SVGElement[] = [];
    /** 拖拽小方块的大小 */
    readonly badgeWidth: number = 9;
    /** 拖拽小方块颜色 */
    readonly badgeColor: string = '#52C41A';
    

    /** 是否为移动状态 */
    get isMove() { return this._isMove; }
    set isMove(val: boolean) {
        if (val !== this._isMove) {
            this._isMove = val;
        }
        this.dragmarks.forEach(i => i.style.display = this._isMove ? 'none' : 'block');
    }
    /** 计算边距 */
    get badgePadding(): number {
        return Math.floor(this.badgeWidth / 2) + 1;
    }

    /** 拖拽小方块边距 */
    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.graphics.setAttribute('transform', `translate(${x + globalTransform.offsetX},${y + globalTransform.offsetY})`);
        return this;
    }

    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }

    render() {
        const _dragMarkAttrs = {
            width: this.badgeWidth,
            height: this.badgeWidth,
            fill: 'white',
            stroke: this.badgeColor,
            transform: 'translate(0.5 0.5)',
            'stroke-width': 1,
        };
        const _dragMarkStyles = {
            display: this.isMove ? 'none' : 'block'
        };

        return this._render(this.contentGraphics = <rect
                x="0"
                y="0"
                width={this.width}
                height={this.height}
                fill="none"
                stroke={this.badgeColor}
                stroke-dasharray='3 3'
                transform={`translate(0.5 0.5)`}
                pointer-events="none"
            ></rect>,
            ...(this.dragmarks = [
                <rect x={-this.badgePadding} y={-this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='nw-resize'></rect>,
                <rect x={this.width / 2 - this.badgePadding} y={-this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='n-resize'></rect>,
                <rect x={this.width - this.badgePadding} y={-this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='ne-resize'></rect>,
                <rect x={this.width - this.badgePadding} y={this.height / 2 - this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='e-resize'></rect>,
                <rect x={this.width - this.badgePadding} y={this.height - this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='nw-resize'></rect>,
                <rect x={this.width / 2 - this.badgePadding} y={this.height - this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='n-resize'></rect>,
                <rect x={-this.badgePadding} y={this.height / 2 - this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='e-resize'></rect>,
                <rect x={-this.badgePadding} y={this.height - this.badgePadding} {..._dragMarkAttrs} style={_dragMarkStyles} cursor='ne-resize'></rect>
            ])
        );
    }
}