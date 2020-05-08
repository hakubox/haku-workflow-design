/** @jsx createElement */
const HTML_TAGS = {
    svg: "svg",
    g: "g",
    symbol: "symbol",
    defs: "defs",
    a: "a",

    rect: "rect",
    circle: "circle",
    ellipse: "ellipse",
    line: "line",
    polyline: "polyline",
    polygon: "polygon",
    path: "path",
    text: "text",
    textpath: "textpath",
    tspan: "tspan",
    image: "image",
    gradient: "gradient",
    stop: "stop",
    pattern: "pattern",
    mask: "mask",
    clippath: "clippath",
    use: "use",
    marker: "marker"
};
const GLOBAL_ATTRIBUTES = {
    accessKey: "accesskey",
    className: "class",
    contentEditable: "contenteditable",
    contextMenu: "contextmenu",
    dir: "dir",
    draggable: "draggable",
    dropZone: "dropzone",
    hidden: "hidden",
    id: "id",
    itemId: "itemid",
    itemProp: "itemprop",
    itemRef: "itemref",
    itemScope: "itemscope",
    itemType: "itemtype",
    lang: "lang",
    spellCheck: "spellcheck",
    tabIndex: "tabindex",
    title: "title",
    translate: "translate",

    x: "x",
    y: "y",
    x1: "x1",
    y1: "y1",
    x2: "x2",
    y2: "y2",
    rx: "rx",
    ry: "ry",
    width: "width",
    height: "height",
    stroke: "stroke",
    strokeWidth: "stroke-width",
    fill: "fill",
    transform: "transform",
    points: "points",
    pointerEvents: "pointer-events",
    textAnchor: "text-anchor",
    dominantBaseline: "dominant-baseline"
};
const EVENT_HANDLERS = {
    onClick: "click",
    onFocus: "focus",
    onBlur: "blur",
    onChange: "change",
    onSubmit: "submit",
    onInput: "input",
    onResize: "resize",
    onScroll: "scroll",
    onWheel: "mousewheel",
    onMouseDown: "mousedown",
    onMouseUp: "mouseup",
    onMouseMove: "mousemove",
    onMouseEnter: "mouseenter",
    onMouseOver: "mouseover",
    onMouseOut: "mouseout",
    onMouseLeave: "mouseleave",
    onTouchStart: "touchstart",
    onTouchEnd: "touchend",
    onTouchCancel: "touchcancel",
    onContextMenu: "Ccntextmenu",
    onDoubleClick: "dblclick",
    onDrag: "drag",
    onDragEnd: "dragend",
    onDragEnter: "dragenter",
    onDragExit: "dragexit",
    onDragLeave: "dragleave",
    onDragOver: "dragover",
    onDragStart: "Dragstart",
    onDrop: "drop",
    onLoad: "load",
    onCopy: "copy",
    onCut: "cut",
    onPaste: "paste",
    onCompositionEnd: "compositionend",
    onCompositionStart: "compositionstart",
    onCompositionUpdate: "compositionupdate",
    onKeyDown: "keydown",
    onKeyPress: "keypress",
    onKeyUp: "keyup",
    onAbort: "Abort",
    onCanPlay: "canplay",
    onCanPlayThrough: "canplaythrough",
    onDurationChange: "durationchange",
    onEmptied: "emptied",
    onEncrypted: "encrypted ",
    onEnded: "ended",
    onError: "error",
    onLoadedData: "loadeddata",
    onLoadedMetadata: "loadedmetadata",
    onLoadStart: "Loadstart",
    onPause: "pause",
    onPlay: "play ",
    onPlaying: "playing",
    onProgress: "progress",
    onRateChange: "ratechange",
    onSeeked: "seeked",
    onSeeking: "seeking",
    onStalled: "stalled",
    onSuspend: "suspend ",
    onTimeUpdate: "timeupdate",
    onVolumeChange: "volumechange",
    onWaiting: "waiting",
    onAnimationStart: "animationstart",
    onAnimationEnd: "animationend",
    onAnimationIteration: "animationiteration",
    onTransitionEnd: "transitionend",
};
export default function createElement({ elementName, attributes, children }: { elementName: string, attributes: Record<string, any>, children: any[] }): SVGElement {
    if (attributes === null) {
        attributes = {};
    }

    // const tag = HTML_TAGS[elementName];
    // const object = typeof tag === "object";
    // const localAttrs = object ? tag.attributes || {} : {};
    // const attrs = Object.assign({}, GLOBAL_ATTRIBUTES, localAttrs);
    // const tagType = object ? tag.name : tag;
    // const el = document.createElement(tagType);

    const tag = HTML_TAGS[elementName];
    const object = typeof tag === "object";
    const localAttrs = object ? tag.attributes || {} : {};
    const attrs = Object.assign({}, GLOBAL_ATTRIBUTES, localAttrs);
    const tagType = tag;
    const el = document.createElementNS('http://www.w3.org/2000/svg', tagType);

    Object.keys(attributes).forEach((prop) => {
        if (prop in attrs) {
            el.setAttribute(attrs[prop], attributes[prop] + '');
        }
        if (prop in EVENT_HANDLERS) {
            el.addEventListener(EVENT_HANDLERS[prop], attributes[prop]);
        }
    });
    if ("style" in attributes) {
        const styles = attributes.style;
        Object.keys(styles).forEach((prop) => {
            const value = styles[prop];
            if (typeof value === "number") {
                el.style[prop] = `${value}px`;
            } else if (typeof value === "string") {
                el.style[prop] = value;
            } else {
                throw new Error(
                    `Expected "number" or "string" but received "${typeof value}"`
                );
            }
        });
    }
    children.forEach((childNode) => {
        if (typeof childNode === "object") {
            if (childNode instanceof Array) {
                childNode.forEach(node => el.appendChild(node));
            } else {
                el.appendChild(childNode);
            }
        } else if (typeof childNode === "string") {
            el.appendChild(document.createTextNode(childNode));
        } else {
            throw new Error(
                `Expected "object" or "string" but received "${typeof childNode}"`
            );
        }
    });
    return el;
}