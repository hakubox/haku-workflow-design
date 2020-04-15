
/** 坐标转换类 */
export default class Transform {
    constructor() {

    }

    /** X坐标偏移量 */
    offsetX: number = 0;
    /** Y坐标偏移量 */
    offsetY: number = 0;
    /** 旋转角度 */
    rotate: number = 0;
    /** 放大倍率 */
    scale: number = 1;
}

/**
 * 全局坐标转换对象（位移/缩放/旋转）
 */
export const globalTransform = new Transform();