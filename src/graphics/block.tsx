import Graphics, { GraphicsParams } from "@/graphics/graphics";
import { createSVGElement } from "@/tools";
import Transform from '@/core/transform';

export class BlockParams extends GraphicsParams {
    /** 边框颜色 */
    stroke?: string;
    /** 填充颜色 */
    fill?: string;
}

/** 方块图形 */
export default abstract class Block extends Graphics {
    constructor(config: BlockParams = {}) {
        super(config);
        
        this.fill = config.fill;
        this.stroke = config.stroke;
    }

    /** 边框颜色 */
    stroke: string;
    /** 填充颜色 */
    fill: string;
    /** 子节点 */
    children: Graphics[] = [];

    /** 移除节点 */
    public destroy() {
        this.children.forEach(i => {
            i.destroy();
        });
        this.graphics.parentNode.removeChild(this.graphics);
        this.graphics = null;
    }

    abstract render();
}