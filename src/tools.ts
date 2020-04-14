
/** 获取参数类型 */
export function getType(obj: any): string {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

/** 生成随机组件Id */
export function createModelId(len = 36) {
    const s: Array<string> = [];
    const hexDigits = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < len; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 26), 1);
    }
    // s[8] = s[13] = s[18] = s[23] = "-";
    const uuid = s.join("");
    return uuid;
}

/** 递归函数 */
export function recursive<T>(formVariables: Array<T>, callback?: {
    forEach?: (variable: T, chain: Array<T>) => void,
    filter?: (variable: T, chain: Array<T>) => boolean,
    map?: (variable: T, chain: Array<T>) => any
}, childField: string = 'children'): Array<T> {

    if (!callback) {
        return formVariables;
    }

    const _list: Array<T> = [];

    // 递归
    const _cb = (newParent: T, parent: T, chain: Array<T>) => {
        callback?.forEach?.(newParent, chain);
        if (callback?.filter?.(newParent, chain) === false) {
            return;
        }
        const _item = {
            ...parent,
            [childField]: []
        };
        chain.push(_item);
        if (parent?.[childField]?.length) {
            for (let i = 0; i < parent[childField].length; i++) {
                _cb(_item, parent[childField][i], chain);
            }
        }
        newParent[childField].push(callback.map?.(_item, chain) || _item);
    };

    formVariables.forEach(item => {
        const _item = {
            ...item,
            [childField]: []
        };
        if (callback?.filter?.(_item, []) === false) {
            return;
        }

        if (item?.[childField]?.length) {
            for (let i = 0; i < item[childField].length; i++) {
                _cb(_item, item[childField][i], [_item]);
            }
        }

        _list.push(callback.map?.(_item, [_item]) || _item);
    });

    return _list;
}

/** DOM节点参数 */
interface DomAttr {
    /** 父节点 */
    parent?: HTMLElement | SVGElement;
    /** class样式 */
    class?: string | string[];
    /** css样式 */
    style?: Record<string, any>;
    /** 节点属性 */
    attrs?: Record<string, any>;
    /** 节点事件 */
    events?: Record<string, (target: EventTarget) => void>;
}

function mergeAttrs(dom: HTMLElement | SVGElement, attrs: DomAttr = {}, children: Element[] = []) {
    attrs.style && Object.entries(attrs.style).forEach(([key, value]) => {
        dom.style[key] = value;
    });
    attrs.attrs && Object.entries(attrs.attrs).forEach(([key, value]) => {
        dom.setAttribute(key, value);
    });
    if (attrs.class && typeof(attrs.class) === 'string') attrs.class = [attrs.class];
    attrs.class && dom.classList.add(...attrs.class);
    attrs.events && console.error('暂未添加事件');
    children.forEach(el => {
        dom.appendChild(el);
    });
    attrs.parent && attrs.parent.appendChild(dom);
}

/** 构建SVG节点 */
export function createSVGElement(nodeName: string, attrs: DomAttr = {}, ...children: SVGElement[]) {
    if (!attrs.parent) {
        attrs.parent = document.body;
    }
    let _el = document.createElementNS('http://www.w3.org/2000/svg', nodeName);
    mergeAttrs(_el, attrs, children);
    return _el;
}

/** 构建HTML节点 */
export function createElement(nodeName: string, attrs: DomAttr = {}, ...children: HTMLElement[]): HTMLElement {
    if (!attrs.parent) {
        attrs.parent = document.body;
    }
    const _el = document.createElement(nodeName);
    mergeAttrs(_el, attrs, children);
    return _el;
}