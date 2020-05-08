import { Graphics, Span } from "@/graphics";
import { TextAttrs } from '@/interface';
import Module from "@/core/module";
import { Editor } from '@/core';
import GraphicsModule, { GraphicsModuleParams } from '@/core/graphicsmodule';

/** 标签文本 */
export default class Label extends GraphicsModule {
    constructor(options: GraphicsModuleParams) {
        super(options);
    }

    moduleName = 'module-graphics-label';
    static moduleType = ModuleLevel.Editor;
    moduleType = ModuleLevel.Editor;

    // text: string = '';
    /** 文字位置 */
    textLocation = TextLocation.Bottom;
    /** 文字颜色 */
    textColor: string = '#888888';

    /** text文本元素 */
    textGraphics: Span;

    /** 获取图形文本的坐标 */
    get textCoordinate(): Location { 
        return {
            none: { },
            top: {
                x: this.graphics.x + this.graphics.getWidth() / 2,
                y: this.graphics.y - 12,
            },
            center: {
                x: this.graphics.x + this.graphics.getWidth() / 2,
                y: this.graphics.y + this.graphics.getHeight() / 2
            },
            bottom: {
                x: this.graphics.x + this.graphics.getWidth() / 2,
                y: this.graphics.y + this.graphics.getHeight() + 16
            },
            custom: {
                x: this.graphics.x,
                y: this.graphics.y
            }
        }[this.textLocation] as Location;
    }

    /** 获取图形文本的所有属性 */
    get textAttrs(): TextAttrs {
        return {
            fill: this.textColor,
            class: 'graphics-label',
            ...this.textCoordinate,
            ...{
                none: { class: 'display-none' }
            }[this.textLocation]
        } as TextAttrs;
    }
    
    /** 设置标签文本 */
    setText(text: string) {
        // this.text = text;
        this.graphics.setData(GraphicsData.text, text);
        this.textGraphics.graphics.textContent = text;
        return this;
    }

    /** 设置标签文本位置 */
    setTextLocation(location: TextLocation) {
        this.textLocation = location;
        this.textGraphics.render();
        return this;
    }

    /**
     * 重绘文字部分（可传入自定义参数
     * @param {number} [x=0] X坐标偏移量
     * @param {number} [y=0] Y坐标偏移量
     * @param {object} [config={}] 额外配置
     */
    renderText(config: Record<string, any> = {}) {
        if (this?.textGraphics?.graphics?.parentElement) {
            this.textGraphics.graphics.parentElement.removeChild(this.textGraphics.graphics);
        }
        const _span = new Span({
            text: this.graphics.getData(GraphicsData.text),
            x: this.textAttrs.x,
            y: this.textAttrs.y,
            notModule: true,
            ...config
        });
        return _span;
    }

    init() {
        this.textGraphics = this.renderText();
        console.log('初始化', this.graphics.id);
        this.graphics.on(EditorEventType.GraphicsLocationChange, this.setLocation, this);
    }
    
    render(svg: SVGElement) {
        svg.appendChild(this.textGraphics.render());
        return svg;
    }
    
    setLocation({ x, y }) {
        if (this.textAttrs.x !== x || this.textAttrs.y !== y) {
            this.textGraphics.setLocation(this.textAttrs.x, this.textAttrs.y);
        }
    }
}