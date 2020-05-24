import { h } from '@/lib/h';

declare global {

    /** jsx构建函数 */
    const h: (tagName: any, props?: Record<string, any>, ...childNodes: any[]) => HTMLElement;

    interface SVGElement {
        /** 获取属性值 */
        // attr(this: SVGElement, key: string): string;
        /** 属性赋值 */
        // attr(this: SVGElement, key: string, value: string | number): this;
        /** 批量属性赋值 */
        // attr(this: SVGElement, attrs: Record<string, string | number>): this;
    }
}

declare module 'axios' {
    interface AxiosRequestConfig {
        /** 用于撤销请求的函数 */
        cancel?: Function;
    }
}