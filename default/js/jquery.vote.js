/**
 * getJudgeArr函数：用于对数组arr,若是存在将数组里的值跟对应的范围selector的标签进行更改(此处改变对应data-id相同的标签内的html值),同时改变selector2对应显示数量
 * 调用示例：$.getJudgeArr(vote_arr1, "#vote1", $("#num1 span"));
 *
 * btnSelect函数：用于点击按钮时对数组arr数量的增加与删除,用时判断最大值maxNum与最小值minNum,同时改变selector对应显示数量
 * 调用示例：$("#vote1 li .btn-box [data-id]").btnSelect($("#num1 span"), vote_arr1, maxNum, minNum, 'cookieArr1');
 **/


;
(function ($) {
	$.extend({
		getJudgeArr: function (arr, selector, selector2) {
			var arr = arr,
				arr2 = [],
				selector = selector,
				selector2 = selector2;
			
			// 获取selector所包含的data-id标签并将其attr生成一个数组
			$(selector + " [data-id]").each(function(){
				 arr2.push($(this).attr("data-id"));
			});
				
			// 判断arr2是否包含arr的所有值，若有不同的值，则将arr中的不同值删除生成新的arr数组进行下一步操作
			for(var i = 0; i < arr.length; i++){
				if($.inArray(arr[i], arr2) === -1){					
					 arr.splice($.inArray(arr[i], arr), 1);
					 i--;
				}
			}

			// 判断数组是否存在，若是存在将数组里的值跟对应的范围的值标签进行更改(此处改变对应data-id相同的标签内的html值),同时改变对应显示数量
			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					$(selector + " li .btn-box [data-id='" + arr[i] + "']").addClass('check').html('<span class="glyphicon glyphicon-ok"></span>');
					// 改变对应显示数量
				}
				selector2.text(arr.length);
			}
		}
	});
	$.fn.extend({
		btnSelect: function (selector, arr, maxNum, minNum, cookiename) {
			var $obj = $(this),
				selector = selector,
				arr = arr,
				maxNum = maxNum,
				minNum = minNum;
			// 点击投票按钮选中，并将相应的ID值加入数组
			$obj.on('click', function () {
				var $this = $(this), // 将当前项赋值于$this
					valId = $this.attr('data-id'); // 获取属性data-id值
				// 判断当前的data-id值是否在数组中，不在数组中将其加入数组，并改变它的html内容；在数组中则其从数组中删除，并改变它的html内容。
				if ($.inArray(valId, arr) === -1) {
					if (arr.length <= (maxNum - 1)) {
						arr.push(valId);
						// 对其改变样式html
						$this.addClass('check').html('<span class="glyphicon glyphicon-ok"></span>');
						// 改变对应显示数量
						selector.text(arr.length);
					} else {
						layer.alert("最大票数不能超过: " + maxNum + "票", {
							title: "最大票数提示",
							icon: 5
						});
					}
				} else {
					if (arr.length > minNum) {
						// 从数组中将当前data-id值删除
						arr.splice($.inArray(valId, arr), 1);
						// 对其改变样式html
						$this.removeClass('check').html('<span class="glyphicon glyphicon-thumbs-up"></span> 投票');
						// 改变对应显示数量
						selector.text(arr.length);
					} else {
						layer.alert("最小票数不能小于: " + minNum + "票", {
							title: "最小票数提示",
							icon: 5
						});
					}
				}
				// 创建cookie
				$.cookie(cookiename, //写入cookie
					arr.join("|"), //需要cookie写入的业务
					{
						"path": "/", //cookie的默认属性
						"expires": 10 //有效天数
					});
			});

		}
	});
})(jQuery);

// 判断cookie是否存在,若是存在将其分割成数组
function judgeCookie(arr, cookieName) {
	if (cookieName !== null && cookieName !== "null") { // 第一组
		arr = cookieName.split("|");
	}
	return arr;
};