var act;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/*function showshops(){
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
	
}*/

function readInfo(proName,cityName,areaName){
	/*$.ajax({
		url : '../goodml/queryShopMsg.do',
		data : {"proName":proName,"cityName":cityName,"areaName":areaName,"goodsId":GetQueryString("goodsId")},
		type : 'POST',
		dataType : 'json',
		success : function(result){
			if(result){*/
				var shopUrl = "../goodml/goToGoodsDetails.do?goodsId="+GetQueryString("goodsId")+"&uid="+GetQueryString("uid")+
				"&shopName="+encodeURI(encodeURI(areaName))+
				"&proName="+encodeURI(encodeURI(proName))+
				"&cityName="+encodeURI(encodeURI(cityName));
				
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
				
		/*	}else{
				alert("该区域暂无货源");
			}
		}
	});*/
}
function shopsubmit(shopNo){
	if(confirm("确认选择"+$("#name"+shopNo).html())){
		if(act=="1"){
			window.location="../seller/zhuce.do?sd="+shopNo;
		}else if(act=="2"){
			window.location="../seller/checksellermsg.do?sd="+shopNo;
		}else if(act == null){
			
			var shopUrl = "../goodml/goToGoodsDetails.do?goodsId="+GetQueryString("goodsId")+"&uid="+GetQueryString("uid")+"&shopName="+encodeURI(encodeURI($("#name"+shopNo).html()));
			
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
		
	}
}
$(function(){
	//start 固定标签页 
	window.onscroll = function () {  
		$(".adress_name").css({"position":"fixed","width":"100%","top":"0"});
		if($(document).scrollTop()<40){
			$(".adress_name").css("position","relative");
		}
    };
    //end
    
	act=GetQueryString("act");
	_init_area();
	$("#city").click(function(){
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#city").css("color","#FF620D");
		$("#city").css("border-bottom","0.1rem #ff620d solid");
		$("#citylist").show();
	});
	$("#town").click(function(){
		$(".adress_name").css("position","relative");
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#town").css("color","#FF620D");
		$("#town").css("border-bottom","0.1rem #ff620d solid");
		$("#townlist").show();
	});
	$("#area").click(function(){
		$(".adress_name").css("position","relative");
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#area").css("color","#FF620D");
		$("#area").css("border-bottom","0.1rem #ff620d solid");
		$("#arealist").show();
	});
	$("#shop").click(function(){
		$(".adress_name").css("position","relative");
		$(".adress_list").hide();
		$(".adress_name li").css("color","#505050");
		$(".adress_name li").css("border-bottom","0.1rem #e5e5e5 solid");
		$("#shop").css("color","#FF620D");
		$("#shop").css("border-bottom","0.1rem #ff620d solid");
		$("#shops").show();
	});
	
});