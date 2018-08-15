'use strict';


function voteCookies(options) {

};

// 设置voteCookies默认属性
voteCookies.DEFAULTS = {
	cookieName: "", // cookie名称
	voteBtnSelectorAll: "", // 获取投票按钮的DOM
	showNumSelector: "", // 获取显示投票数量的DOM
	maxNum: 9, // 最大投票数量
	minNum: 5, // 最小投票数量
	layerType: "layerPc", // 弹窗类型 default: alert弹窗, layerPc: layer.alert弹窗(需加载layer.js pc版本)， layerMobile: layer.open弹窗(需加载layer.js 移动版本)
};

voteCookies.prototype.cookieInit = function (options) {
	var opts = Object.assign(voteCookies.DEFAULTS, options); // ES6 对象拷贝
	var self = this;
	var clickAndSelectBtns = document.querySelectorAll(opts.voteBtnSelectorAll), // 获取投票按钮的DOM
		showNumText = document.querySelector(opts.showNumSelector), // 获取显示投票数量的DOM
		attrName = 'data-id', // 投票选中时获取存入cookie值的属性名称
		selectedShowHtml = '已选中', // 按钮显示的html
		showHtml = '投票'; // 选中后按钮显示的html

	// 获取cookie并将其分割成数组
	var showNumArr = this.splitCookies(this.getCookies(opts.cookieName));
	// 根据cookie显示选中的按钮与数量
	this.showNum(opts.cookieName, clickAndSelectBtns, clickAndSelectBtns, showNumText,
		attrName,
		selectedShowHtml);

	// 点击按钮时选中或都去除选中按钮，并修改按钮样式，与显示数量
	for (var i = 0; i < clickAndSelectBtns.length; i++) {
		(function (i) {
			var thisBtn = clickAndSelectBtns[i],
				thisCookieName = opts.cookieName,
				thisMaxNum = opts.maxNum,
				thisMinNum = opts.minNum,
				thisLayerType = opts.layerType;

			thisBtn.onclick = function () {
				self.clickBtnSelect(
					attrName,
					thisBtn,
					showNumText,
					showNumArr,
					thisMaxNum,
					thisMinNum,
					thisCookieName,
					showHtml,
					selectedShowHtml,
					thisLayerType
				);
			}

		})(i);
	}
	return showNumArr;
};


/**CanvasTitle
 * 判断cookie是否存在，存在则返回cookie值，不存在返回空数组
 * @param {*} cookieName 
 */

voteCookies.prototype.getCookies = function (cookieName) {
	var arr = document.cookie.replace(/\s/g, "").split(';');
	for (var i = 0; i < arr.length; i++) {
		var tempArr = arr[i].split('=');
		if (tempArr[0] === cookieName) {
			return decodeURIComponent(tempArr[1]);
		}
	}
	return [];
};

/**
 * 判断cookie是否存在,若是存在将其分割成数组
 * @param {*} cookieArr // 返回cookie数组
 * @param {*} cookieName // 传入的cookie值
 * @param {*} getAllListSelectorArr 获取属性标签的父元素
 * @param {*} getAllListSelector 获取返回的数组
 */
voteCookies.prototype.splitCookies = function (cookieArr, cookieName) {

	if (cookieArr !== null && cookieArr !== "null" && cookieArr.length > 0) {
		cookieArr = cookieArr.split("|");
	} else {
		cookieArr = [];
	}

	return cookieArr;
};

/**
 * 显示选中的投票数同时给选中的按钮更换样式
 * @param {*} cookieArr 传入的cookie数组
 * @param {*} getAllBtnList getAllListSelectorArr 获取属性标签元素
 * @param {*} getAllListSelector getAllListSelectorArr 获取属性标签的父元素
 * @param {*} showNumSelector 显示投票数量的元素
 * @param {*} attrName   		 获取vaId的属性名称
 * @param {*} selectedShowHtml   选中后按钮显示的html
 */
voteCookies.prototype.showNum = function (cookieName, getAllBtnList, getAllListSelector, showNumSelector, attrName, selectedShowHtml) {
	var getAllListSelectorArr = [];

	// 判断cookie是否存在，存在则返回cookie值，不存在返回null
	var cookieArr = this.getCookies(cookieName);

	// 判断cookie是否存在,若是存在将其分割成数组
	cookieArr = this.splitCookies(cookieArr, cookieName);

	// 获取getAllListSelector所包含的属性标签并将其attr生成一个数组
	getAllListSelectorArr = this._getDataIdArr(getAllListSelectorArr, getAllBtnList, attrName);

	// 判断getAllListSelectorArr是否包含cookieArr的所有值，若有不同的值，则将cookieArr中的不同值删除生成新的cookieArr数组进行下一步操作
	cookieArr = this._setNewArr(cookieArr, getAllListSelectorArr);

	// 判断cookieArr数组是否存在，若是存在将数组里的值跟对应的范围的值标签进行更改(此处改变对应属性相同的标签内的html值),同时改变对应显示数量
	if (cookieArr) {
		for (var i = 0; i < cookieArr.length; i++) {
			(function (i) {
				for (var j = 0; j < getAllListSelector.length; j++) {

					if (getAllListSelector[j].getAttribute(attrName) === cookieArr[i]) {
						getAllListSelector[j].innerHTML = selectedShowHtml;
					}
				}
			})(i);
		}
		// 改变对应显示数量
		showNumSelector.innerHTML = cookieArr.length;
	}
};

/**
 * 用于点击按钮时对数组showNumArr数量的增加与删除,用时判断最大值voteMaxNum与最小值voteMinNum,同时改变showNumSelector对应显示数量
 * @param {*} attrName   			// 获取vaId的属性名称
 * @param {*} clickSelector   		// 当前点击的元素
 * @param {*} showNumSelector 		// 显示投票数量的元素
 * @param {*} showNumArr 	  		// 传入投票的数组
 * @param {*} voteMaxNum 	  		// 投票最大数量
 * @param {*} voteMinNum 	  		// 投票最小数量
 * @param {*} cookieName     		//  cookie的名称
 * @param {*} showHtml       		//  按钮显示的html
 * @param {*} selectedShowHtml     //  选中后按钮显示的html
 */
voteCookies.prototype.clickBtnSelect = function (attrName, clickSelector, showNumSelector, showNumArr, voteMaxNum, voteMinNum, cookieName, selectedShowHtml, showHtml, layerType) {
	// 获取属性属性值
	var valId = clickSelector.getAttribute(attrName);

	// 判断当前的属性值是否在数组中，不在数组中将其加入数组，并改变它的html内容；在数组中则其从数组中删除，并改变它的html内容。
	if (showNumArr.indexOf(valId) === -1) {
		this._isMaxNum(showNumSelector, showNumArr, voteMaxNum, valId, clickSelector, showHtml, layerType);
	} else {
		this._isMinNum(showNumSelector, showNumArr, voteMinNum, valId, clickSelector, selectedShowHtml, layerType);
	}

	// 设置cookie
	this.setCookie(cookieName, showNumArr, 10);

};


/**
 * 设置cookie
 * @param {*} cookieName // 传入的cookie名称
 * @param {*} value // 传入的cookie的值
 * @param {*} days // 传入的过期天数
 */
voteCookies.prototype.setCookie = function (cookieName, value, days) {
	var date = new Date();
	date.setDate(date.getDate() + days);
	document.cookie = cookieName + '=' + value.join('|') + ';expires=' + date;
};

/**
 * 判断选中的数量是否为最大值，若为最大值则弹窗提示，否则将选中的值加入显示数组中
 * @param {*} showNumSelector // 显示投票数量的元素
 * @param {*} showNumArr 	  // 传入投票的数组
 * @param {*} voteMaxNum 	 //  投票最大数量
 * @param {*} valId 	 	 //  当前的属性值
 * @param {*} $this 	 	 //  当前的点击的DOM（按钮）
 */
voteCookies.prototype._isMaxNum = function (showNumSelector, showNumArr, voteMaxNum, valId, $this, selectedShowHtml, layerType) {
	if (showNumArr.length <= (voteMaxNum - 1)) {
		showNumArr.push(valId);
		// 对其改变样式html
		$this.innerHTML = selectedShowHtml;
		// 改变对应显示数量
		showNumSelector.innerHTML = showNumArr.length;
	} else {
		// 弹出最小票数提示
		this._layer(layerType, "最大票数提示", "最大票数不能超过", voteMaxNum);
	}
};

/**
 * 判断选中的数量是否小最小值，若为最小值则弹窗提示，否则将选中的值从显示数组中删除
 * @param {*} showNumSelector // 显示投票数量的元素
 * @param {*} showNumArr 	  // 传入投票的数组
 * @param {*} voteMinNum 	 //  投票最小数量
 * @param {*} valId 	 	 //  当前的属性值
 * @param {*} $this 	 	 //  当前的点击的DOM（按钮）
 */

voteCookies.prototype._isMinNum = function (showNumSelector, showNumArr, voteMinNum, valId, $this, showHtml, layerType) {
	if (showNumArr.length > voteMinNum) {
		// 从数组中将当前属性值删除
		showNumArr.splice(showNumArr.indexOf(valId), 1);
		// 对其改变样式html
		$this.innerHTML = showHtml;
		// 改变对应显示数量
		showNumSelector.innerHTML = showNumArr.length;
	} else {
		// 弹出最小票数提示
		this._layer(layerType, "最小票数提示", "最小票数不能小于", voteMinNum);
	}
};

voteCookies.prototype.operation = {
	default: function (title, contentText, number) {
		alert(contentText + number + "票");
	},
	layerPc: function (title, contentText, number) {
		layer.alert(contentText + number + "票", {
			title: title,
			icon: 5
		});
	},
	layerMobile: function (title, contentText, number) {
		layer.open({
			title: title,
			content: contentText + number + "票",
			btn: '确定'
		});
	},
	addOperation: function (name, fn) {
		if (!this[name]) {
			this[name] = fn;
		}
		return this;
	}
};

/**
 * 设置弹出窗
 * @param {number} layerType 弹窗类型
 * @param {string} title 弹窗标题
 * @param {string} contentText 弹窗文字内容
 * @param {number} number 参数
 */
voteCookies.prototype._layer = function (layerType, title, contentText, number) {

	this.operation[layerType](title, contentText, number)
}

/**
 * 获取getAllListSelector所包含的属性标签并将其attr生成一个数组getAllListSelectorArr返回
 * @param {*} getAllListSelectorArr 获取属性标签的父元素
 * @param {*} getAllListSelector 获取返回的数组
 * @param {*} attrName   		 获取vaId的属性名称
 */
voteCookies.prototype._getDataIdArr = function (getAllListSelectorArr, getAllListSelector, attrName) {
	for (var i = 0; i < getAllListSelector.length; i++) {
		getAllListSelectorArr.push(getAllListSelector[i].getAttribute(attrName));
	}
	return getAllListSelectorArr;
};

/**
 * 判断getAllListSelectorArr是否包含cookieArr的所有值，若有不同的值，则将cookieArr中的不同值删除生成新的cookieArr数组进行下一步操作
 * @param {*} cookieArr
 * @param {*} getAllListSelectorArr
 */

voteCookies.prototype._setNewArr = function (cookieArr, getAllListSelectorArr) {
	if (cookieArr.length <= 0) {
		return;
	}

	for (var i = 0; i < cookieArr.length; i++) {
		if (getAllListSelectorArr.indexOf(cookieArr[i]) === -1) {
			cookieArr.splice(cookieArr.indexOf(cookieArr[i]), 1);
			i--;
		}
	}

	return cookieArr;
};

function createVoteCookies() {
	return new voteCookies();
}

module.exports = createVoteCookies;