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
            this.dragmarks.forEach(i => i.style.display = val ? 'none' : 'block');
        }
    }
    /** 计算边距 */
    get badgePadding(): number {
        return Math.floor(this.badgeWidth / 2) + 1;
    }

    /** 拖拽小方块边距 */


    setLocation(x: number, y: number) {
        this.x = x;
        this.y = y;
        // this.graphicsTarget.forEach(i => i.setLocation(x, y, transform));
        this.contentGraphics.setAttribute('x', x + globalTransform.offsetX + '');
        this.contentGraphics.setAttribute('y', y + globalTransform.offsetY + '');
        
        const _dragmarkLocs = [
            [this.x, this.y],
            [this.x + this.width / 2, this.y],
            [this.x + this.width, this.y],
            [this.x, this.y + this.height / 2],
            [this.x, this.y + this.height],
            [this.x + this.width, this.y + this.height / 2],
            [this.x + this.width / 2, this.y + this.height],
            [this.x + this.width, this.y + this.height],
        ];
        this.dragmarks.forEach((i ,index) => {
            i.setAttribute('x', _dragmarkLocs[index][0] + globalTransform.offsetX - 5 + '');
            i.setAttribute('y', _dragmarkLocs[index][1] + globalTransform.offsetY - 5 + '');
        });
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
            cursor: 'nw-resize', 
            display: this.isMove ? 'none' : 'block'
        };

        this.dragmarks = [
            createSVGElement('rect', {
                attrs: {
                    x: this.x + globalTransform.offsetX - this.badgePadding,
                    y: this.y + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + globalTransform.offsetX - this.badgePadding,
                    y: this.y + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + globalTransform.offsetX - this.badgePadding,
                    y: this.y + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + globalTransform.offsetX - this.badgePadding,
                    y: this.y + this.height / 2 + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + globalTransform.offsetX - this.badgePadding,
                    y: this.y + this.height + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + globalTransform.offsetX - this.badgePadding,
                    y: this.y + this.height + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + globalTransform.offsetX - this.badgePadding,
                    y: this.y + this.height / 2 + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + globalTransform.offsetX - this.badgePadding,
                    y: this.y + this.height + globalTransform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
        ];

        let _group = createSVGElement('g', {
            attrs: {
            }
        }, this.contentGraphics = createSVGElement('rect', {
                attrs: {
                    x: this.x + globalTransform.offsetX,
                    y: this.y + globalTransform.offsetY,
                    width: this.width,
                    height: this.height,
                    fill: 'none',
                    stroke: this.badgeColor,
                    'stroke-dasharray': '3 3',
                    transform: 'translate(0.5 0.5)',
                    'pointer-events': 'none'
                }
            }),
            ...this.dragmarks
        );
        return this._render(_group);
    }
}