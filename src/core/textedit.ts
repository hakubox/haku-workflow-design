import { Graphics } from '@/graphics';
import { createElement } from '@/tools';
import { globalTransform } from './transform';

export class TextEditParams {
    /** X坐标 */
    x?: number;
    /** Y坐标 */
    y?: number;
    /** 对应文本编辑器节点 */
    element?: HTMLElement;
    /** 父级节点 */
    parent?: Element;
}

/** 文本编辑器 */
export default class TextEdit {
    constructor(config?: TextEditParams) {
        this.parent = config.parent || document.body;
        if (config.element) this.element = config.element;
        else this.render();
        
        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y; 

        this.element.setAttribute('contenteditable', 'false');
    }

    /** X坐标 */
    x: number;
    /** Y坐标 */
    y: number;
    /** 文本编辑器节点 */
    element: HTMLElement;
    _isEdit: boolean = true;
    /** 父级节点 */
    readonly parent: Element;

    /** 是否为编辑状态 */
    get isEdit() {
        return this._isEdit;
    }
    set isEdit(val: boolean) {
        this._isEdit = val;
        this.element.setAttribute('contenteditable', val ? 'true' : 'false');
    }

    /** 当前文本 */
    get text() {
        return this.element.innerText;
    }
    set text(val: string) {
        this.element.innerText = val;
    }

    /** 设置位置 */
    startEdit(str: string, x: number, y: number, width?: number) {
        this.element.innerText = str;
        this.element.style.left = x + globalTransform.offsetX + 'px';
        this.element.style.top = y + globalTransform.offsetY + 'px';
        this.element.style.width = width + 'px';
        this.element.setAttribute('contenteditable', 'true');
        this.element.focus();
    }

    /** 结束编辑 */
    endEdit() {
        this.element.style.display = 'none';
        // this.destroy();
    }

    /** 移除节点 */
    destroy() {
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    }

    render() {
        this.element = createElement('div', {
            attrs: {
                class: 'text-editor',
                tabindex: -1,
                contenteditable: 'false'
            },
            style: {
                left: this.x + globalTransform.offsetX + 'px',
                top: this.y + globalTransform.offsetY + 'px'
            },
            parent: this.parent
        });
        return this.element;
    }
}