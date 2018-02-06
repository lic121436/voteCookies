# voteCookies
这是个人写的一个在投票页面使用的插件，其主要的目的是 获取cooke值并将其拆分到每个投票按钮上，显示其是否选中，每一个投票项目选中的数量

# 技术栈
这个插件使用纯js来编写，因此不需要引入其它的插件就可以使用

# 项目运行
直接引用build/jquery.voteCookies.js

在<script></script>中注册voteCookies

var voteCookies = window.voteCookies;

# API
1、获取cookie  cookie返回字符串以|分隔如  12|13|14  cooke不存在返回空数组[]

 
__voteCookies().getCookies(cookieName)__




2、设置cookie cooke值以|连接过期天数默认设置10天


__voteCookies().setCookie(cookieName, value, days)__



3、分割cooke返回的数组如果cookieArr存在则将其分割成数组 否则返回一个空数组[]

 
__voteCookies().splitCookies(cookieArr)__



 
4、根据cookie名获取cookie将其分割后在投票列表中找到相同的值，并将投票的按钮html改变，同时在投票数量显示区域，显示投票数量


__voteCookies().showNum(cookieName, getAllBtnList, getAllListSelector, showNumSelector, attrName, selectedShowHtml)__



5、点击投票按钮时对投票按钮进行html变换,同时判断是否为投票的限制的最大投票数量或是最小数量，并将其结果写入cookie中，同时在投票数量显示区域，显示投票数量


 
__voteCookies().clickBtnSelect(attrName, clickSelector, showNumSelector, showNumArr, voteMaxNum, voteMinNum, cookieName, selectedShowHtml, showHtml)__ 

# 本DOM示例
var maxNum = 9, // 设置最大值

     minNum = 5; // 设置最小值
     
var voteCookies = window.voteCookies;

/**
 * 初始化cookie，显示选中，点击选择事件
 * @param {*} cookieName cookie名称
 * @param {*} voteBtnSelectorAll  同类选中按钮的selectorAll
 * @param {*} showNumSelector 显示选中数量的selector
 * @param {*} maxNum 设置最大值
 * @param {*} minNum 设置最小值
 */
 
 
function cookieInit(cookieName, voteBtnSelectorAll, showNumSelector,  maxNum, minNum) {

    var clickAndSelectBtns = document.querySelectorAll(voteBtnSelectorAll),   // 获取投票按钮的DOM
    
        showNumText = document.querySelector(showNumSelector),                // 获取显示投票数量的DOM
        
        attrName = 'data-id',                                                 // 投票选中时获取存入cookie值的属性名称
        
        selectedShowHtml = '<span class="glyphicon glyphicon-ok"></span>',     // 按钮显示的html
        
        showHtml = '<span class="glyphicon glyphicon-thumbs-up"></span> 投票'; // 选中后按钮显示的html
        

    // 获取cookie并将其分割成数组
    
    var showNumArr = voteCookies().splitCookies(voteCookies().getCookies(cookieName));
    
    // 根据cookie显示选中的按钮与数量
    
    voteCookies().showNum(cookieName, clickAndSelectBtns, clickAndSelectBtns, showNumText, attrName, selectedShowHtml);
    

    // 点击按钮时选中或都去除选中按钮，并修改按钮样式，与显示数量
    
    for (var i = 0; i < clickAndSelectBtns.length; i++) {
    
        (function (i) {
        
            clickAndSelectBtns[i].onclick = function () {
            
                voteCookies().clickBtnSelect(attrName, clickAndSelectBtns[i], showNumText, showNumArr, maxNum, minNum, cookieName, showHtml, selectedShowHtml);
            
            }
            
        })(i);
        
    }
    
    return showNumArr;
    
};


// 第一个投票类别

var voteArr1 = cookieInit('voteTest1', '#vote1 li .btn-box a.btn', '#num1 span', maxNum, minNum);

// 第二个投票类别

var voteArr2 = cookieInit('voteTest2', '#vote2 li .btn-box a.btn', '#num2 span', maxNum, minNum);

// 第三个投票类别

var voteArr3 = cookieInit('voteTest3', '#vote3 li .btn-box a.btn', '#num3 span', maxNum, minNum);

// 第四个投票类别

var voteArr4 = cookieInit('voteTest4', '#vote4 li .btn-box a.btn', '#num4 span', maxNum, minNum);

// 第五个投票类别

var voteArr5 = cookieInit('voteTest5', '#vote5 li .btn-box a.btn', '#num5 span', maxNum, minNum);
