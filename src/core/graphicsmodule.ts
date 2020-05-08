import { Editor } from '.';
import { Graphics } from '@/graphics';
import Module, { ModuleParams } from './module';

export class GraphicsModuleParams extends ModuleParams {
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

    get graphics() {
        return this._graphics;
    }
    set graphics(val) {
        this._graphics = val;
    }

    /** 图形重绘钩子 */
    abstract render(svg: SVGElement): SVGElement | void | undefined;

    /** 初始化图形 */
    initGraphics(graphics: Graphics) {
        this._graphics = graphics;
        this.init();
        return this;
    }

    /** 图形初始化 */
    abstract init();
}