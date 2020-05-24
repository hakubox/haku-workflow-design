import { Location, IdLocation } from "@/interface";
import Module from '@/core/module';
import { intersects, createModelId } from '@/tools';
import { globalTransform } from '@/core/transform';
import { Graphics, Rect, Line } from '@/graphics';
import GraphicsModule, { GraphicsModuleParams } from '@/core/graphicsmodule';

/**
 * 图形连接点
 */
export default class ConnectPoint extends GraphicsModule {
    constructor(options: GraphicsModuleParams) {
        super(options);
    }

    /** 是否开始拖拽连接点 */
    isStart: boolean = false;

    /** X坐标起始点 */
    x1?: number;
    /** Y坐标起始点 */
    y1?: number;
    /** X坐标结束点 */
    x2?: number;
    /** Y坐标结束点 */
    y2?: number;

    /** 是否移动状态（移动状态不显示拖拽点） */
    isMove: boolean = false;

    /** 连接点图形 */
    _connectPoints = [];

    /** 连接点图形 */
    get connectPoints(): { x: number, y: number, el: SVGElement }[] {
        return this.graphics.getData('connect-points');
    }
    set connectPoints(val: { x: number, y: number, el: SVGElement }[]) {
        this.graphics.setData('connect-points', val);
    }
    
    /** 拖拽重置 */
    reset() {
        this.isStart = false;
        this.x1 = this.x2 = this.y1 = this.y2 = 0;
    }

    init() {
        if (this.graphics instanceof Line) {
            return;
        }
        
        const getAttrs = () => ({ width: 14, height: 14, rx: 7, ry: 7, fill: "#008000", gid: createModelId(16), className: 'connect-point', style: { cursor: 'crosshair' } });
        
        this.connectPoints = [
            { x: this.graphics.getWidth() / 2, y: 0 },
            { x: this.graphics.getWidth(), y: this.graphics.getHeight() / 2 },
            { x: this.graphics.getWidth() / 2, y: this.graphics.getHeight() },
            { x: 0, y: this.graphics.getHeight() / 2 }
        ].map((i, index) => ({
            ...i,
            el: (<rect 
                {...getAttrs()} 
                onMouseDown={(e) => this.connectStart(e, index)} 
                onMouseUp={(e) => this.connectEnd(e, index)} 
                x={i.x - 7} 
                y={i.y - 7}
            ></rect>)
        }));

        this.graphics.on(EditorEventType.GraphicsActive, this.setActive, this);
        this.graphics.on(EditorEventType.GraphicsMouseDown, this.graphicsMouseDown, this);
        this.graphics.on(EditorEventType.GraphicsMouseUp, this.graphicsMouseUp, this);
    }

    connectStart(e, pointIndex) {
        if (this.editor) {
            this.editor.emit(EditorEventType.GraphicsConnectStart, {
                ...e,
                graphics: this.graphics,
                pointIndex: pointIndex,
                x: this.connectPoints[pointIndex].x + this.graphics.x,
                y: this.connectPoints[pointIndex].y + this.graphics.y,
            }, this);
        } else {
            throw new Error('连接情况下editor属性不能为空。');
        }
    }

    connectEnd(e, pointIndex) {
        if (this.editor) {
            this.editor.emit(EditorEventType.GraphicsConnectEnd, {
                ...e,
                graphics: this.graphics,
                pointIndex: pointIndex,
                x: this.connectPoints[pointIndex].x + this.graphics.x,
                y: this.connectPoints[pointIndex].y + this.graphics.y,
            }, this);
        } else {
            throw new Error('连接情况下editor属性不能为空。');
        }
    }

    /** 是否选中 */
    setActive(isActive: boolean) {
        if (!isActive) {
        }
    }

    graphicsMouseDown() {
        this.isMove = true;

        if (this.graphics.active) {
            
        } else {

        }
    }

    graphicsMouseUp() {
        this.isMove = false;
    }
    
    render(el: SVGElement) {
        this.connectPoints = this.connectPoints.map(i => {
            el.appendChild(i.el);
            return i;
        });
        return el;
    }
}