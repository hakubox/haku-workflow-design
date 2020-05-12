import { Graphics, Span } from "@/graphics";
import { TextAttrs, Location } from '@/interface';
import Module from "@/core/module";
import { Editor } from '@/core';
import GraphicsModule, { GraphicsModuleParams } from '@/core/graphicsmodule';
import { globalTransform } from '@/core/transform';

/** 标签文本 */
export default class Label extends GraphicsModule {
    constructor(options: GraphicsModuleParams) {
        super(options);
    }

    // text: string = '';
    /** 文字位置 */
    textLocation = TextLocation.Bottom;
    /** 文字颜色 */
    textColor: string = '#888888';

    /** text文本元素 */
    textGraphics: Span;

    /** 获取图形文本的坐标 */
    textCoordinate(x?: number, y?: number): Location { 
        const _width = this.graphics.getWidth();
        const _height = this.graphics.getHeight();
        const _lx = x || this.graphics.x;
        const _ly = y || this.graphics.y;
        let _ex = 0;
        let _ey = 0;
        switch (this.textLocation) {
            case TextLocation.None:
                _ex = 0;
                _ey = 0;
                break;
            case TextLocation.Top:
                _ex = _lx + _width / 2;
                _ey = _ly - 12;
                break;
            case TextLocation.Center:
                _ex = _lx + _width / 2;
                _ey = _ly + _height / 2;
                break;
            case TextLocation.Bottom:
                _ex = _lx + _width / 2;
                _ey = _ly + _height + 16;
                break;
            case TextLocation.Custom:
                _ex = _lx;
                _ey = _ly;
                break;
            default:
                break;
        }
        return { x: _ex, y: _ey };
    }

    /** 获取图形文本的所有属性 */
    get textAttrs(): TextAttrs {
        return {
            fill: this.textColor,
            class: 'graphics-label',
            ...this.textCoordinate(),
            ...{
                none: { class: 'display-none' }
            }[this.textLocation]
        } as TextAttrs;
    }
    
    /** 设置标签文本 */
    setText(text: string) {
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
            x: - globalTransform.offsetX,
            y: - globalTransform.offsetY,
            notModule: true,
            ...config
        });
        return _span;
    }

    init() {
        this.textGraphics = this.renderText();
        this.graphics.on(EditorEventType.GraphicsLocationChange, this.setLocation, this);
    }
    
    render(svg: SVGElement) {
        const _width = this.graphics.getWidth();
        const _height = this.graphics.getHeight();
        const [x, y] = {
            none: () => [0, 0],
            top: () => [_width / 2, -12 ],
            center: () => [_width / 2, _height / 2 ],
            bottom: () => [_width / 2, _height + 16 ],
            custom: () => [0, 0],
        }[this.textLocation]() as [number, number];
        const textSvg = this.textGraphics.render();
        textSvg.setAttribute('transform', `translate(${x},${y})`);
        svg.appendChild(textSvg);
        return svg;
    }
    
    setLocation({x, y}) {
    }
}