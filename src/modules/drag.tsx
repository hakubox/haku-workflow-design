import { Location, IdLocation } from "@/interface";
import Module from '@/core/module';
import { Editor } from '@/core';
import EditorModule, { EditorModuleParams } from '@/core/eidtormodule';
import { intersects } from '@/tools';
import { globalTransform } from '@/core/transform';
import { Graphics, MoveBlock } from '@/graphics';

/**
 * 拖拽
 */
export default class Drag extends EditorModule {
    constructor(options: EditorModuleParams) {
        super(options);

        this.editor.on(EditorEventType.EditorMouseDown, this.mouseDown, this);
        this.editor.on(EditorEventType.EditorMouseMove, this.mouseMove, this);
        this.editor.on(EditorEventType.EditorMouseUp, this.mouseUp, this);
        this.editor.on(EditorEventType.EditorAreaSelect, this.areaSelect, this);
    }

    /** 是否开始拖拽 */
    isStart: boolean = false;

    /** 坐标点集合 */
    locations: IdLocation[] = [];

    /** X坐标起始点 */
    x1?: number;
    /** Y坐标起始点 */
    y1?: number;
    /** X坐标结束点 */
    x2?: number;
    /** Y坐标结束点 */
    y2?: number;
    /** 拖拽块 */
    private _moveBlock: MoveBlock;
    /** 拖拽图形组 */
    dragGroup: SVGElement;
    /** 拖拽图形列表 */
    dragGraphicsList: Graphics[] = [];
    
    /** 最小X坐标 */
    get minx() {
        let _x = Number.MAX_VALUE;
        this.locations.forEach(i => {
            _x = i.x < _x ? i.x : _x; 
        });
        return _x;
    }

    /** 最小Y坐标 */
    get miny() {
        let _y = Number.MAX_VALUE;
        this.locations.forEach(i => {
            _y = i.y < _y ? i.y : _y; 
        });
        return _y;
    }
    
    /** 拖拽重置 */
    reset() {
        this.isStart = false;
        this.x1 = this.x2 = this.y1 = this.y2 = 0;
    }

    mouseDown(e) {
        this.isStart = true;

        let _gid = (e.target as Element).getAttribute('gid');
        this.editor.clearSelectorTool();

        if (_gid) {
            let _topGraphics = this.editor.graphicsMap.find(i => i.id === _gid);
            if (_topGraphics) {
                if (!this.locations.find(i => i.id === _gid)) {
                    this.editor.graphicsMap.forEach(i => {
                        if(i.active !== false) i.active = false;
                    });
                    this.locations = [{ id: _gid, x: _topGraphics.x, y: _topGraphics.y }];
                    _topGraphics.active = true;
                    this.editor.setMoveblock(true, _topGraphics);
                } else if (this.editor.getMoveBlock()) {
                    this.editor.getMoveBlock().isMove = true;
                }
                this.x1 = e.offsetX - globalTransform.offsetX;
                this.y1 = e.offsetY - globalTransform.offsetY;
                this.isStart = true;

                this._moveBlock = this.editor.graphicsGuideMap.find(o => o.type === GraphicsType.moveblock) as MoveBlock;
                this.dragGraphicsList = this.editor.graphicsMap.filter(i => i.active);
                
                // 新增拖拽优化
                // this.dragGroup = (<g transform={`translate(${0},${0})`}></g>);
                // this.dragGraphicsList.forEach(i => {
                //     this.dragGroup.appendChild(i.graphics);
                // });
            }
        } else {
            this.locations = [];
            this.editor.clearMoveblockTool();
            this.x1 = e.offsetX - globalTransform.offsetX;
            this.y1 = e.offsetY - globalTransform.offsetY;
            this.isStart = false;
            this.editor.addSelector(
                e.offsetX - globalTransform.offsetX,
                e.offsetY - globalTransform.offsetY
            );
        }
    }

    mouseMove(e) {
        if (this.isStart) {
            this.x2 = e.offsetX - globalTransform.offsetX;
            this.y2 = e.offsetY - globalTransform.offsetY;
            const _x = this.x2 - this.x1 + this.minx;
            const _y = this.y2 - this.y1 + this.miny;

            if (this._moveBlock && (this._moveBlock.x !== _x || this._moveBlock.y !== _y)) {
                this._moveBlock.setLocation(_x, _y);

                this.setGraphicsLocation(this.x1, this.y1, this.x2, this.y2, ...this.dragGraphicsList);

                // this.editor.willScroll.isStart === false && this.editor.autoScroll(() => {
                //     this._moveBlock.setLocation(_x, _y);
                //     this.setGraphicsLocation(this.x1, this.y1, this.x2, this.y2, ...this.dragGraphicsList);
                // });
                // this.editor.willScroll.isStart = this.editor.willScroll.willStart;
            }
        }
    }

    mouseUp(e) {
        if (this.isStart) {
            if (this._moveBlock) this._moveBlock.isMove = false;
            this.editor.reSizeComputed();
            this.editor.autoFit();
            this.reset();
            this.locations = this.locations.map(i => {
                let _graphics = this.editor.graphicsMap.find(o => o.id === i.id);
                return { id: i.id, x: _graphics.x, y: _graphics.y }
            });
        }
    }

    areaSelect(graphics: Graphics[]) {
        this.editor.graphicsMap.forEach(i => {
            let _index = this.locations.findIndex(o => i.id === o.id);
            if (i.active && _index <= -1) {
                this.locations.push({ id: i.id, x: i.x, y: i.y });
            } else if (!i.active && _index >= 0) {
                this.locations.splice(_index, 1);
            }
        });
    }

    /** 批量设置图形坐标（传入相对坐标） */
    setGraphicsLocation(x1: number, y1: number, x2: number, y2: number, ...graphics: Graphics[]) {
        if (x2 - x1 != 0 || y2 - y1 != 0) {
            for (let i = 0; i < graphics.length; i++) {
                let _locIndex = this.locations.findIndex(o => o.id === graphics[i].id);
                _locIndex >= 0 && graphics[i].setLocation(
                    this.locations[_locIndex].x + x2 - x1, 
                    this.locations[_locIndex].y + y2 - y1
                );
                // i.setText([i.x, i.y].toString());
            }
        }
    }

    init() {
    }
    
    render() {
    }
}