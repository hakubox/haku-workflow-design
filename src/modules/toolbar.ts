import Module from "@/core/module";
import { Editor } from '@/core';
import EditorModule, { EditorModuleParams } from '@/core/eidtormodule';

/** 工具栏 */
export default class ToolBar extends EditorModule {
    constructor(options: EditorModuleParams) {
        super(options);
    }

    moduleName = 'module-graphics-toolbar';
    static moduleType = ModuleLevel.Editor;
    moduleType = ModuleLevel.Editor;
    
    render() {
        throw new Error("Method not implemented.");
    }

    init() {
    }
}