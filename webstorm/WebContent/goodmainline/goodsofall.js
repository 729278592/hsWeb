function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
var imgheight = 0;
var floor; //定义楼层
var _asc=2; //定义升序降序
$(document).ready(function(){ 
    var range = 5;             //距下边界长度/单位px  
    var elemt = 500;           //插入元素高度/单位px  
    var totalheight = 0;   
    var main = $("#content");                     //主体元素  
    //判断是否从首页过来的数据
    var _href = window.location.href;
    var _number = _href.indexOf('?search=');
    if(_number>1){
    	_href = _href.substring(parseInt(_number)+8);
        goodName = decodeURI(_href);
        $('#goodname').val(goodName);
    }
    //楼层显示更多
    var _number2 = _href.indexOf('?floorCode=');
    if(_number2>1){
    	floor = _href.substring(parseInt(_number2)+11);
    }
    $(window).scroll(function(){  
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)  
        //console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());  
        //console.log("页面的文档高度 ："+$(document).height());  
        //console.log('浏览器的高度：'+$(window).height());  
          
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {  
           // main.append("<div style='border:1px solid tomato;margin-top:20px;color:#ac"+(num%20)+(num%20)+";height:"+elemt+"' >hello world"+srollPos+"---"+num+"</div>");  
        	num++;
        	if(num <= maxnum){
        		showAll(num);
        	}else{
        		num--;
        	}
     
        }  
    });  
}); 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({  
    async : true  
});  
var goodName="";
var orderBy="all";
function showgood(goodId){
	var indexFlag = $("#listt ul .current").index();
	var backShowFlag = "";
	if(indexFlag == 0){
		backShowFlag = orderBy;
		window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId+"&indexFlag="+indexFlag+"&backShowFlag="+backShowFlag;//如选择得综合排序
	}else{
		window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId+"&indexFlag="+indexFlag;//其它排序
	}
}
function changeOrderBy(ob){
	orderBy=ob;
	$("#goods .share_box").remove();	
	$("#nomsg").remove();
	showAll(1);
}
function changeGoodName(){
	goodName=$("#goodname").val();
	$("#goods .share_box").remove();
	$("#nomsg").remove();
	showAll(1);
}
function showAll(pageNow){
	//防止有些选中数据会变色
	var _url=window.location.search;
	var _num = _url.indexOf('?floorCode');
	_url = _url.substring(_num+11);
	$(".choose ul li").css("background-color","white");
	var gname=encodeURI(gname=encodeURI(goodName));
	if(_url==undefined||_url=='undefined'){
		_url='';
	}
	$.post("../index/showallgoods.do?orderBy="+orderBy+"&pageNow="+pageNow+"&pageSize="+pageSize+"&goodName="+gname+"&floorCode="+_url+"&orderByType="+_asc,function(obj){
		if(obj && obj.goodlist){
			$("#nomsg").remove();
			maxnum=obj.pageSum;
			$.each(obj.goodlist,function(i,o){
				var m_good_name = (o.m_good_name+o.m_good_no);
				//是否有返现
				var _f = o.m_good_buyBack;
				var _show = '';
				if(_f>0){
					_show += '<div class="gift"><a href="">返现</a></div>'; 
				}
				//是否有积分
				var _j = o.m_buy_sendPoints;
				if(_j>0){
					_show += '<div class="zenb"><a href="">返积分</a></div>'; 
				}
				$("#goods").append($("<div class='share_box' onclick='showgood("+o.m_good_id+")'><div class='share_top'><div class='share_img' id='goodimg"+o.m_good_id+"' ></div><div class='share_content'><p class='goodNameStr'  >"+m_good_name+"<br></p><div class='zf'>"+_show+"</div><p class='price'>￥"+o.m_good_price+"</p></div></div></div>"));
				var url="../good/down.do?filename="+o.m_good_pic;
				$("#goodimg"+o.m_good_id).css({"background-image":"url("+url+")"});
			});
		}else{
			if(pageNow==1){
				$("section").append($("<img src='../skins/imgs/none.png' id='nomsg'/>"));
			}
		}
		if(obj.guanggao){
			$("#guanggao").attr("src","../guanggao/down.do?filename="+obj.guanggao.m_ad_pic);
			$("#tourl").attr("href","../"+obj.guanggao.m_ad_url);
		}
		num=pageNow;
	},'json');
}
$(function(){
	$("#back2").click(function(){
		$("#firstpage").click();
	});
	var indexFlag = GetQueryString("indexFlag");
	
	if(indexFlag != null){
		
		//把默认设置的current清除掉
		var liObjs = $("#listt ul li");
		for(var i = 0;i < liObjs.length;i ++){
			liObjs[i].className = "";
		}
		
		//设置上次选中的current
		$("#listt ul li")[indexFlag].className = "current";
		
		
		if(indexFlag == 0){
			orderBy = GetQueryString("backShowFlag");
			if(orderBy == "all"){
				$("#cho_text").html("综合排序");
			}
			
			if(orderBy == "new"){
				$("#cho_text").html("新品优先");
			}
			
			if(orderBy == "goodpost"){
				$("#cho_text").html("好评率优先");
			}
		}
		
		if(indexFlag == 1){
			orderBy = "sell";
		}
		
		if(indexFlag == 2){
			orderBy = "price";
		}
		
	}
	showAll(1);
	$("#ordersell").click(function(){
		changeOrderBy("sell"); //销量升序
	});
	$("#orderprice").click(function(){
		if($(this).parent().hasClass('current')){
			$(this).addClass('re_des');
			_asc=2;
			changeOrderBy("price"); //价格降
		}else{
			$(this).removeClass('re_des');
			_asc=1;
			changeOrderBy("price"); //价格升序
		}
		
	});
	$("#cho").click(function(e){
		$('.tab_tittle ul li').removeClass('current');
		$(this).parent().addClass('current');
		var isShow = $(".choose").is(":visible");
		$(".choose").hide();
		if(isShow){
			$(".choose").hide();
			$("#bg").hide();
			document.ontouchmove=function(){
				return true;
			};
		}else{
			$(".choose").show();
			$("#bg").hide();
			document.ontouchmove=function(){
				return false;
			};
		}
		$(document).one("click", function(){
			$(".choose").hide();
			$("#bg").hide();
	    });
		e.stopPropagation();
	});
	$(".choose .com").click(function(){
		$(".choose").hide();
		$("#bg").hide();
		document.ontouchmove=function(){
			return true;
		};
		if(this.innerHTML=="综合" || this.innerHTML=="综合排序"){
			orderBy="all";
			$("#cho_text").html("综合排序");
			$("#zh").css("color","#389ffe");
			$("#xp").css("color","black");
			$("#hp").css("color","black");
		}else if(this.innerHTML=="新品优先"){
			orderBy="new";
			$("#cho_text").html("新品优先");
			$("#zh").css("color","black");
			$("#xp").css("color","#389ffe");	
			$("#hp").css("color","black");
		}else{
			orderBy="goodpost";
			$("#cho_text").html("好评率优先");
			$("#zh").css("color","black");
			$("#xp").css("color","black");	
			$("#hp").css("color","#389ffe");	
		}
		
		
		$("#goods .share_box").remove();
		$("#nomsg").remove();
		showAll(1);
	});
	$("#serch").click(function(){
		changeGoodName();
	});
	 $ ('.tab-content').children ('div:gt(0)').hide();
     $ ('.tab_tittle ul li').click (function (){
         $(this).addClass('current').siblings().removeClass('current');});
     
});
	//固定Div位置
/*$.fn.smartFloat = function() {
	  var position = function(element) {
	  var top = element.position().top, pos = element.css("position");
	  top-=50;
	  
	  $(window).scroll(function() {
	   var scrolls = $(this).scrollTop();
	   if (scrolls>top) {
	    if (window.XMLHttpRequest) {
	     element.css({
	      position: "fixed",
	      top: 50,
	      right:0,
	      "z-index":120,
	      
	      
	     }); 
	    } else {
	     element.css({ top: scrolls }); 
	    }
	   }else {
	    element.css({ position: pos, top: top}); 
	   }
	  });
	 };
	 return $(this).each(function() {
	  position($(this));      
	 });
	};	*/
var listtH =0;
window.onload = function(){
	imgheight = document.getElementById('guanggao').offsetHeight;
	listtH = document.getElementById('listt').offsetHeight;
	listtH =Number(Number(listtH)+50);
};
window.onscroll = function () { 
	var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
	var heigth = Number(Number(scrolltop)+50);
	/*if(heigth>imgheight){
		$("#listt").css({"position":"fixed","width":"100%","top":"50px"});
		$(".choose").css({"position":"fixed","top": listtH+"px"});
	}else{
		$("#listt").css({"position":"","top":""});
		$(".choose").css({"position":"","top":""});
	}*/
	
};