
/** 设计器事件类型 */
declare const enum EditorEventType {
    /** 浏览器窗口大小改变事件 */
    WindowSizeChange = 'window-size-change',
    /** 设计器初始化事件 */
    EditorInit = 'editor-init',
    /** 设计器画布大小改变 */
    EditorCanvasSizeChange = 'editor-canvas-size-change',
    /** 设计器画布滚动 */
    EditorCanvasScroll = 'editor-canvas-scroll',
    /** 鼠标按下 */
    EditorMouseDown = 'editor-mouse-down',
    /** 鼠标移动 */
    EditorMouseMove = 'editor-mouse-move',
    /** 鼠标松开 */
    EditorMouseUp = 'editor-mouse-up',
    /** 选择范围 */
    EditorAreaSelect = "editor-area-select",
    /** 新增图形 */
    GraphicsAddNew = 'graphics-add-new',
    /** 鼠标按下 */
    GraphicsMouseDown = 'graphics-mouse-down',
    /** 鼠标移动 */
    GraphicsMouseMove = 'graphics-mouse-move',
    /** 鼠标松开 */
    GraphicsMouseUp = 'graphics-mouse-up',
    /** 鼠标移入 */
    GraphicsMouseEnter = 'graphics-mouse-enter',
    /** 鼠标移出 */
    GraphicsMouseOut = 'graphics-mouse-out',
    /** 图形选择 */
    GraphicsActive = "graphics-active",
    /** 图形移动 */
    GraphicsMove = "graphics-move",
    /** 图形文字编辑 */
    GraphicsTextEdited = "graphics-text-edited",
    /** 图形位置变动 */
    GraphicsLocationChange = "graphics-location-change",
    /** 图形连线-开始 */
    GraphicsConnectStart = "graphics-connect-start",
    /** 图形连线-移动 */
    GraphicsConnecting = "graphics-connecting",
    /** 图形连线-结束 */
    GraphicsConnectEnd = "graphics-connect-end",
    
    /** 光标移动 */
    MouseMove = "mouse-move",
}

/** 图形附加数据 */
declare const enum GraphicsData {
    /** 图形标签文本 */
    text = "text",
    /** 图形连接线 */
    connectLines = "connectLines",
}

/** 模块级别 */
declare const enum ModuleLevel {
    /** 编辑器模块 */
    Editor = 'editor',
    /** 图形模块 */
    Graphics = 'graphics'
}

/** 图形类型 */
declare const enum GraphicsType {
    /** 矩形 */
    rect = "rect",
    /** 圆形 */
    circle = "circle",
    /** 菱形 */
    diamond = "diamond",
    /** 直线 */
    beeline = "beeline",
    /** 参考线 */
    guideline = "guideline",
    /** 区域 */
    marquee = "marquee",
    /** 文本 */
    span = "span",
    /** 笔记 */
    note = "note",

    /** 移动调节工具 */
    moveblock = "move-block",
    /** 选择框 */
    selector = "selector",
}

/** 文字位于图案的相对位置 */
declare const enum TextLocation {
    /** 无文字 */
    None = "none",
    /** 上方 */
    Top = "top",
    /** 中心 */
    Center = "center",
    /** 下方 */
    Bottom = "bottom",
    /** 自定义位置 */
    Custom = "custom",
}

/** 方向 */
declare const enum Direction {
    /** 竖向 */
    Vertical = "vertical",
    /** 横向 */
    Horizontal = "horizontal",
}
