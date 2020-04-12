import { getType, createElement, createSVGElement, recursive } from '@/tools';
import Graphics from './graphics';
import { debug } from 'webpack';
import Transform from './transform';
import Line from '@/graphics/beeline';
import LineGraphics from '../graphics/line';
import Beeline from '@/graphics/beeline';

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
    set canvasWidth(width: number) {
        this.svgElement.style.width = width + 'px';
    }

    /** 视窗高度 */
    get canvasHeight() {
        return this.canvasElement.offsetHeight;
    }
    set canvasHeight(height: number) {
        this.svgElement.style.height = height + 'px';
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

    /** 图形区域离顶部距离 */
    regionRect = {
        /** 图形区域离顶部距离 */
        top: 0,
        /** 图形区域离左侧距离 */
        left: 0,
        /** 图形区域计算宽度 */
        width: 0,
        /** 图形区域计算宽度 */
        height: 0,
    };

    /** 根据浏览器视窗高宽度自动计算画布并计算偏移量 */
    private autoFit() {
        // 重算画布宽高
        this.canvasWidth = this.regionRect.width + this.canvasWidth * 2 + 120;
        this.canvasHeight = this.regionRect.height + this.canvasHeight * 2 + 120;

        this.svgElement.style.backgroundPosition = `${this.canvasWidth % 40}px ${this.canvasHeight % 40}px`;
    }

    /** 重新计算真实图形区域宽高度 */
    reSizeComputed() {
        let _rect = this.svgGroupElement.getBBox();
        this.regionRect.width = _rect.width < this.canvasWidth ? this.canvasWidth : _rect.width;
        this.regionRect.height = _rect.height < this.canvasHeight ? this.canvasHeight : _rect.height;
        this.regionRect.left = this.canvasWidth - _rect.x;
        this.regionRect.top = this.canvasHeight - _rect.y;

        if (_rect.x < this.canvasWidth) {
            this.transform.offsetX += this.canvasWidth - _rect.x;
            this.locationLeft += this.canvasWidth - _rect.x;
        } else {
            this.transform.offsetX -= _rect.x - this.canvasWidth;
            this.locationLeft -= _rect.x - this.canvasWidth;
        }
        
        if (_rect.y < this.canvasHeight) {
            this.transform.offsetY += this.canvasHeight - _rect.y + 60;
            this.locationTop += this.canvasHeight - _rect.y + 60;
        } else {
            this.transform.offsetY -= _rect.y - this.canvasHeight - 60;
            this.locationTop -= _rect.y - this.canvasHeight - 60;
        }

    }

    /** 添加图形 */
    addGraphics(graphics: Graphics) {
        this.graphicsMap.push(graphics);
        this.svgGroupElement.appendChild(graphics.render(this.transform));
        this.reSizeComputed();
    }

    /** 添加辅助线 */
    addGuideLine(isVertical: boolean, loc: number) {
        const _line = new Beeline({
            x1: isVertical ? loc : -9999,
            y1: isVertical ? -9999 : loc,
            x2: isVertical ? loc : 9999,
            y2: isVertical ? 9999 : loc,
            stroke: 'green',
            width: 1
        });
        this.svgElement.appendChild(_line.render(this.transform));
        this.graphicsGuideMap.push(_line);
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
            this.autoFit();
            this.refresh();
        });

        this.autoFit();
        // 计算整体画布偏移量
        this.transform.offsetX = this.canvasWidth * 1.5;
        this.transform.offsetY = this.canvasHeight * 1.5;
        this.locationLeft = this.canvasWidth;
        this.locationTop = this.canvasHeight;
        this.reSizeComputed();
        this.refresh();

        setTimeout(() => {
            this.reSizeComputed();
            this.autoFit();
            this.refresh();
            console.timeEnd('editor-init');
        }, 1);
    }

    /** 版本号 */
    readonly version: '0.0.1';
}