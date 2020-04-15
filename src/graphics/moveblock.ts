import { createSVGElement } from '@/tools';
import Transform from '@/core/transform';
import { Rect, RectParams } from '.';

export class MoveBlockParmas extends RectParams {
    /** 是否为移动状态 */
    isMove: boolean;
}

/** 选中时的图形操作工具 */
export default class MoveBlock extends Rect {
    constructor(config: MoveBlockParmas) {
        super(config);

        this.isMove = config.isMove;
    }

    type = GraphicsType.moveblock;
    description = '图形操作框';
    
    private _isMove: boolean = false;
    /** 虚线框 */
    dottedBlock: SVGElement;
    /** 拖拽标记(9个) */
    dragmarks: SVGElement[] = [];
    /** 拉线标记(5个) */
    linemarks: SVGElement[] = [];
    /** 连接标记(5个) */
    linkmarks: SVGElement[] = [];

    /** 是否为移动状态 */
    get isMove() { return this._isMove; }
    set isMove(val: boolean) {
        this._isMove = val;
    }


    setLocation(x: number, y: number, transform: Transform) {
        this.x = x;
        this.y = y;
        // this.graphicsTarget.forEach(i => i.setLocation(x, y, transform));
        this.dottedBlock.setAttribute('x', x + transform.offsetX + '');
        this.dottedBlock.setAttribute('y', y + transform.offsetY + '');
        
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
            i.setAttribute('x', _dragmarkLocs[index][0] + transform.offsetX - 5 + '');
            i.setAttribute('y', _dragmarkLocs[index][1] + transform.offsetY - 5 + '');
        });
        return this;
    }

    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }

    /** 拖拽小方块的大小 */
    readonly badgeWidth: number = 9;
    /** 拖拽小方块颜色 */
    readonly badgeColor: string = '#52C41A';
    /** 拖拽小方块边距 */
    get badgePadding(): number {
        return Math.floor(this.badgeWidth / 2) + 1;
    }

    render(transform: Transform = new Transform()) {
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
                    x: this.x + transform.offsetX - this.badgePadding,
                    y: this.y + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + transform.offsetX - this.badgePadding,
                    y: this.y + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - this.badgePadding,
                    y: this.y + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - this.badgePadding,
                    y: this.y + this.height / 2 + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - this.badgePadding,
                    y: this.y + this.height + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + transform.offsetX - this.badgePadding,
                    y: this.y + this.height + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX - this.badgePadding,
                    y: this.y + this.height / 2 + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX - this.badgePadding,
                    y: this.y + this.height + transform.offsetY - this.badgePadding,
                    ..._dragMarkAttrs
                }, style: _dragMarkStyles,
            }),
        ];

        let _group = createSVGElement('g', {
            attrs: {
            }
        }, this.dottedBlock = createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX,
                    y: this.y + transform.offsetY,
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