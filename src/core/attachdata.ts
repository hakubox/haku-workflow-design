/** 附加数据 */
export default class AttachData {
    
    /** 绑定数据 */
    private _data: Record<string, any> = {};

    /** 获取额外数据 */
    getData(key: GraphicsData | string) {
        return this._data[key];
    }
    /** 设置额外数据 */
    setData(key: GraphicsData | string, value: any) {
        this._data[key] = value;
    }
}