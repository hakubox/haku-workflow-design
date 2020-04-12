import { Editor } from '@/core';
import "./assets/basic.scss";
import { Rect } from './graphics';

console.time('editor-init');

window['editor'] = new Editor({
    onInit(callback) {
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: 0,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: -300,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: -600,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: -900,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: 300,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: 600,
            fill: 'red'
        }));
        this.addGraphics(new Rect({
            radius: 50,
            x: 0,
            y: 900,
            fill: 'red'
        }));
        this.addGuideLine(true, 0);
        this.addGuideLine(false, 0);
        setTimeout(() => {
            callback();
        }, 100);
    }
});
console.log(window['editor']);

if (module['hot']) {
    module['hot'].accept("./index.ts", function () {
        console.log("正在更新flow模块");
    });
}