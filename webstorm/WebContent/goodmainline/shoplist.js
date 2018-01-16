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
var map = new BMap.Map();
var goodId="";
var shopArea="";
var shopType="";
var orderBy="";
var city;
var index=0;//数组下标
var array=new Array();
var map1={};
var map2={};
var map3={};
var lng1;
var lat1;
$.ajaxSetup({  
    async : false  
});   
function mypoint(){
	var geolocation = new BMap.Geolocation();  
	geolocation.getCurrentPosition(function(r){ 
		lng1=r.point.lng;
		lat1=r.point.lat;
		$.post("../baidu/city.do?lng="+lng1+"&lat="+lat1,function(obj){
			city=obj.city;
		},'json');
	});
}
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function showshop(shopNo){
	window.location="../goodml/shop.do?shopNo="+shopNo+"&goodId="+goodId;
}
function showAll(pageNow){
	var city2=encodeURI(encodeURI(city));
	var shopArea2=encodeURI(encodeURI(shopArea));
	var shopType2=encodeURI(encodeURI(shopType));
	$.post("../shop/allorderbyshops.do?goodId="+goodId+"&city="+city2+"&shopArea="+shopArea2+"&shopType="+shopType2+"&pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		maxnum=obj.pageSum;
		if(obj && obj.shoplist){
			$.each(obj.shoplist,function(i,o){
				$("#nomsg").remove();
				var point=new BMap.Point(o.m_shopLng, o.m_shopLat);
				var point2=new BMap.Point(lng1, lat1);
				var s=(map.getDistance(point,point2)/1000).toFixed(2);
				$(".showshop").append($("<li id='li"+o.m_shopNo+"' onclick='showshop("+o.m_shopNo+")'><div class='leftdiv' id='left"+o.m_shopNo+"'><img src='../good/shopdown.do?filename="+o.m_shopPic+"' class='shopimg'/></div><div class='middlediv' id='middle"+o.m_shopNo+"'><div class='shopname'>"+o.m_shopName+"</div><div class='shopstar' id='star"+o.m_shopNo+"'></div><div class='shoptype'><div class='shoptype_msg'>"+o.m_shopType+"</div></div><div class='shopaddr'>"+o.m_shopCity+o.m_shopTown+o.m_shopArea+o.m_shopAddr+"</div></div><div class='rightdiv' id='right"+o.m_shopNo+"'><div id='juli"+o.m_shopNo+"'>"+s+"km</div></div></li>"));
				for(j=1;j<=o.m_shopFraction;j++){
					$("#star"+o.m_shopNo).append($("<img src='../skins/personcenter/img/star1orange.png' class='star'/>"));
				}
				$("#star"+o.m_shopNo).append($("<span>"+o.m_shopFraction+"</span>"));
				/*if($("#left"+o.m_shopNo).height()>$("#middle"+o.m_shopNo).height()){
					$("#li"+o.m_shopNo).height($("#left"+o.m_shopNo).height());
				}else{
					$("#li"+o.m_shopNo).height($("#middle"+o.m_shopNo).height());
				}*/
				 array[index]=s;
			     map1[s+""]=$("#li"+o.m_shopNo).html();
			     map2[s+""]=$("#li"+o.m_shopNo).height();
			     map3[s+""]= o.m_shopNo;
			     index++;
			});
		}else{
			if(pageNow==1){
				$(".content").append($("<img src='../skins/imgs/none.png' id='nomsg'/>"));

			}
			
		}
		num=pageNow;
		
	},'json');
}
function chooseArea(){
	var isShow = $("#choosearea").is(":visible");
	$(".choose").hide();
	if(isShow){
		$("#choosearea").hide();
		$("#bg").hide();
	}else{
		$("#choosearea").show();
		$("#bg").show();
	}
}
function chooseShopType(){
	var isShow = $("#chooseshop").is(":visible");
	$(".choose").hide();
	if(isShow){
		$("#chooseshop").hide();
		$("#bg").hide();
	}else{
		$("#chooseshop").show();
		$("#bg").show();
	}
	$("#shoplist li").css("background-color","white");
}
function chooseOrderBy(){
	var isShow = $("#chooseorderby").is(":visible");
	$(".choose").hide();
	if(isShow){
		$("#chooseorderby").hide();
		$("#bg").hide();
	}else{
		$("#chooseorderby").show();
		$("#bg").show();
	}
	$("#orderbylist li").css("background-color","white");
}
function closeChoose(){
	$(".choose").hide();
	$("#bg").hide();
}
function changeArea(num){
	$(".choose").css("color","black");
	$("#arealist li").css("color","black");
	$("#cityy").css("color","black");
	$("#area"+num).css("color","#FF620D");
	$("#area").html($("#area_text"+num).html()).css("color","#FF620D");
	if($("#area_text"+num).html()==city && $("#area_text"+num).html()=="区域选择"){
		shopArea="";
	}else{
		shopArea=$("#area_text"+num).html();
	}
	$(".showshop li").remove();
	$("#nomsg").remove();
	index=0;
	array=new Array();
	map1={};
	map2={};
	showAll(1);
}
function changeShopType(th){
	if(th.innerHTML=="全部门店"){
		shopType="";
		$("#shop").html("全部门店").css("color","black");
	}else{
		shopType=th.innerHTML;
		$("#shop").html(shopType).css("color","#FF620D");
	}
	$(".showshop li").remove();
	$("#nomsg").remove();
	$("#shoplist li p").css("color","black");
	$(th).css("color","#FF620D");
	index=0;
	array=new Array();
	map1={};
	map2={};
	showAll(1);
}
function changeOrderBy(th){
	$("#orderby").html(th.innerHTML).css("color","#FF620D");
	if(th.innerHTML=="默认排序"){
		orderBy="";
		$("#orderby").html(th.innerHTML).css("color","black");
	}else if(th.innerHTML=="附近优先"){
		orderBy="fujin";
	}else if(th.innerHTML=="好评率优先"){
		orderBy="goodpost";
	}
	$("#orderbylist li p").css("color","black");
	$(th).css("color","#FF620D");
	if(orderBy=="fujin"){
		array.sort(function(a,b){
			return a-b;
		});
		$(".showshop li").remove();
		for(var i=0;i<array.length;i++){
			var o=map1[array[i]+""];		
			$(".showshop").append($("<li id='li"+i+"' onclick='showshop("+map3[array[i]+""]+")'>"+o+"</li>"));
			$("#li"+i).height(map2[array[i]+""]);
		}
	}else{
		$(".showshop li").remove();
		$("#nomsg").remove();
		index=0;
		array=new Array();
		map1={};
		map2={};
		showAll(1);
	}
	
}
function shopAreaBack(th){
	shopArea="";
	$(".choose").css("color","black");
	$("#arealist li").css("color","black");
	$("#area").html(city).css("color","#FF620D");
	$("#cityy").css("color","#FF620D");
	$(".showshop li").remove();
	$("#nomsg").remove();
	index=0;
	array=new Array();
	map1={};
	map2={};
	showAll(1);
}
function loadArea(city){
	var city2=encodeURI(encodeURI(city));
	var shopArea2=encodeURI(encodeURI(shopArea));
	var shopType2=encodeURI(encodeURI(shopType));
	$("#arealist li").remove();
	$.post("../shop/allorderbyshops.do?goodId="+goodId+"&city="+city2+"&shopArea="+shopArea2+"&shopType="+shopType2,function(obj){
		
		if(obj && obj.shoplist){
			$("#arealist").append($("<li onclick='shopAreaBack()' id='cityy'><div class='area_left'>"+city+"</div><div class='area_right'>"+obj.count+"</div></li>"));
			if(obj.arealist){
				$.each(obj.arealist,function(i2,o2){
					$.post("../shop/areashops.do?shopArea="+encodeURI(encodeURI(o2))+"&goodId="+goodId,function(obj2){
						$("#arealist").append($("<li id='area"+i2+"' onclick='changeArea("+i2+")'><div class='area_left' id='area_text"+i2+"'>"+o2+"</div><div class='area_right'>"+obj2.count+"</div></li>"));
					},'json');
					
				});
			}
		}
		if(obj && obj.good){
			$("#good_img").attr("src","../good/down.do?filename="+obj.good.m_good_pic);
			$("#goodname").html(obj.good.m_good_name+obj.good.m_good_no);
			$("#gooddes").html(obj.good.m_good_des);
			$("#price").html("￥"+obj.good.m_good_price);
			$("footer").show();
		}
	},'json');
}
function tonext(){
	if(lng1==null || lat1==null || city==null){
		setTimeout("tonext()", 200);
	}else{
		showAll(1);
		loadArea(city);
	}
}
$(function(){
	goodId=GetQueryString("goodId");
	mypoint();
	tonext();
	$(".choose").height(document.body.clientHeight-$(".heads").height()-$(".title").height());
	$(".showshop li").remove();	
	$(".title_left").click(function(){
		chooseArea();
	});
	$(".choose").click(function(){
		closeChoose();
	});
	$(".title_middle").click(function(){
		chooseShopType();
	});
	$(".title_right").click(function(){
		chooseOrderBy();
	});
	$("#chooseshop .com").click(function(){
		changeShopType(this);
	});
	$("#chooseorderby .com").click(function(){
		changeOrderBy(this);
	});
	$("#zhoubian").click(function(){
		/*var url="../goodml/shopmap.do";
		if(goodId!=null && goodId.length>0){
			url+="?gd="+goodId;
		}
		window.location=url;*/
		self.location=document.referrer;
	});
});