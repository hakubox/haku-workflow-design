/** 图形类型 */
declare const enum GraphicsType {
    /** 矩形 */
    rect = 'rect',
    /** 圆形 */
    circle = 'circle',
    /** 直线 */
    beeline = 'beeline',
    /** 参考线 */
    guideline = 'guideline',
    /** 区域 */
    marquee = 'marquee',
    /** 笔记 */
    note = 'note',

    /** 移动调节工具 */
    moveblock = 'move-block',
    /** 选择框 */
    selector = 'selector'
}

/** 文字位于图案的相对位置 */
declare const enum TextLocation {
    /** 无文字 */
    None = 'none',
    /** 上方 */
    Top = 'top',
    /** 中心 */
    Center = 'center',
    /** 下方 */
    Bottom = 'bottom',
    /** 自定义位置 */
    Custom = 'custom'
}

/** 方向 */
declare const enum Direction {
    /** 竖向 */
    Vertical = 'vertical',
    /** 横向 */
    Horizontal = 'horizontal',
}