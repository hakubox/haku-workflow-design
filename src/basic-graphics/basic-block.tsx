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
export default abstract class BasicBlock extends Graphics {
    constructor(config: BlockParams) {
        super(config);
        
        this.fill = config.fill;
        this.stroke = config.stroke;
    }

    /** 边框颜色 */
    stroke: string;
    /** 填充颜色 */
    fill: string;

    abstract render();
}