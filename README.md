# voteCookies
这是个人写的一个在投票页面使用的插件，其主要的目的是 获取cooke值并将其拆分到每个投票按钮上，显示其是否选中，每一个投票项目选中的数量

## 技术栈
这个插件使用纯js来编写，因此不需要引入其它的插件就可以使用

## 项目运行
直接引用build/jquery.voteCookies.js


var voteCookies = window.voteCookies();

## API
1、获取cookie  cookie返回字符串以|分隔如  12|13|14  cooke不存在返回空数组[]

 
__voteCookies.getCookies(cookieName)__




2、设置cookie cooke值以|连接过期天数默认设置10天


__voteCookies().setCookie(cookieName, value, days)__



3、分割cooke返回的数组如果cookieArr存在则将其分割成数组 否则返回一个空数组[]

 
__voteCookies.splitCookies(cookieArr)__

 

## 本DOM示例


// 第一个投票类别

	var voteArr1 = voteCookies.cookieInit({
	                cookieName: 'voteTest1',
	                voteBtnSelectorAll: '#vote1 li .btn-box a.btn',
	                showNumSelector: '#num1 span',
	                maxNum: maxNum,
	                minNum: minNum
	            });

// 第二个投票类别

 	var voteArr2 = voteCookies.cookieInit({
                        cookieName: 'voteTest2',
                        voteBtnSelectorAll: '#vote2 li .btn-box a.btn',
                        showNumSelector: '#num2 span',
                    });

// 第三个投票类别

	var voteArr3 = voteCookies.cookieInit({
                        cookieName: 'voteTest3',
                        voteBtnSelectorAll: '#vote3 li .btn-box a.btn',
                        showNumSelector: '#num3 span',
                    });

// 第四个投票类别

	var voteArr4 = voteCookies.cookieInit({
                        cookieName: 'voteTest4',
                        voteBtnSelectorAll: '#vote4 li .btn-box a.btn',
                        showNumSelector: '#num4 span',
                    });

// 第五个投票类别

	var voteArr5 = voteCookies.cookieInit({
                        cookieName: 'voteTest5',
                        voteBtnSelectorAll: '#vote5 li .btn-box a.btn',
                        showNumSelector: '#num5 span',
                    });
