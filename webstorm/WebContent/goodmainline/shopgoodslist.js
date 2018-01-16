//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
$(document).ready(function(){  
    var range = 50;             //距下边界长度/单位px  
    var elemt = 500;           //插入元素高度/单位px  
    var totalheight = 0;   
    var main = $("#content");                     //主体元素  
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
    async : false  
}); 
var shopNo;
var orderBy="all";
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId+"&shopNo="+shopNo;
}
function showAll(pageNow){
	$.post("../shop/shoporderbygoods.do?shopNo="+shopNo+"&orderBy="+orderBy+"&pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		if(obj && obj.shopgoods){
			maxnum=obj.pageSum;
			$.each(obj.shopgoods,function(i,o){
				$("#goodlist").append($("<li id='li"+o.m_good_id+"'><div class='goodmsg' onclick='showgood("+o.m_good_id+")'><div class='leftdiv' id='left"+o.m_good_id+"'><img src='../good/down.do?filename="+o.m_good_pic+"' class='goodimg'/></div><div class='rightdiv' id='right"+o.m_good_id+"'><div id='goodname'>"+o.m_good_name+o.m_good_no+"</div><div id='miaoshu'>("+o.m_good_color+")</div><div><div class='send'>赠品</div><div class='obj'>返积分</div><div class='rich'><span style='color:#c30404;font-size:1.4rem;' id='price'> ￥"+o.m_good_price+"</span></div></div></div></li>"));
				/*if($("#left"+o.m_good_id).height()>$("#right"+o.m_good_id).height()){
					$("#right"+o.m_good_id).height($("#left"+o.m_good_id).height());
					$("#li"+o.m_good_id).height($("#left"+o.m_good_id).height());
				}else{
					$("#left"+o.m_good_id).height($("#right"+o.m_good_id).height());
					$("#li"+o.m_good_id).height($("#right"+o.m_good_id).height());
				}*/
			});
		}else{
			if(pageNow==1){
				$("section").append($("<img src='../skins/imgs/none.png' id='nomsg'/style=\"width: 40%;margin-top: 10%;margin-left: 30%;padding-bottom:10%;\">"));
			}
			
			
		}
		num=pageNow;
	},'json');
}
function changeOrderBy(ob){
	orderBy=ob;
	$("#goodlist li").remove();
	$("#nomsg").remove();
	showAll(1);
}
$(function(){
	/*$ ('.tab-content').children ('div:gt(0)').hide();*/
    $ ('.tab_tittle div').click (function (){
        $(this).addClass('current').siblings('.current').removeClass('current');});
	$("#goodlist li").remove();
	shopNo=GetQueryString("shopNo");
	showAll(1);
	$("#ordersell").click(function(){
		changeOrderBy("sell");
	});
	$("#orderprice").click(function(){
		changeOrderBy("price");
	});
	$("#cho").click(function(){
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
	});
	$(".choose .com").click(function(){
		$(".choose").hide();
		$("#bg").hide();
		if(this.innerHTML=="综合" || this.innerHTML=="综合排序"){
			orderBy="all";
			$("#cho_text").html("综合排序");
			$("#zh").css("color","#FF620D");
			$("#xp").css("color","black");
			$("#hp").css("color","black");
		}else if(this.innerHTML=="新品优先"){
			orderBy="new";
			$("#cho_text").html("新品优先");
			$("#zh").css("color","black");
			$("#xp").css("color","#FF620D");	
			$("#hp").css("color","black");
		}else{
			orderBy="goodpost";
			$("#cho_text").html("好评率优先");
			$("#zh").css("color","black");
			$("#xp").css("color","black");	
			$("#hp").css("color","#FF620D");	
		}
		
		
		$("#goodlist li").remove();
		$("#nomsg").remove();
		showAll(1);
	});
});