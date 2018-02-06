var errors = {'1000':'保存数据出错','1001':'请先关注公众号','1002':'您不在投票区域','1003':'活动不在有效状态！','1004':'活动还未开始或已经结束','1005':'所选候选人不存在','1006':'今天投票数已经用完，请明天再来!','1007':'候选人不在该活动名单!'};

$.fn.extend({
	 advLayer:function(t){ 
		 var $target = $(this);
		 $target.show();
        var to = setTimeout(function(){
       	 $target.hide();
        },t);
        $target.find("a.pop_close").click(function(){
       	 $target.hide();
       	 clearTimeout(to);
        });
    }
});


function getCookie(name) {
	return $.cookie(name)?$.cookie(name):null;
}

//判断是在变量1是否在数组里，是返回true,否返回false
function in_array(stringToSearch, arrayToSearch) {
	return ($.inArray(stringToSearch, arrayToSearch) > -1);
}

/**
 * --------------Cookie工具---------------
 */
var CookieUtil = function(){
	this.g_index = 0;
}
CookieUtil.prototype.init = function(){
	this.candidates = new Array();
	var cookie_str = "";
	var list;
	for(var i=1;i<5;i++){
		list = new Array();
		cookie_str = $.cookie("selected_candidate_"+i);
		if(!!cookie_str){
			list = cookie_str.split(",");
			$("#num"+i+" span").text(list.length);
		}
		this.candidates.push(list);
	}
}

CookieUtil.prototype.isIn = function(g,id){
	this.g_index = parseInt(g)-1;
	//console.log(this.candidates[this.g_index]);
	return ($.inArray(id.toString(),this.candidates[this.g_index])>=0);
}

CookieUtil.prototype.remove = function(g,id){
	this.g_index = parseInt(g)-1;
	this.candidates[this.g_index].splice($.inArray(id,this.candidates[this.g_index]),1);
	$.cookie("selected_candidate_"+g,this.candidates[this.g_index],{ 
      　　	expires:30 
    });
	$("#num"+g+" span").text(this.candidates[this.g_index].length);;
}

CookieUtil.prototype.add = function(g,id){
	if(!this.isIn(g,id)){
		this.candidates[this.g_index].push(id);
	}
	$.cookie("selected_candidate_"+g,this.candidates[this.g_index],{ 
      　　	expires: 30
    });
	$("#num"+g+" span").text(this.candidates[this.g_index].length);;
}

CookieUtil.prototype.getSelectedCount = function(g){
	this.g_index = parseInt(g)-1;	
	return this.candidates[this.g_index].length;
}

var cookieUtil = new CookieUtil();
cookieUtil.init();

/**
 * --------------投票工具---------------
 */
var Voter = function(arr) {
	this.max = arr['max'];
	this.min = arr['min'];
	this.length = 0;
}

Voter.prototype = cookieUtil;

Voter.prototype.select = function(obj){
	var $obj = $(obj);
	this.group = $obj.attr("data-group");
	if(!$obj.attr("data-sts")||$obj.attr("data-sts")==0){
		if(this.getSelectedCount(this.group)>=this.max){
			$('#myModal_sub').modal('show');
			return;
		}
		this.add(this.group,$obj.attr("data-id"));
		$obj.html('<span class="glyphicon glyphicon-ok"></span>');
		$obj.attr("data-sts","1");
	}else{
		this.remove(this.group,$obj.attr("data-id"));
		$obj.html('<span class="glyphicon glyphicon-thumbs-up"></span> 投 票');
		$obj.attr("data-sts","0");
	}
}

var voter = new Voter({
	min:$("body").attr("data-min"),
	max:$("body").attr("data-max"),
});

/**
 * -----------候选名单加载-------------
 */
var Loader = function(arr){
	this.btns = $(arr.target);
	this.cur_type = 1;
	this.cur_area = null;
	this.page = 1;
	this.url = arr.url;
	this.token = arr.token;
	this.is_in = arr.is_in;
}

Loader.prototype.load = function(){
  	var loader = this;
  	if(this.cur_area.attr("data-sts")==1||this.cur_area.attr("data-sts")==-1){
  		return;
  	}
  	this.cur_area.attr("data-sts",1);
  	loader.cur_area.find(".loaders").show();
	$.post(this.url,{'_token':this.token,'type':this.cur_type,'page':loader.page},function(data){
		if(data.length>0){
			loader.page++;
			loadCandidate(loader.cur_type,data);
			loader.cur_area.attr("data-sts",0);
			loader.cur_area.find(".loaders").hide();
			if(data.length<6){
				loader.next();
  			}
  		}else{
  	  		loader.next();
  	  	}
	});
}

Loader.prototype.next=function(){
	this.cur_area.attr("data-sts",-1);
	if(this.cur_type<this.btns.length){
		this.cur_type++;
		this.page=1;
		this.cur_area = this.btns.eq(this.cur_type-1);
		this.cur_area.css("display","inline-block");
		this.load();
	}
}

Loader.prototype.init = function(){
  	this.cur_area = this.btns.eq(0);
  	var loader = this;
	$(window).scroll(function () {
	  	//var a = loader.cur_area[0].offsetTop;
	  	if((loader.cur_area.height()-$(window).scrollTop())<$(window).height()){
	  		loader.load();
	  	}
		/*if (a >= $(window).scrollTop() && a < ($(window).scrollTop()+$(window).height())){	
			loader.load();
		}*/
	});	
}

Loader.prototype.createBtn = function(g,id){
	var g_index = parseInt(g)-1;
	var $btn = $('<a href="javascript:;" class="btn btn-danger btn-bgcolor"></a>');
	
	if(!cookieUtil.isIn(g,id)){
		$btn.html('<span class="glyphicon glyphicon-thumbs-up"></span> 投 票');
		$btn.attr("data-sts","0");
	}else{
		$btn.html('<span class="glyphicon glyphicon-ok"></span>');
		$btn.attr("data-sts","1");
	}
	$btn.attr("data-id",id);
	$btn.attr("data-group",g);
	if(this.is_in!=1){
		$btn.click(function(){
			voter.select(this);
		});
	}else{
		$btn.css("display","none");
	}
	return $btn;
}

function loadCandidate(g,data){
	var $li ,$content,$ol,$btn_box,$btn;
	$ul = $("ul[data-group='"+g+"']");
	switch(g){
		case 1:{
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					$li = $('<li class="col-xs-4" data-body="body"></li>');
					$li.append('<div class="picture"><a href="#"><img src="/file/candidate1/'+data[i].cand_ID+'/'+data[i].figure_url+'"></a></div>');
					$content = $('<div class="content"></div>');
					$ol = $('<ol></ol>');
					$ol.append('<li>编号：'+data[i].cand_no+'</li>');
					$ol.append('<li>票数：'+data[i].vote_count+'</li>');
					$ol.append('<li>姓名：'+data[i].real_name+'</li>');
					$ol.append('<li class="note">所属服务组织：'+data[i].org+'</li>');
					$ol.append('<li class="note">主要服务项目：'+data[i].serv_item+'</li>');
					$content.append($ol);
					$btn_box = $('<div class="btn-box"></div>');
					$btn = l.createBtn(1,data[i].cand_ID);
					$btn_box.append($btn);
					$li.append($content);
					$li.append($btn_box);
					$ul.append($li);
				}
			}
			break;
		}
		case 2:{
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					$li = $('<li class="col-xs-4" data-body="body"></li>');
					$li.append('<div class="picture"><a href="#"><img src="/file/candidate2/'+data[i].cand_ID+'/'+data[i].figure_url+'"></a></div>');
					$content = $('<div class="content"></div>');
					$ol = $('<ol></ol>');
					$ol.append('<li>编号：'+data[i].cand_no+'</li>');
					$ol.append('<li>票数：'+data[i].vote_count+'</li>');
					$ol.append('<li class="note">组织名称：'+data[i].org_name+'</li>');
					$ol.append('<li>负责人：'+data[i].leader+'</li>');
					$content.append($ol);
					$btn_box = $('<div class="btn-box"></div>');
					$btn = l.createBtn(2,data[i].cand_ID);
					$btn_box.append($btn);
					$li.append($content);
					$li.append($btn_box);
					$ul.append($li);
				}
			}
			break;
		}
		case 3:{
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					$li = $('<li class="col-xs-4" data-body="body"></li>');
					$li.append('<div class="picture"><a href="#"><img src="/file/candidate3/'+data[i].cand_ID+'/'+data[i].figure_url+'"></a></div>');
					$content = $('<div class="content"></div>');
					$ol = $('<ol></ol>');
					$ol.append('<li>编号：'+data[i].cand_no+'</li>');
					$ol.append('<li>票数：'+data[i].vote_count+'</li>');
					$ol.append('<li class="note">项目名称：'+data[i].serv_name+'</li>');
					$ol.append('<li>负责人：'+data[i].leader+'</li>');
					$content.append($ol);
					$btn_box = $('<div class="btn-box"></div>');
					$btn = l.createBtn(3,data[i].cand_ID);
					$btn_box.append($btn);
					$li.append($content);
					$li.append($btn_box);
					$ul.append($li);
				}
			}
			break;
		}
		case 4:{
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					$li = $('<li class="col-xs-4" data-body="body"></li>');
					$li.append('<div class="picture"><a href="#"><img src="/file/candidate4/'+data[i].cand_ID+'/'+data[i].figure_url+'"></a></div>');
					$content = $('<div class="content"></div>');
					$ol = $('<ol></ol>');
					$ol.append('<li>编号：'+data[i].cand_no+'</li>');
					$ol.append('<li>票数：'+data[i].vote_count+'</li>');
					$ol.append('<li class="note">社区名称：'+data[i].comm_name+'</li>');
					$ol.append('<li>负责人：'+data[i].leader+'</li>');
					$content.append($ol);
					$btn_box = $('<div class="btn-box"></div>');
					$btn = l.createBtn(4,data[i].cand_ID);
					$btn_box.append($btn);
					$li.append($content);
					$li.append($btn_box);
					$ul.append($li);
				}
			}
			break;
		}
	}
}
	


	
	
	//刷新页面
	function reload() {
		window.location.href = '/candidate_list?t=1477707606#ph';
		//window.location.reload(true);
	}
	//提交投票结果，并返回刷新页面
	var able_func = function() {
		var vote_str = vote_arr.join(',');
		var url = '/candidate_list';
		$.post(url, {
			'ids': vote_str //投票的ID
		}, function(data) {
			if (data.result_code == 0) {
				$("#adv2").advLayer(5000);
				setTimeout("reload()", 5000);
			} else {
				alert(errors[data.result_code]);
			}
		});
	}
	
	function getCommentPage($obj){
		var page = $obj.attr("data-page");
		page = !!page?page:0;
		$obj.attr("data-sts",1);
		$obj.text('加载中...');
		$.get($obj.attr("href"),{page:page},function(data){
			$ul = $obj.siblings("ul");
			if(data.length<=0){
				$obj.attr("data-sts",-1);
				$obj.text("没有更多");
				if($ul.find("li").length<=0){
					$ul.append("<li style='text-align:center;font-size:16px;margin-top:10px;'>暂无评论！</li>");
				}
				return;
			}
			$obj.attr("data-sts",0);
			$obj.text("加载更多");
			$obj.attr("data-page",parseInt($obj.attr("data-page"))+1);
			for(var i in data){
				$ul.append('<li>'+data[i].real_name+'留言：</li>');
				$ul.append('<li class="content">'+data[i].content+'</li>');
			}
		});
	}
	
	function getRanking($obj){
		var page = $obj.attr("data-page");
		var t = $obj.attr("data-type");
		page = !!page?page:0;
		$obj.attr("data-sts",1);
		$obj.text('加载中...');
		$.post($obj.attr("href"),{page:page,type:t},function(data){
			if(data.length<=0){
				$obj.attr("data-sts",-1);
				$obj.text("没有更多");
				return;
			}
			$obj.attr("data-sts",0);
			$obj.text("加载更多");
			$obj.attr("data-page",parseInt($obj.attr("data-page"))+1);
			$ul = $obj.siblings("ul");
			switch(t){
				case 1:{
					for(var i in data){
						$ul.append('<li>'+data[i].nickname+'</li>');
						$ul.append('<li class="content">'+data[i].content+'</li>');
					}
				}
			}
		});
	}
		
	//刷新页面跳转到锚点事件
	$(function() {
		if (window.location.hash != "#ph") {
			$("#adv1").advLayer(5000);
		}
		getCommentPage($("#comment_btn"));
		$("#comment_btn").click(function(){
			if($(this).attr("data-sts")==1||$(this).attr("data-sts")==-1){
				return;
			}
			getCommentPage($(this));
		});
		$("a.ranking-btn").each(function(){
			$(this).click(function(){
				if($(this).attr("data-sts")==1||$(this).attr("data-sts")==-1){
					return;
				}
				getRanking($(this));
			});
		});
	});
	
	//点击留言按钮显示留言面板，隐藏留言内容
	$("#vote-message").click(function() {
		$(".message-submit").toggleClass('hidden-xs hidden-sm');
		$(".vote-message").toggleClass('hidden-xs hidden-sm');
	});
	
	
