import EditorModule from '@/core/eidtormodule';
import { createSVGElement, createElement } from '@/tools';
import { Graphics } from '@/graphics';
import { cloneForce } from '@/lib/clone';

/** 缩略图 */
export default class Thumbnail extends EditorModule {
    constructor(options) {
        super(options);

        this.editor.on(EditorEventType.GraphicsLocationChange, this.onGraphicsLocationChange, this);
        this.editor.on(EditorEventType.GraphicsAddNew, this.onGraphicsAddNew, this);
        this.editor.on(EditorEventType.EditorCanvasSizeChange, this.onCanvasSizeChange, this);
        this.editor.on(EditorEventType.EditorCanvasScroll, this.onCanvasScroll, this);
        this.editor.on(EditorEventType.WindowSizeChange, this.onWindowSizeChange, this);
        this.editor.on(EditorEventType.EditorInit, this.onEditorInit, this);
    }

    /** 预览横坐标 */
    x: number;
    /** 预览纵坐标 */
    y: number;
    /** 预览宽度 */
    width: number;
    /** 预览高度 */
    height: number;
    /** 缩略图主节点 */
    element: HTMLElement;
    /** 视区节点 */
    viewportEl: HTMLElement;
    /** SVG主节点 */
    svgElement!: SVGElement;
    /** 图形哈希表 */
    graphicsMap: Record<string, Graphics> = {};

    get scaleX() {
        return this.width / this.editor.svgWidth;
    }
    get scaleY() {
        return this.height / this.editor.svgHeight;
    }

    /** 图形移动 */
    onGraphicsLocationChange({ graphics, x, y }: { graphics: Graphics, x: number, y: number }) {
        this.graphicsMap[graphics.id].setLocation(x, y);
    }

    /** 新增图形 */
    onGraphicsAddNew(graphics: Graphics) {
        this.graphicsMap[graphics.id] = graphics.clone();
        this.svgElement.appendChild(this.graphicsMap[graphics.id].render({ basicNode: true }));
    }

    /** 画布大小调整 */
    onCanvasSizeChange({ width, height }: { width: number, height: number }) {
        // this.svgElement.setAttribute('viewBox', `${this.editor.canvasWidth} ${this.editor.canvasHeight} ${width - this.editor.canvasWidth * 2} ${height - this.editor.canvasHeight * 2}`);
        this.svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    /** 画布滚动 */
    onCanvasScroll() {
        this.x = this.editor.canvasElement.scrollLeft;
        this.y = this.editor.canvasElement.scrollTop;
        this.viewportEl.style.transform = `translate(${this.x * this.scaleX}px, ${this.y * this.scaleY}px)`;
    }

    /** 浏览器窗口大小改变事件 */
    onWindowSizeChange() {
        this.viewportEl.style.width = window.innerWidth * this.scaleX + 'px';
        this.viewportEl.style.height = window.innerHeight * this.scaleY + 'px';
    }

    onEditorInit() {
        this.onWindowSizeChange();
        this.onCanvasScroll();
    }
    
    init() {
        this.element = createElement('div', {
                class: 'haku-workflow-design-thumbnail', 
                parent: this.editor.element
            },
            this.svgElement = <svg className='haku-workflow-design-thumbnail-svg' viewBox={`0 0 ${this.editor.svgWidth} ${this.editor.svgHeight}`}>
                {
                    this.editor.graphicsMap.map(i => i.render())
                }
            </svg>,
            this.viewportEl = createElement('div', {
                class: 'haku-workflow-design-thumbnail-viewport', 
                attrs: {  }
            }),
        );

        setTimeout(() => {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
            this.onEditorInit();
        }, 0);
    }
}