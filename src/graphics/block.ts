import Graphics, { GraphicsParams } from "@/core/graphics";
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class BlockGraphicsParams extends GraphicsParams {
    /** 坐标X */
    x: number;
    /** 坐标Y */
    y: number;
    /** 填充颜色 */
    fill: string;
}

/** 方块图形 */
export default abstract class BlockGraphics extends Graphics {
    constructor(config: BlockGraphicsParams) {
        super(config);
        
        this.x = config.x;
        this.y = config.y;
        this.fill = config.fill;
    }

    /** 坐标X */
    x: number;
    /** 坐标Y */
    y: number;
    /** 填充颜色 */
    fill: string;
    /** 子节点 */
    children: Graphics[] = [];
    
    /** 设置坐标 */
    abstract setLocation(config: { x: number, y: number, offsetX: number, offsetY: number }): void;

    abstract render(transform: Transform);
}