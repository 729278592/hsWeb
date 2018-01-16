var act;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function showshops(){
	$("#shoplist li").remove();
	var city=encodeURI(encodeURI( $("#city").html()));
	var town=encodeURI(encodeURI($("#town").html()));
	var area=encodeURI(encodeURI($("#area").html()));
	$.post("../shop/chooseshops.do?city="+city+"&shopTown="+town+"&shopArea="+area,function(obj){
		if(obj && obj.shops){
			$.each(obj.shops,function(i,o){
				$("#shoplist").append($("<li onclick='shopsubmit("+o.m_shopNo+")' id='name"+o.m_shopNo+"'>"+o.m_shopName+"</li>"));
			});
			
		}else{
			$("#shoplist").append($("<li>该区域暂无门店</li>"));
		}
	},'json');
	
}
function showDiv(){
	$("#mydiv").show();
	$("#bg").show();
}
function hideDiv(){
	$("#mydiv").hide();
	$("#bg").hide();
}
var nowshop;
function shopsubmit(shopNo){
	nowshop=shopNo;
	$("#tishi").html($("#name"+shopNo).html());
	showDiv();
	
	/*if(confirm("确认选择"+$("#name"+shopNo).html())){
		if(act=="1"){
			window.location="../seller/zhuce.do?sd="+shopNo;
		}else if(act=="2"){
			window.location="../seller/checksellermsg.do?sd="+shopNo;
		}else if(act == null){
			
			var shopUrl = "../goodml/goToGoodsDetails.do?goodsId="+GetQueryString("goodsId")+"&openId="+GetQueryString("openId")+"&shopName="+encodeURI(encodeURI($("#name"+shopNo).html()));
			
			var affterColor = GetQueryString("affterColor");
			if(affterColor != null && affterColor != "null"){
				affterColor = decodeURI(affterColor);//解码
				shopUrl += "&gc="+encodeURI(encodeURI(affterColor));
			}
			
			var gn = GetQueryString("gn");
			if(gn != null && gn != "null"){
				shopUrl += "&gn="+gn;
			}
			
			window.location = shopUrl;
		}
		
	}*/
}
$(function(){
	act=GetQueryString("act");
	_init_area();
	$("#city").click(function(){
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#city").css("color","#FF620D");
		$("#city").css("border-bottom","0.2rem #ff620d solid");
		$("#citylist").show();
	});
	$("#town").click(function(){
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#town").css("color","#FF620D");
		$("#town").css("border-bottom","0.2rem #ff620d solid");
		$("#townlist").show();
	});
	$("#area").click(function(){
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#area").css("color","#FF620D");
		$("#area").css("border-bottom","0.2rem #ff620d solid");
		$("#arealist").show();
	});
	$("#shop").click(function(){
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#shop").css("color","#FF620D");
		$("#shop").css("border-bottom","0.2rem #ff620d solid");
		$("#shops").show();
	});
	$("#shi").click(function(){
		hideDiv();
		if(act=="1"){
			window.location="../seller/zhuce.do?sd="+nowshop;
		}else if(act=="2"){
			window.location="../seller/checksellermsg.do?sd="+nowshop;
		}else if(act == null){
			
			//modify by zhangzhen:屏蔽无用的get参数
			//var shopUrl = "../goodml/goToGoodsDetails.do?goodsId="+GetQueryString("goodsId")+"&openId="+GetQueryString("openId")+"&shopName="+encodeURI(encodeURI($("#name"+nowshop).html()));
			var shopUrl = "../goodml/goToGoodsDetails.do?goodsId="+GetQueryString("goodsId")+"&shopName="+encodeURI(encodeURI($("#name"+nowshop).html()));
			
			var affterColor = GetQueryString("affterColor");
			if(affterColor != null && affterColor != "null"){
				affterColor = decodeURI(affterColor);//解码
				shopUrl += "&gc="+encodeURI(encodeURI(affterColor));
			}
			
			var gn = GetQueryString("gn");
			if(gn != null && gn != "null"){
				shopUrl += "&gn="+gn;
			}
			
			window.location = shopUrl;
		}
	});
	$("#fou").click(function(){
		hideDiv();
	});
});