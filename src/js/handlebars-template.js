;
// 渲染模板
function renderTemplate(templateSelector, data, htmlSelector) {
	var t = $(templateSelector).html();
	var f = Handlebars.compile(t);
	var h = f(data);
	$(htmlSelector).html(h);
}

// 注册uppEn方法: 输出大写英文数字
Handlebars.registerHelper("uppEn", function (value) {
	var arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
	return arr[value];
});

// 数值加1
Handlebars.registerHelper("addone", function (value) {
	return value + 1;
});

// 计算总数
Handlebars.registerHelper("Sum", function (value) {
	var len = value.length;
	return len;
});

// 判断第一个参数与第二个参数是否相等
Handlebars.registerHelper("equal", function (value, value2, options) {
	if (value == value2) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});