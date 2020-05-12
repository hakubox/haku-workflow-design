import { Editor } from '.';
import Module, { ModuleParams } from './module';

export interface EditorModuleParams extends ModuleParams {
    editor: Editor;
    [str: string]: any;
}

/** 编辑器模块 */
export default abstract class EditorModule extends Module {
    constructor(options: EditorModuleParams) {
        super(options);

        if (options.editor) {
            this.editor = options.editor;
            this.editor.once(EditorEventType.EditorInit, this.init);
        } else {
            throw new Error('作为编辑器模块未传入editor参数！')
        }
    }

    moduleType = ModuleLevel.Editor;

    /** 编辑器 */
    editor: Editor;

    /** 编辑器初始化钩子 */
    abstract init();

    /** 编辑器模块初始化 */
    moduleInit(editor: Editor) {
        this.editor = editor;
        this.init();
        return this;
    }
}