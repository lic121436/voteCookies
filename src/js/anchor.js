//导航栏跟随头部滚动
$(window).scroll(function () {
	if ($(window).scrollTop() >= $("#logo").height()) {
		$('#vote_num').css({
			"position": "fixed",
			"top": 0,
			"left": 0,
			"right": 0,
			"marginTop": 0
		});
		$('#vote-num').css({
			"backgroundColor": "#fae0c7",
		});

	} else {
		$('#vote_num').css({
			"position": "static",
			"top": ""
		});
		$('#vote-num').css({
			"backgroundColor": "",
		});
	}
});
//锚点平滑滚动
$('a[href*=#],area[href*=#]').click(function () {
	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
		var $target = $(this.hash);
		
		$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
		if ($target.length) {
			var tragetTo = $target.offset().top;
			var numheight = $("#vote_num").height();
			var titleheight = $(".list-title").height();
			if ($(window).scrollTop() < $("#logo").height()) {
				var targetOffset = tragetTo - numheight * 2 - titleheight * 3;
			} else {
				var targetOffset = tragetTo - numheight - titleheight * 2;
			}
			//过滤掉正在执行动画的模块，执行动画
			$('html,body').filter(':not(:animated)').animate({
					scrollTop: targetOffset
				},
				1000);
			return false;
		}
	}
});

/**
 * 获取一个投票项目的起始位置和结束位置
 **/
var el = {
	getStartHeight: function (selector) {
		return startHeight = selector.offset().top; // 获取元素到窗口顶部的距离 
	},
	getEndHeight: function (selector) {
		return endHeight = this.getStartHeight(selector) + selector.outerHeight(true); // 获取元素结束的位置
	}
}

/**
 * 滚动距离在指定的位置内容，将添加或删除class类
 **/


function setClass(selector, nowHeight, titleHeight) {
	var flag = nowHeight > (el.getStartHeight($(selector)) - titleHeight * 3) && nowHeight < (el.getEndHeight($(selector)) - titleHeight * 2);
	if (flag) {
		// console.log(titleHeight);
		// console.log("scrollTop", nowHeight);
		// console.log(selector + "开始高度",  el.getStartHeight($(selector)));
		// console.log(selector + "结束高度", el.getEndHeight($(selector)));
		// console.log(selector + "高度", el.getEndHeight($(selector)) - el.getStartHeight($(selector)));

		$("[href='" + selector + "']").addClass("active");
	} else {
		$("[href='" + selector + "']").removeClass("active");
	}
}

/**
 * intAnchor：用于对数组arr的id相对应的导航标题进行修改class让其呈现选中状态;
 * 调用 $.intAnchor(arr);
 **/
;
(function ($) {
	$.extend({
		initAnchor: function (arr) {
			var arr = arr;
			// 滚动条滚动赋值
			var titleHeight = $(" #list .list-title").outerHeight(true); // 投票详细标题栏高度
			$(window).on('scroll', function () {
				var nowHeight = $(window).scrollTop();
				for (var i = 0; i < arr.length; i++) {
					setClass(arr[i], nowHeight, titleHeight);
				}
			});
		}
	});
})(jQuery);