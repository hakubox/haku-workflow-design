import { Editor } from '@/core';
import "./assets/basic.scss";
import { Rect } from './graphics';
import './enum';
import './interface';

console.time('editor-init');

window['editor'] = new Editor({
    onInit(callback) {
        this.addGraphics(
            ...[
                [0, -800], [0, -600], [0, -400], [0, -200], [0, 0], [0, 200], [0, 400], [0, 600], [0, 800],
                [-800, 0], [-600, 0], [-400, 0], [-200, 0], [0, 0], [200, 0], [400, 0], [600, 0], [800, 0],
                // [0, 0]
            ].map(i => new Rect({
                radius: 8,
                x: i[0],
                y: i[1],
                width: 100,
                height: 100,
                fill: '#1890FF'
            }))
        );
        this.addGuideLine(true, 0);
        this.addGuideLine(false, 0);
        setTimeout(() => {
            callback();
        }, 10);
    }
});
console.log(window['editor']);

if (module['hot']) {
    module['hot'].accept("./index.ts", function () {
        console.log("正在更新flow模块");
    });
}