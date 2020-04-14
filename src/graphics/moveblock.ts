import { createSVGElement } from '@/tools';
import Graphics, { GraphicsParams } from '@/core/graphics';
import Transform from '@/core/transform';
import BlockGraphics, { BlockGraphicsParams } from './block';

export class MoveBlockParmas extends BlockGraphicsParams {
    /** 绑定源图形 */
    graphicsTarget?: Graphics;
    /** 宽度 */
    width?: number;
    /** 高度 */
    height?: number;
}

/** 选中时的图形操作工具 */
export class MoveBlock extends BlockGraphics {
    constructor(config: MoveBlockParmas) {
        super(config);
        
        if (config.graphicsTarget) {
            this.graphicsTarget = config.graphicsTarget;
            this.x = config.graphicsTarget.x;
            this.y = config.graphicsTarget.y;
            this.width = config.graphicsTarget.getWidth();
            this.height = config.graphicsTarget.getHeight();
        } else {
            this.x = config.x;
            this.y = config.y;
            this.width = config.width;
            this.height = config.height;
        }
    }

    type = GraphicsType.moveblock;
    description = '图形操作框';
    /** 绑定源图形 */
    graphicsTarget: Graphics;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
    /** 虚线框 */
    dottedBlock: SVGElement;
    /** 拖拽标记(9个) */
    dragmarks: SVGElement[] = [];
    /** 拉线标记(4个) */
    linemarks: SVGElement[] = [];
    /** 连接标记(4个) */
    linkmarks: SVGElement[] = [];


    setLocation(x: number, y: number, transform: Transform): void {
        this.x = x;
        this.y = y;
        this.graphicsTarget.setLocation(x, y, transform);
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
            i.setAttribute('x', _dragmarkLocs[index][0] + transform.offsetX - 4 + '');
            i.setAttribute('y', _dragmarkLocs[index][1] + transform.offsetY - 4 + '');
        });
    }

    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }

    render(transform: Transform = new Transform()) {
        const _dragMarkAttrs = {
            width: 8,
            height: 8,
            fill: '#FF4D4F',
            stroke: 'black',
            'stroke-width': 10,
            'stroke-opacity': 0,
        };

        this.dragmarks = [
            createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX - 4,
                    y: this.y + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + transform.offsetX - 4,
                    y: this.y + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - 4,
                    y: this.y + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - 4,
                    y: this.y + this.height / 2 + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width + transform.offsetX - 4,
                    y: this.y + this.height + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + this.width / 2 + transform.offsetX - 4,
                    y: this.y + this.height + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX - 4,
                    y: this.y + this.height / 2 + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
            }),
            createSVGElement('rect', {
                attrs: {
                    x: this.x + transform.offsetX - 4,
                    y: this.y + this.height + transform.offsetY - 4,
                    ..._dragMarkAttrs
                }, style: { cursor: 'nw-resize' },
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
                    stroke: '#52C41A',
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