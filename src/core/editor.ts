import { getType, createElement, createSVGElement, recursive, intersects, setStandardCoordinate, createModelId } from '@/tools';
import Graphics from '../graphics/graphics';
import Transform, { globalTransform } from './transform';
import Beeline from '@/graphics/beeline';
import { Selector, MoveBlock } from '@/graphics';
import { DragConfig, SelectorConfig, WillScroll } from '@/interface';
import GuideLine from '@/graphics/guideline';
import TextEdit from './textedit';
import { Haku } from './global';
import { ModuleClass } from './module';
import EditorModule from './eidtormodule';
import { cloneForce } from '@/lib/clone';
import AttachData from './attachdata';
import { Drag } from '@/modules';

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
export default class Editor extends AttachData {
    constructor(config: EditorParams = {}) {
        super();

        this.id = createModelId(26);
        
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

        let _graphicsEl: HTMLElement = null;
        let _footerEl: HTMLElement = null;

        // 初始化编辑器界面
        this.element.classList.add('haku-workflow-design');

        // 绘制头部区域
        createElement('div', { parent: this.element, class: 'haku-workflow-design-header' });
        // 绘制主体区域
        createElement('div', { parent: this.element, class: 'haku-workflow-design-body' },
            // 绘制左侧图形区域
            _graphicsEl = createElement('div', { class: 'haku-workflow-design-graphics' }),
            // 绘制主画布区域
            this.canvasElement = createElement('div', 
                { class: 'haku-workflow-design-canvas' },
                // 绘制svg区域
                this.svgElement = createSVGElement('svg', 
                    { class: '' },
                    // 绘制统一操作的g标签
                    this.svgGroupElement = createSVGElement('g', { class: '',  attrs: { id: 'graphics-main-svg' } }) as SVGGElement
                ) as SVGSVGElement,
            ),
            // 绘制属性栏区域
            this.propertysElement = createElement('div', { class: 'haku-workflow-design-propertys' }),
            // 绘制底部区域
            _footerEl = createElement('div', { class: 'haku-workflow-design-footer' })
        );

        this.defaultPageWidth = this.canvasWidth;
        this.defaultPageHeight = this.canvasHeight;

        if (config.onInit) {
            config.onInit.call(this, this.init.bind(this));
        } else {
            this.init();
        }
    }

    /** 编辑器随机Id */
    id: string;

    // 图形模块
    modules: {
        module: EditorModule;
        options: Record<string, any>;
    }[] = [];

    /** 是否已完成初始化 */
    isInit: boolean = false;

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
    graphicsGuideMap: Graphics[] = [];
    /**
     * 文本编辑
     */
    textEdit: TextEdit;

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

    /** 所有选中元素 */
    get selectedGraphics() {
        return this.graphicsMap.filter(i => i.active);
    }
    set selectedGraphics(val: Graphics[]) {
        this.graphicsMap = val;

        const _ids = val.map(i => i.id);
        this.graphicsMap.forEach(i => {
            console.error('触发A');
            i.active = _ids.includes(i.id);
        });
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

    /** 框选配置项 */
    selectorConfig: SelectorConfig = {
        isStart: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        reset(this: SelectorConfig) {
            this.isStart = false;
            this.x1 = this.y1 = this.x2 = this.y2 = 0;
        }
    };

    /** 事件绑定 */
    on(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        Haku.on(ModuleLevel.Editor, this.id, eventType, event, bindThis);
    }
    /** 单次事件绑定 */
    once(eventType: EditorEventType, event: (source?) => void, bindThis?: any) {
        Haku.once(ModuleLevel.Editor, this.id, eventType, event, bindThis);
    }
    /** 事件绑定 */
    emit(params: any = {}, ...otherParams: any[]) {
        Haku.emit(ModuleLevel.Editor, this.id, params, ...otherParams);
    }

    /** 根据Id获取图形 */
    getGraphics(id: string): Graphics | null {
        return this.graphicsMap.find(i => i.id === id);
    }

    /** 根据浏览器视窗高宽度自动计算画布宽高度 */
    autoFit() {
        // 重算画布宽高
        this.svgWidth = this.regionRect.width + this.canvasWidth * 2 + 120;
        this.svgHeight = this.regionRect.height + this.canvasHeight * 2 + 120;

        this.emit(EditorEventType.EditorCanvasSizeChange, { width: this.svgWidth, height: this.svgHeight });
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

    /** 卷轴滚动标记 */
    willScroll: WillScroll = {
        isStart: false, speed: 0, offsetX: 0, offsetY: 0, speedRate: 0.05,
        topRoll: false, topStep: 0, leftRoll: false, leftStep: 0,  bottomRoll: false,  bottomStep: 0, rightRoll: false, rightStep: 0,
        get willStart() {
            return this.topRoll || this.rightRoll || this.bottomRoll || this.leftRoll;
        },
        reset(this: WillScroll) {
            this.topRoll = this.rightRoll = this.bottomRoll = this.leftRoll = false;
            this.offsetX = this.offsetY = this.topStep = this.rightStep = this.bottomStep = this.leftStep = 0;
        }
    }

    /** 加载模块 */
    module(module: ModuleClass, options?: Record<string, any>) {
        Haku.module(module, { ...options, editor: this });

        if (module.__proto__.name === 'EditorModule') {
            if (!options) options = {};
            if (!options.editor) options.editor = this;
            // @ts-ignore
            this.modules.push({ module: new (module)(options).moduleInit(this), options: cloneForce(options) });
        }
    }

    /** 重新计算真实图形区域宽高度 */
    reSizeComputed() {
        let _rect = this.svgGroupElement.getBBox();
        this.regionRect.width = _rect.width < this.canvasWidth ? this.canvasWidth : _rect.width;
        this.regionRect.height = _rect.height < this.canvasHeight ? this.canvasHeight : _rect.height;
        this.regionRect.left = this.canvasWidth - _rect.x;
        this.regionRect.top = this.canvasHeight - _rect.y;

        // if (_rect.x < this.canvasWidth - 100) {
        //     globalTransform.offsetX += 400;
        //     this.locationLeft += 400;
        // } else if (_rect.x + 60 > this.svgWidth + 100) {
        //     globalTransform.offsetX -= 400;
        //     this.locationLeft -= 400;
        // }
        // if (_rect.x + _rect.width > this.svgWidth - this.canvasWidth + 100) {
        //     globalTransform.offsetX -= 400;
        //     this.locationLeft -= 400;
        // } else if (_rect.x + this.regionRect.width + 60 < this.svgWidth - this.canvasWidth - 100) {
        //     globalTransform.offsetX += 400;
        //     this.locationLeft += 400;
        // }

        // if (_rect.y < this.canvasHeight - 100) {
        //     globalTransform.offsetY += 400;
        //     this.locationTop += 400;
        // } else if (_rect.y > this.canvasHeight * 2 + 100) {
        //     globalTransform.offsetY -= 400;
        //     this.locationTop -= 400;
        // }
        // if (_rect.y + _rect.height > this.svgHeight - this.canvasHeight + 100) {
        //     globalTransform.offsetY -= 400;
        //     this.locationTop -= 400;
        // } else if (_rect.y + this.regionRect.height + 60 < this.svgHeight - this.canvasHeight - 100) {
        //     globalTransform.offsetY += 400;
        //     this.locationTop += 400;
        // }
    }

    setEditor(uid: string) {
        const _graphics = this.graphicsMap.find(i => i.id  === uid);
        _graphics.isEdit = true;
        // _graphics.textGraphics.isShow = false;
        //this.textEdit.startEdit(_graphics.getText(), _graphics.textCoordinate.x, _graphics.textCoordinate.y, _graphics.getWidth());
    }

    /** 添加图形 */
    addGraphics(...graphics: Graphics[]) {
        for (let i = 0; i < graphics.length; i++) {
            this.graphicsMap.push(graphics[i]);
            this.svgGroupElement.appendChild(graphics[i].render());
            graphics[i].on(EditorEventType.GraphicsLocationChange, (...args) => {
                this.emit(EditorEventType.GraphicsLocationChange, ...args);
            });
            // if (this.isInit) {
                this.reSizeComputed();
                this.autoAdjustBackground();
                
                this.emit(EditorEventType.GraphicsAddNew, graphics[i]);
            // }
        }
    }

    /** 往指定位置插入添加图形 */
    insertGraphics(index: number, ...graphics: Graphics[]) {
        for (let i = 0; i < graphics.length; i++) {
            this.graphicsMap.splice(index, 0, graphics[i]);
            this.svgGroupElement.insertBefore(graphics[i].render(), this.svgGroupElement.childNodes[index]);
            graphics[i].on(EditorEventType.GraphicsLocationChange, (...args) => {
                this.emit(EditorEventType.GraphicsLocationChange, ...args);
            });
            this.reSizeComputed();
            this.autoAdjustBackground();
        }
    }

    /** 添加参考线 */
    addGuideLine(direction: Direction, loc: number) {
        const _line = new GuideLine({
            stroke: 'green',
            location: loc,
            direction: direction,
            notModule: true
        });
        this.svgElement.appendChild(_line.render());
        this.graphicsGuideMap.push(_line);
    }

    /** 开始拖拽 */
    startMulSelect() {
        
    }

    /** 清空框选工具 */
    clearSelectorTool() {
        this.graphicsGuideMap.forEach(i => i.type === GraphicsType.selector && i.destroy());
        this.graphicsGuideMap = this.graphicsGuideMap.filter(i => i.type !== GraphicsType.selector);
    }

    /** 清空移动调节工具 */
    clearMoveblockTool() {
        this.graphicsGuideMap.forEach(i => i.type === GraphicsType.moveblock && i.destroy());
        this.graphicsGuideMap = this.graphicsGuideMap.filter(i => i.type !== GraphicsType.moveblock);
    }

    /** 设置辅助操作工具 */
    setMoveblock(isMove: boolean, ...graphicsTarget: Graphics[]) {
        if (!graphicsTarget.length) return;
        this.clearMoveblockTool();
        let _x1: number = Number.MAX_VALUE;
        let _y1: number = Number.MAX_VALUE;
        let _x2: number = -Number.MAX_VALUE;
        let _y2: number = -Number.MAX_VALUE;

        graphicsTarget.forEach(i => {
            _x1 = i.x < _x1 ? i.x : _x1;
            _y1 = i.y < _y1 ? i.y : _y1;
            _x2 = i.x + i.getWidth() > _x2 ? i.x + i.getWidth() : _x2;
            _y2 = i.y + i.getHeight() > _y2 ? i.y + i.getHeight() : _y2;
        });

        const _moveblock = new MoveBlock({
            x: _x1,
            y: _y1,
            width: _x2 - _x1,
            height: _y2 - _y1,
            notModule: true
        });
        _moveblock.isMove = isMove;
        this.svgElement.appendChild(_moveblock.render());
        this.graphicsGuideMap.push(_moveblock);
    }

    /** 获取选择器 */
    getSelector() {
        return this.graphicsGuideMap.find(i => i.type === GraphicsType.selector) as Selector;
    }

    /** 获取图形编辑器 */
    getMoveBlock() {
        return this.graphicsGuideMap.find(i => i.type === GraphicsType.moveblock) as MoveBlock;
    }

    /** 新增框选区域 */
    addSelector(x: number, y: number) {
        const _selector = new Selector({
            x, y, width: 0, height: 0, notModule: true
        });
        this.svgElement.appendChild(_selector.render());
        this.graphicsGuideMap.push(_selector);
    }

    /** 清空所有选中图形 */
    clearAllSelect() {
        this.graphicsMap.forEach(i => i.active = false);
    }

    /** 重绘所有子节点 */
    refresh() {
        this.graphicsMap.forEach(item => {
            item.graphics = item.render();
        });
        this.graphicsGuideMap.forEach(item => {
            item.graphics = item.render();
        });
    }

    /** 重绘所有子节点 */
    refreshLocation() {
        this.graphicsMap.forEach(item => {
            item.refreshLocation();
        });
        this.graphicsGuideMap.forEach(item => {
            item.type !== GraphicsType.guideline && item.refreshLocation();
        });
    }

    toString() {
        console.log(this.graphicsMap);
    }

    // 到达边缘时自动卷动滚动条
    autoScroll(cb) {
        const _timer = setTimeout(() => {
            const _edgeRight = this.locationLeft + this.canvasWidth - 100;
            const _edgeBottom = this.locationTop + this.canvasHeight - 100;
            const _edgeLeft = this.locationLeft + 100;
            const _edgeTop = this.locationTop + 100;
            let _x = 0;
            let _y = 0;

            if (this.willScroll.offsetX > _edgeRight) {
                _x += Math.ceil(this.willScroll.rightStep * this.willScroll.speedRate);
            } else if (this.willScroll.offsetX < _edgeLeft) {
                _x += Math.floor(this.willScroll.leftStep * this.willScroll.speedRate);
            }
            if (this.willScroll.offsetY > _edgeBottom) {
                _y += Math.ceil(this.willScroll.bottomStep * this.willScroll.speedRate);
            } else if (this.willScroll.offsetY < _edgeTop) {
                _y += Math.floor(this.willScroll.topStep * this.willScroll.speedRate);
            }

            this.willScroll.offsetX += _x;
            this.locationLeft += _x;
            this.willScroll.offsetY += _y;
            this.locationTop += _y;
            cb();
            
            if (this.willScroll.willStart) {
                this.autoScroll(cb);
            } else {
                clearTimeout(_timer);
            }
        }, 16);
    }

    /** 范围选择 */
    areaSelect(width: number, height: number) {
        const _selector = this.getSelector();
        if (!_selector) return;

        _selector?.setArea(width, height);

        let _x = width < 0 ? _selector.x + width : _selector.x;
        let _y = height < 0 ? _selector.y + height : _selector.y;

        this.graphicsMap.forEach(i => {
            let isIntersects = intersects(
                { x: _x, y: _y, width: Math.abs(width), height: Math.abs(height) }, 
                { x: i.x, y: i.y, width: i.getWidth(), height: i.getHeight() }
            );
            i.active = isIntersects;
        });
        this.emit(EditorEventType.EditorAreaSelect, this.graphicsMap.filter(i => i.active));
    }

    /** 初始化函数 */
    private init() {
        
        window.addEventListener('resize', e => {
            this.reSizeComputed();
            this.autoAdjustBackgroundByResize();
            this.autoFit();
            this.refreshLocation();
        });

        this.canvasElement.addEventListener('scroll', e => {
            this.emit(EditorEventType.EditorCanvasScroll, { 
                ...e, 
                x: this.canvasElement.scrollLeft, 
                y: this.canvasElement.scrollTop
            });
        });

        this.svgElement.addEventListener('dblclick', e => {
            let _gid = (e.target as Element).getAttribute('gid');
            if (_gid) {
                this.setEditor(_gid);
            }
        });

        this.svgElement.addEventListener('mousedown', e => {
            this.emit(EditorEventType.EditorMouseDown, e);

            let _gid = (e.target as Element).getAttribute('gid');
            this.clearSelectorTool();

            if (!_gid) {
                this.selectorConfig.isStart = true;
                this.clearAllSelect();
                this.selectorConfig.x1 = e.offsetX - globalTransform.offsetX;
                this.selectorConfig.y1 = e.offsetY - globalTransform.offsetY;
                this.addSelector(
                    e.offsetX - globalTransform.offsetX,
                    e.offsetY - globalTransform.offsetY
                );
            }
        });

        this.canvasElement.addEventListener('mouseleave', e => {
            // this.willScroll.reset();
        });

        window.addEventListener('resize', e => {
            this.emit(EditorEventType.WindowSizeChange, e);
        });

        this.svgElement.addEventListener('mousemove', e => {
            this.emit(EditorEventType.EditorMouseMove, e);

            const _edgeRight = this.locationLeft + this.canvasWidth - 50;
            const _edgeBottom = this.locationTop + this.canvasHeight - 50;
            const _edgeLeft = this.locationLeft + 50;
            const _edgeTop = this.locationTop + 50;
            
            // 记录卷动位置及速率
            this.willScroll.offsetX = e.offsetX;
            this.willScroll.offsetY = e.offsetY;
            this.willScroll.rightRoll = this.willScroll.offsetX > _edgeRight;
            this.willScroll.bottomRoll = this.willScroll.offsetY > _edgeBottom;
            this.willScroll.leftRoll = this.willScroll.offsetX < _edgeLeft;
            this.willScroll.topRoll = this.willScroll.offsetY < _edgeTop;
            this.willScroll.topStep = this.willScroll.topRoll ? Math.ceil((this.willScroll.offsetY - _edgeTop) || 0) : 0;
            this.willScroll.leftStep = this.willScroll.leftRoll ? Math.ceil((this.willScroll.offsetX - _edgeLeft) || 0) : 0;
            this.willScroll.bottomStep = this.willScroll.bottomRoll ? Math.ceil((this.willScroll.offsetY - _edgeBottom) || 0) : 0;
            this.willScroll.rightStep = this.willScroll.rightRoll ? Math.ceil((this.willScroll.offsetX - _edgeRight) || 0) : 0;

            if (this.selectorConfig.isStart) {
                
                // 单例执行
                if (this.willScroll.isStart === false) {
                    this.autoScroll(() => {
                        this.areaSelect(
                            this.willScroll.offsetX - globalTransform.offsetX - this.selectorConfig.x1,
                            this.willScroll.offsetY - globalTransform.offsetY - this.selectorConfig.y1
                        );
                    });
                }
                this.willScroll.isStart = this.willScroll.willStart;

                this.areaSelect(
                    this.willScroll.offsetX - globalTransform.offsetX - this.selectorConfig.x1,
                    this.willScroll.offsetY - globalTransform.offsetY - this.selectorConfig.y1
                );
            }
        });

        document.body.addEventListener('mouseup', e => {
            this.emit(EditorEventType.EditorMouseUp, e);

            this.clearSelectorTool();

            if (this.selectorConfig.isStart) {
                this.setMoveblock(false, ...this.graphicsMap.filter(i => i.active));
                this.selectorConfig.reset();
            }
            
            this.willScroll.reset();
        });

        this.autoFit();
        this.reSizeComputed();

        // 绑定模块
        this.modules = [...Haku.modules.map(i => {
            if (i.module.__proto__.name === 'EditorModule') {
                // @ts-ignore
                return { module: new (i.module)(i.options).initGraphics(this), options: cloneForce(i.options) };
            }
        })].filter(i => i);

        queueMicrotask(() => {
            // 计算整体画布偏移量
            globalTransform.offsetX = this.canvasWidth + this.regionRect.width * 0.5;
            globalTransform.offsetY = this.canvasHeight + this.regionRect.height * 0.5;
            this.locationLeft = this.canvasWidth * 0.5 + this.regionRect.width * 0.5;
            this.locationTop = this.canvasHeight * 0.5 + this.regionRect.height * 0.5;
            this.autoFit();
            this.isInit = true;
            this.refresh();
            this.autoAdjustBackground();
            console.timeEnd('editor-init');

            this.emit(EditorEventType.EditorInit);
            
            // 标签编辑器
            this.textEdit = new TextEdit({
                parent: this.canvasElement
            });
        });
    }

    /** 版本号 */
    readonly version: '0.0.1';
}