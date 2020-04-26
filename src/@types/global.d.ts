import { h } from '@/lib/h';

declare global {

    /** jsx构建函数 */
    const h: (tagName: any, props?: Record<string, any>, ...childNodes: any[]) => HTMLElement;
}

declare module 'axios' {
    interface AxiosRequestConfig {
        /** 用于撤销请求的函数 */
        cancel?: Function;
    }
}