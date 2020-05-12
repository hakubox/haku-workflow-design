import { Editor } from '.';
import { Graphics } from '@/graphics';
import Module, { ModuleParams } from './module';

export interface GraphicsModuleParams extends ModuleParams {
    graphics: Graphics;
}

/** 图形模块 */
export default abstract class GraphicsModule extends Module {
    constructor(options: GraphicsModuleParams) {
        super(options);
        
        this.graphics = options.graphics;
    }

    moduleType = ModuleLevel.Graphics;

    /** 图形 */
    protected _graphics: Graphics;

    /** 编辑器（可空） */
    protected _editor: Editor;

    get graphics() {
        return this._graphics;
    }
    set graphics(val) {
        this._graphics = val;
    }

    get editor() {
        return this._editor;
    }
    set editor(val) {
        this._editor = val;
    }

    /** 图形重绘钩子 */
    abstract render(svg: SVGElement): SVGElement | void | undefined;

    /** 初始化图形模块 */
    moduleInit(graphics: Graphics, editor?: Editor) {
        this._graphics = graphics;
        if (editor) this._editor = editor;
        this.init();
        return this;
    }

    /** 图形初始化 */
    abstract init();
}