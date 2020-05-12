import { Editor } from '@/core';
import "./assets/basic.scss";
import './enum';
import './interface';
import { Rect, Diamond } from './graphics';
import './modules';
import { Haku } from './core/global';
import { ToolBar, Drag, Label, ConnectPoint, ConnectLine } from './modules';


console.time('editor-init');

const editor = new Editor();

editor.module(Drag);
editor.module(Label);
editor.module(ConnectLine);
editor.module(ConnectPoint);
editor.module(ToolBar);

// editor.module(Thumbnail, { 
//     align: 'top-right', 
//     canDrag: true 
// });

window['editor'] = editor;

editor.once(EditorEventType.EditorInit, function(this: Editor) {
    this.addGraphics(
        ...[
            [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
            
            // [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
            // [-800, 0], [-600, 0], [-400, 0], [-200, 0], [200, 0], [400, 0], [600, 0], [800, 0],
        ].map(i => new Rect({
            editor: this,
            radius: 8,
            x: i[0],
            y: i[1],
            width: 100,
            height: 100,
            fill: '#ABDDF3',
            stroke: '#888888',
            data: { text: '123' }
        })),
        new Diamond({
            editor: this,
            x: 200,
            y: 200,
            width: 200,
            height: 100,
            fill: '#ABDDF3',
            stroke: '#888888',
            data: { text: '234' }
        })
    );
    this.addGuideLine(Direction.Horizontal, 0);
    this.addGuideLine(Direction.Vertical, 0);
});
console.log(window['editor']);

setTimeout(() => {
    console.log(Haku);
}, 1000);

if (module['hot']) {
    module['hot'].accept("./index.ts", function () {
        console.log("正在更新flow模块");
    });
}