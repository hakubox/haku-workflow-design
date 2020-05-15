import EditorModule, { EditorModuleParams } from '@/core/eidtormodule';
import { Line, BeeLine, Graphics } from '@/graphics';
import GuideLine from '@/graphics/guideline';
import { globalTransform } from '@/core/transform';

/** 连接项 */
export class ConnectModel {
    /** 开始图形Id */
    startGraphicsId: string;
    /** 开始图形的拖拽点索引 */
    startGraphicsPointIndex: number;
    /** 结束图形Id */
    endGraphicsId: string;
    /** 结束图形的拖拽点索引 */
    endGraphicsPointIndex: number;
    /** 连接线 */
    connectLine: Line;
    /** 线配置 */
    config: Record<string, any> = {};
}

/**
 * 连接线
 */
export default class ConnectLine extends EditorModule {
    constructor(options: EditorModuleParams) {
        super(options);

        this.editor.setData(GraphicsData.connectLines, []);

        this.editor.on(EditorEventType.GraphicsConnectStart, this.connectStart, this);
        this.editor.on(EditorEventType.EditorMouseMove, this.connecting, this);
        this.editor.on(EditorEventType.EditorMouseUp, this.connectEnd, this);

        this.editor.on(EditorEventType.GraphicsConnectEnd, this.connectGraphicsEnd, this);

        this.editor.on(EditorEventType.GraphicsLocationChange, this.graphicsMove, this);
    }

    /** 是否开始连接 */
    isStart: boolean = false;
    /** 初始X坐标 */
    x1: number = 0;
    /** 初始Y坐标 */
    y1: number = 0;

    /** 连接列表 */
    connectLines(): ConnectModel[];
    connectLines(model: ConnectModel[]): void;

    connectLines(val?: ConnectModel[]) {
        if (!val) {
            return this.editor.getData(GraphicsData.connectLines);
        } else {
            this.editor.setData(GraphicsData.connectLines, val);
        }
    }

    /** 图形移动 */
    graphicsMove({ x, y, graphics }) {
        const _startLines = this.connectLines().filter(o => o.startGraphicsId === graphics.id);
        _startLines.forEach(line => {
            const _startGraphics = this.editor.getGraphics(line.startGraphicsId);
            if (_startGraphics) {
                const _points = (_startGraphics.getData('connect-points') as { x: number, y: number, el: SVGElement }[])[line.startGraphicsPointIndex];
                line.connectLine.setPoints({ x: x + _points.x, y: y + _points.y }, undefined);
            }
        });

        const _endLines = this.connectLines().filter(o => o.endGraphicsId === graphics.id);
        _endLines.forEach(line => {
            const _endGraphics = this.editor.getGraphics(line.endGraphicsId);
            if (_endGraphics) {
                const _points = (_endGraphics.getData('connect-points') as { x: number, y: number, el: SVGElement }[])[line.endGraphicsPointIndex];
                line.connectLine.setPoints(undefined, { x: x + _points.x, y: y + _points.y });
            }
        });
    }

    /** 开始图形 */
    startGraphics: Graphics;
    /** 开始图形的拖拽点索引 */
    startGraphicsPointIndex: number;

    /** 当前连接线 */
    currentConnectLine: Line;

    /** 开始连接 */
    private connectStart({x, y, graphics, pointIndex}) {
        this.isStart = true;

        this.x1 = x;
        this.y1 = y;

        this.startGraphics = graphics;
        this.startGraphicsPointIndex = pointIndex;
        this.currentConnectLine = new BeeLine({
            x: this.x1,
            y: this.y1,
            x2: this.x1,
            y2: this.y1,
            stroke: 'red',
            notModule: true,
            endArrow: true
        });
        this.editor.insertGraphics(0, this.currentConnectLine);
    }

    /** 连接中 */
    private connecting(e) {
        if (this.isStart) {
            this.currentConnectLine.setPoints(undefined, {
                x: e.offsetX - globalTransform.offsetX + 2,
                y: e.offsetY - globalTransform.offsetY + 2
            });
        }
    }

    /** 结束连接（未连接图形） */
    private connectEnd({ x, y }) {
        this.isStart = false;
    }

    /** 结束连接（连接图形） */
    private connectGraphicsEnd({ graphics, pointIndex, x, y }) {
        this.connectLines(this.connectLines().concat([{
            connectLine: this.currentConnectLine,
            startGraphicsId: this.startGraphics.id,
            startGraphicsPointIndex: this.startGraphicsPointIndex,
            endGraphicsId: graphics.id,
            endGraphicsPointIndex: pointIndex,
            config: {}
        }] as ConnectModel[]));

        this.graphicsMove({ x: graphics.x, y: graphics.y, graphics });
    }

    connectGraphics(graphicsA: Graphics, graphicsB: Graphics) {
    }

    init() {
    }

    connectLine() {
    }
    
    render() {
    }
}