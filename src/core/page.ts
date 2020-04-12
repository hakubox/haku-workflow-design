
class PageParams {
    /** 单页宽度 */
    width?: number;
    /** 单页高度 */
    height?: number;
}

/** 页面 */
export default class Page {
    constructor({ width }: PageParams = {}) {
        this.width = width;
    }

    /** 单页宽度 */
    width: number = 210;

    /** 单页高度 */
    height: number = 297;

    /** 长度单位 */
    unit: 'mm' | 'px' = 'mm';
}