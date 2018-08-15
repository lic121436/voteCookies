'use strict';
/**
 * 绘制投票头部标题canvas文字
 * @param {*} selector    传入的元素
 */
var CanvasTitle = function(el, options) {
  var opts = $.extend({}, CanvasTitle.DEFAULTS, options);
  el.width = document.body.clientWidth / opts.widthRatio;
  el.height = opts.height;
  el.style.letterSpacing = opts.letterSpacing;
  var ctx = el.getContext("2d");
  var text = $(el).attr(opts.dataName);
  ctx.font =
    opts.fontWeigth + opts.fontSize +  "/" + opts.fontSize + " 微软雅黑,arial,sans-serif";
  var lg = ctx.createLinearGradient(0, 0, 0, 14);
  for (var i = 0; i < opts.colorRatio.length; i++) {
    lg.addColorStop(opts.colorRatio[i].radio, opts.colorRatio[i].color);
  }
  ctx.fillStyle = lg;
  ctx.lineWidth = 5;
  ctx.shadowColor = "#000";
  ctx.shadowBlur = -5;
  ctx.shadowOffsetX = -1;
  ctx.shadowOffsetY = 1;
  ctx.textAlign = "center";
  ctx.fillText(text, el.width / 2, opts.canvasY);
};

// CanvasTitle的默认属性
CanvasTitle.DEFAULTS = {
  widthRatio: 1, // 传入宽度比例
  height: 28, // 传入高度
  letterSpacing: 0, // 传入的文字间距
  dataName: "data-content", // 传入绘制文本的内容所在属性
  fontWeigth: "normal ", // 传入的字体粗细（注：这个要加一个空格哦）
  fontSize: "28px", // 传入的字体大小
  // 传入的渐变颜色比例
  colorRatio: [
    {
      radio: 0,
      color: "#fff"
    },
    {
      radio: 0.3,
      color: "#f7ec16"
    },
    {
      radio: 0.7,
      color: "#f7ec16"
    },
    {
      radio: 1,
      color: "#f7ec16"
    }
  ],
  canvasY: 12 // 传入的开始绘制文本的 y 坐标位置
};
