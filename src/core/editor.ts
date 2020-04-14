import { getType, createElement, createSVGElement, recursive } from '@/tools';
import Graphics from './graphics';
import { debug } from 'webpack';
import Transform from './transform';
import Line from '@/graphics/beeline';
import LineGraphics from '../graphics/line';
import Beeline from '@/graphics/beeline';
import { MoveBlock, MoveBlockParmas } from '../graphics/moveblock';

/** 拖拽配置 */
interface DragConfig {
    /** 是否开始拖拽 */
    isDrag: boolean;
    /** 拖拽对象 */
    graphics: Graphics[];
    /** 拖拽点横坐标 */
    x1: number;
    /** 拖拽点纵坐标 */
    y1: number;
    /** 终止点横坐标 */
    x2: number;
    /** 终止点纵坐标 */
    y2: number;
}

class EditorParams {
    /** 绑定DOM节点 */
    el?: string | HTMLElement;
    /** 父级DOM节点（未配置el参数时使用） */
    parent?: HTMLElement;

    /** 是否全屏 */
    isFullScreen?: boolean;

    /** 初始化函数 */
    onInit?(this: Editor, callback: () => void): void;
}

/**
 * 流程编辑器
 */
export default class Editor {
    constructor(config: EditorParams = {}) {

        this.transform = new Transform();

        if (!config.el) {
            config.parent = document.body;
            const _el = document.createElement('div');
            config.parent.appendChild(_el);
            this.element = _el;
        } else {
            if (getType(config.el) === 'HTMLElement') {
                this.element = config.el as HTMLElement;
            } else if (getType(config.el) === 'String') {
                const _el = document.querySelector(config.el as string);
                if (getType(_el) === 'HTMLElement') {
                    this.element = _el as HTMLElement;
                } else {
                    throw new TypeError('节点类型错误，请关联svg节点。');
                }
            } else {
                throw new Error('关联节点不能为空。');
            }
        }

        if (!this.element) {
            throw new Error('关联节点不能为空。');
        }

        if (!this.parentElement) {
            this.parentElement = this.element.parentElement;
        }


        // 初始化编辑器界面
        this.element.classList.add('haku-workflow-design');

        // 绘制头部区域
        const _headEl = createElement('div', { parent: this.element, class: 'haku-workflow-design-header' });
        // 绘制主体区域
        const _bodyEl = createElement('div', { parent: this.element, class: 'haku-workflow-design-body' });
        // 绘制底部区域
        const _footerEl = createElement('div', { parent: this.element, class: 'haku-workflow-design-footer' });

        // 绘制左侧图形区域
        const _graphicsEl = createElement('div', { parent: _bodyEl, class: 'haku-workflow-design-graphics' });
        // 绘制主画布区域
        this.canvasElement = createElement('div', { parent: _bodyEl, class: 'haku-workflow-design-canvas' });
        // 绘制属性栏区域
        this.propertysElement = createElement('div', { parent: _bodyEl, class: 'haku-workflow-design-propertys' });

        // 绘制svg区域
        this.svgElement = createSVGElement('svg', { parent: this.canvasElement, class: '' }) as SVGSVGElement;
        // 绘制统一操作的g标签
        this.svgGroupElement = createSVGElement('g', { parent: this.svgElement, class: '' }) as SVGGElement;

        this.defaultPageWidth = this.canvasWidth;
        this.defaultPageHeight = this.canvasHeight;

        config.onInit ? config.onInit.call(this, this.init.bind(this)) : this.init();
    }

    /** 流程设计器主DOM节点 */
    readonly element: HTMLElement;
    /** 流程设计器父级DOM节点 */
    readonly parentElement: HTMLElement;
    /** 画布DOM节点（包含svg节点） */
    readonly canvasElement: HTMLElement;
    /** SVG节点 */
    readonly svgElement: SVGSVGElement;
    /** SVG的主要组节点 */
    readonly svgGroupElement: SVGGElement;
    /** 属性栏DOM节点 */
    readonly propertysElement: HTMLElement;
    /**
     * 初始画布宽度
     * @readonly
     */
    readonly defaultPageWidth: number;
    /**
     * 初始画布高度
     * @readonly
     */
    readonly defaultPageHeight: number;
    /**
     * 画布上的图形列表
     */
    graphicsMap: Graphics[] = [];
    /**
     * 画布上的辅助图形列表
     */
    graphicsGuideMap: LineGraphics[] = [];
    /** 坐标转换 */
    transform: Transform;

    /** 横向页数量 */
    get pageXCount() {
        return 1;
    }

    /** 纵向页数量 */
    get pageYCount() {
        return 1;
    }

    /** 视窗宽度 */
    get canvasWidth() {
        return this.canvasElement.offsetWidth;
    }
    /** 视窗高度 */
    get canvasHeight() {
        return this.canvasElement.offsetHeight;
    }

    get svgWidth() {
        return this.svgElement.clientWidth;
    }
    set svgWidth(val: number) {
        this.svgElement.setAttribute('width', '' + val);
    }
    get svgHeight() {
        return this.svgElement.clientHeight;
    }
    set svgHeight(val: number) {
        this.svgElement.setAttribute('height', '' + val);
    }

    /** 纵向滚动条位置 */
    get locationTop() {
        return this.canvasElement.scrollTop;
    }
    set locationTop(top: number) {
        this.canvasElement.scrollTop = top;
    }

    /** 横向滚动条位置 */
    get locationLeft() {
        return this.canvasElement.scrollLeft;
    }
    set locationLeft(left: number) {
        this.canvasElement.scrollLeft = left;
    }

    /** 图形区域 */
    regionRect = {
        /** 图形区域离顶部距离 */
        top: 0,
        /** 图形区域离左侧距离 */
        left: 0,
        /** 滚动条横坐标 */
        locX: 0,
        /** 滚动条纵坐标 */
        locY: 0,
        /** 图形区域计算宽度 */
        width: 0,
        /** 图形区域计算宽度 */
        height: 0,
    };

    /** 拖拽配置项 */
    dragConfig: DragConfig = {
        isDrag: false,
        graphics: [],
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    /** 根据浏览器视窗高宽度自动计算画布宽高度 */
    private autoFit() {
        // 重算画布宽高
        this.svgWidth = this.regionRect.width + this.canvasWidth * 2 + 120;
        this.svgHeight = this.regionRect.height + this.canvasHeight * 2 + 120;
    }

    /** 根据视窗重绘背景网格图 */
    private autoAdjustBackground() {
        let _locX = (this.svgWidth) % 40;
        let _locY = (this.svgHeight) % 40;
        this.svgElement.style.backgroundPosition = `${_locX}px ${_locY}px`;
    }

    private autoAdjustBackgroundByResize() {
        let _locX = (this.canvasWidth) % 40;
        let _locY = (this.canvasHeight) % 40;
        this.svgElement.style.backgroundPosition = `${_locX}px ${_locY}px`;
    }

    /** 重新计算真实图形区域宽高度 */
    reSizeComputed() {
        let _rect = this.svgGroupElement.getBBox();
        this.regionRect.width = _rect.width < this.canvasWidth ? this.canvasWidth : _rect.width;
        this.regionRect.height = _rect.height < this.canvasHeight ? this.canvasHeight : _rect.height;
        this.regionRect.left = this.canvasWidth - _rect.x;
        this.regionRect.top = this.canvasHeight - _rect.y;

        if (_rect.x < this.canvasWidth - 100) {
            this.transform.offsetX += 400;
            this.locationLeft += 400;
        } else if (_rect.x + 60 > this.svgWidth + 100) {
            this.transform.offsetX -= 400;
            this.locationLeft -= 400;
        }
        if (_rect.x + _rect.width > this.svgWidth - this.canvasWidth + 100) {
            this.transform.offsetX -= 400;
            this.locationLeft -= 400;
        } else if (_rect.x + this.regionRect.width + 60 < this.svgWidth - this.canvasWidth - 100) {
            this.transform.offsetX += 400;
            this.locationLeft += 400;
        }

        if (_rect.y < this.canvasHeight - 100) {
            this.transform.offsetY += 400;
            this.locationTop += 400;
        } else if (_rect.y > this.canvasHeight * 2 + 100) {
            this.transform.offsetY -= 400;
            this.locationTop -= 400;
        }
        if (_rect.y + _rect.height > this.svgHeight - this.canvasHeight + 100) {
            this.transform.offsetY -= 400;
            this.locationTop -= 400;
        } else if (_rect.y + this.regionRect.height + 60 < this.svgHeight - this.canvasHeight - 100) {
            this.transform.offsetY += 400;
            this.locationTop += 400;
        }
        
    }

    /** 添加图形 */
    addGraphics(...graphics: Graphics[]) {
        for (let i = 0; i < graphics.length; i++) {
            this.graphicsMap.push(graphics[i]);
            this.svgGroupElement.appendChild(graphics[i].render(this.transform));
        }
        this.reSizeComputed();
        this.autoAdjustBackground();
    }

    /** 添加辅助线 */
    addGuideLine(isVertical: boolean, loc: number) {
        const _line = new Beeline({
            x: isVertical ? loc : -9999,
            y: isVertical ? -9999 : loc,
            x2: isVertical ? loc : 9999,
            y2: isVertical ? 9999 : loc,
            stroke: 'green',
            width: 1
        });
        this.svgElement.appendChild(_line.render(this.transform));
        this.graphicsGuideMap.push(_line);
    }

    /** 开始拖拽 */
    startMulSelect() {
        
    }

    /** 清空辅助操作工具 */
    clearGuideTool() {
        this.graphicsGuideMap.forEach(i => {
            i.type === 'move-block' && i.destroy();
        });
        this.graphicsGuideMap = this.graphicsGuideMap.filter(i => i.type !== GraphicsType.moveblock);
    }

    /** 添加辅助操作工具 */
    addGuideTool(graphicsTarget: Graphics) {
        const _tool = new MoveBlock({
            graphicsTarget,
            x: graphicsTarget.x,
            y: graphicsTarget.y
        });
        this.svgElement.appendChild(_tool.render(this.transform));
        this.graphicsGuideMap.push(_tool);
    }

    /** 重绘所有子节点 */
    refresh() {
        this.graphicsMap.forEach(item => {
            item.graphics = item.render(this.transform);
        });
        this.graphicsGuideMap.forEach(item => {
            item.graphics = item.render(this.transform);
        });
    }

    toString() {
        console.log(this.graphicsMap);
    }

    /** 初始化函数 */
    private init() {
        
        window.addEventListener('resize', e => {
            this.reSizeComputed();
            this.autoAdjustBackgroundByResize();
            this.autoFit();
            this.refresh();
        });

        this.canvasElement.addEventListener('scroll', e => {
            if (!this.dragConfig.isDrag) {
            }
        });

        this.svgElement.addEventListener('mousedown', e => {
            let _gid = (e.target as Element).getAttribute('gid');
            this.clearGuideTool();

            if (_gid) {
                this.dragConfig.graphics = this.graphicsMap.filter(i => i.id === _gid);
                /** 之后需要调整为获取最左上角的组件，并获取整体宽高 */
                let _topGraphics = this.dragConfig.graphics[0];
                this.dragConfig.isDrag = true;
                this.dragConfig.x1 = e.offsetX - this.transform.offsetX - _topGraphics.x;
                this.dragConfig.y1 = e.offsetY - this.transform.offsetY - _topGraphics.y;

                this.addGuideTool(_topGraphics);
            }
        });

        this.svgElement.addEventListener('mousemove', e => {
            if (this.dragConfig.isDrag) {
                this.dragConfig.graphics.forEach(i => {
                    this.graphicsGuideMap.filter(i => i.type === GraphicsType.moveblock).forEach(i => i.setLocation(
                        e.offsetX - this.transform.offsetX - this.dragConfig.x1, 
                        e.offsetY - this.transform.offsetY - this.dragConfig.y1, 
                        this.transform
                    ));
                });
            }
        });

        document.body.addEventListener('mouseup', e => {
            this.dragConfig.isDrag = false;

            if (this.dragConfig.x1 && this.dragConfig.y1) {
                this.reSizeComputed();
                this.autoFit();
                this.refresh();
            }

            this.dragConfig.x2 = e.offsetX;
            this.dragConfig.y2 = e.offsetY;

            this.dragConfig.graphics = [];
            this.dragConfig.x1 = 0;
            this.dragConfig.y1 = 0;
            this.dragConfig.x2 = 0;
            this.dragConfig.y2 = 0;
        });

        this.autoFit();
        this.reSizeComputed();

        setTimeout(() => {
            // 计算整体画布偏移量
            this.transform.offsetX = this.canvasWidth + this.regionRect.width * 0.5;
            this.transform.offsetY = this.canvasHeight + this.regionRect.height * 0.5;
            this.locationLeft = this.canvasWidth * 0.5 + this.regionRect.width * 0.5;
            this.locationTop = this.canvasHeight * 0.5 + this.regionRect.height * 0.5;
            this.autoFit();
            this.refresh();
            this.autoAdjustBackground();
            console.timeEnd('editor-init');
        }, 1);
    }

    /** 版本号 */
    readonly version: '0.0.1';
}