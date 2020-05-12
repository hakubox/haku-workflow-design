/** 将SVG图形转换为PNG并下载 */
export function svg2png(svg: SVGSVGElement) {
    var serializer = new XMLSerializer();
    var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    var image = new Image();
    image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    var canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 800;
    var context = canvas.getContext("2d");
    context.fillStyle = '#fff';//#fff设置保存后的PNG 是白色的  
    context.fillRect(0, 0, 10000, 10000);
    image.onload = function() {  
        context.drawImage(image, 0, 0);  
        var a = document.createElement("a");  
        a.download = "name.png";  
        a.href = canvas.toDataURL("image/png");  
        a.click();  
    };
}