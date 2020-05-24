/** 附加数据 */
export default class AttachData {
    constructor() {
        this.data = {};
    }
    
    /** 绑定数据 */
    private data: Record<string, any>;

    /** 获取额外数据 */
    getData(key: GraphicsData | string) {
        return this.data[key];
    }

    /** 设置额外数据 */
    setData(key: GraphicsData | string, value: any) {
        this.data[key] = value;
    }
}