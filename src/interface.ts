import Graphics from "./graphics/graphics";

/** 拖拽配置 */
export interface DragConfig {
    /** 是否开始拖拽 */
    isStart: boolean;
    /** 拖拽的图形 */
    graphicsLocations: IdLocation[];
    /** 拖拽点横坐标 */
    x1: number;
    /** 拖拽点纵坐标 */
    y1: number;
    /** 终止点横坐标 */
    x2: number;
    /** 终止点纵坐标 */
    y2: number;
    /** 选中图形的最小x坐标 */
    minx: number;
    /** 选中图形的最小Y坐标 */
    miny: number;
    /** 重设 */
    reset: () => void;
}

/** 框选配置 */
export interface SelectorConfig {
    /** 是否开始 */
    isStart: boolean;
    /** 拖拽点横坐标 */
    x1: number;
    /** 拖拽点纵坐标 */
    y1: number;
    /** 终止点横坐标 */
    x2: number;
    /** 终止点纵坐标 */
    y2: number;
    /** 重设 */
    reset: () => void;
}

/** 滚动标记 */
export interface WillScroll {
    /** 是否开始 */
    isStart: boolean;
    /** x坐标 */
    offsetX: number;
    /** y坐标 */
    offsetY: number;
    /** 速度 */
    speed: number;
    /** 速度倍率 */
    speedRate: number;
    /** 将要开始 */
    willStart: boolean;
    /** 往上滚动 */
    topRoll: boolean;
    topStep: number;
    /** 往左滚动 */
    leftRoll: boolean;
    leftStep: number;
    /** 往右滚动 */
    rightRoll: boolean;
    rightStep: number;
    /** 往下滚动 */
    bottomRoll: boolean;
    bottomStep: number;
    /** 重设 */
    reset(): void;
}

/** 位置坐标 */
export interface Location {
    /** x坐标 */
    x: number;
    /** y坐标 */
    y: number;
}

/** 位置及高宽度 */
export interface Block extends Location {
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
}

export interface IdLocation extends Location {
    /** Id */
    id: string;
}

/** DOM节点参数 */
export interface DomAttr {
    /** 是否显示 */
    show?: boolean;
    /** 节点文本内容 */
    text?: string;
    /** 父节点 */
    parent?: Element | DocumentFragment;
    /** class样式 */
    class?: string | string[];
    /** css样式 */
    style?: Record<string, any>;
    /** 节点属性 */
    attrs?: Record<string, any>;
    /** 节点事件 */
    events?: Record<string, (target: EventTarget) => void>;
}

/** SVG text 属性 */
export interface TextAttrs extends Location {
    fill: string;
    class: string;
}