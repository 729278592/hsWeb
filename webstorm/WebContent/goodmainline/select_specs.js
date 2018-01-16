function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


$(document).ready(function(){
	
	var goodsId = GetQueryString("goodsId");//商品主键
	var affterColor = GetQueryString("gc");//选择之后的颜色
	var affterNum = GetQueryString("gn");//选择之后的商品数量

	//地址
	var shopName = GetQueryString("shopName");
	var proName = GetQueryString("proName");
	var cityName = GetQueryString("cityName");
	
	//解码get请求
	proName = decodeURI(proName);
	cityName = decodeURI(cityName);
	shopName = decodeURI(shopName);
	
	$.ajax({
		url : '../goodml/loadGoodsColor.do',
		data : {"goodsId":goodsId},
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(result){
			
			//第一次进来为null,购买数量
			if(affterNum != null){
				$("#goodsNum").text(affterNum);
			}
			
			//第一次进来为null,就不进行解码了
			if(affterColor != null){
				affterColor = decodeURI(affterColor);//对商品颜色进行解码	
			}
			
			var newOldPrice = result.goods.m_good_price;//新价格
			
			if(result.goods.m_good_price == null && result.goods.m_good_del_price != null){
				newOldPrice = result.goods.m_good_del_price;//旧价格
			}
			
			var gInit = "<div class='goods_img'><img src='../good/down.do?filename="+result.goods.m_good_pic+"' width='76' height='76'></div>" +
			"<p>"+result.goods.m_good_name+"<br><span>￥"+newOldPrice+"</span></p>";
			
			$("#goodsInit").html(gInit);
			
			
			var gc = "<p>颜色</p>";
			if(result.goods != null && result.goods != undefined){
				var colors = result.goods.m_good_color.split(",");
				for(var i = 0;i < colors.length;i ++){
					if(affterColor != null && affterColor == colors[i]){
						gc += "<a href='javascript:void(0);' class='se_co currenta'><span>"+colors[i]+"</span></a>";
					}else{
						if(affterColor == null && i == 0){
							gc += "<a href='javascript:void(0);' class='se_co currenta'><span>"+colors[i]+"</span></a>";
						}else{
							gc += "<a href='javascript:void(0);' class='se_co'><span>"+colors[i]+"</span></a>";
						}
					}
				}
			};
			$("#goodsColor").html(gc);

			if(result.goods.m_purchase > 0){
				$("#xgNum").val(result.goods.m_purchase);
				$("#warn").text("每人限购"+result.goods.m_purchase+"件");
			}
			
			//是否收藏该商品
			if(result.collFlag){
				$("#scGoods img").attr("src","../skins/goodmainline/img/wujiaoxing.png");
			}
			
			if(result.goods.m_good_from == '线下'){
				$("footer").append('<div class="f3" id="ddsw"><span>到店试玩</span></div><div class="f4" id="ljgm"><span>立即购买</span></div>');	
			}else{
				
				if(result.stockFlag){
					$("footer").append('<div class="f4" id="ljgm"><span>立即购买</span></div>');
				}else{
					$("footer").append('<div class="f4" id="ljgm" style="background-color: #389ffe;"><span>立即购买</span></div>');
				}
				
			}
		}
	});
	
	//返回页面
	$("#backPage").click(function(){
		/*var gc = $(".currenta span").text();//选择的颜色
		var gn = $("#goodsNum").text();//商品数量
		gc = encodeURI(encodeURI(gc));//转码get请求
		
		proName = encodeURI(encodeURI(proName));
		cityName = encodeURI(encodeURI(cityName));
		shopName = encodeURI(encodeURI(shopName));
		//modify by zhangzhen:去掉无用的get参数
		var goToUrl = "../goodml/goToGoodsDetails.do?goodsId="+goodsId+"&gc="+gc+"&gn="+gn+"&uid="+GetQueryString("uid")+"&proName="+proName+"&cityName="+cityName+"&shopName="+shopName;
		
		/*if(shopName != null && shopName != "null"){
			goToUrl += "&shopName="+encodeURI(encodeURI(shopName));;
		}
		
//		goToUrl += "&goToUrl="+ GetQueryString("goToUrl");
		window.location.href = goToUrl;*/
		history.go(-1);
		return false;
	});
	
	//选择颜色
	$(".se_co").click(function(){
		$(this).addClass('currenta').siblings('.currenta').removeClass('currenta');
	});
	
	$(".value3,.value5").hover(function(){
		$(this).css({"background-color":"#cacaca"});
	},function(){
		$(this).css({"background-color":"#eee"});
	});
	
	//加法
	$(".value5").click(function(){
		var gn = $("#goodsNum");
		var ngn = parseInt(gn.text()) + 1;
		
		//限购数量
		var xgNumv = $("#xgNum").val();
		
		if(xgNumv != "0"){
			if(ngn <= parseInt(xgNumv)){
				gn.text(ngn);
			}
		}else{
			gn.text(ngn);
		}
		
	});
	
	//减法
	$(".value3").click(function(){
		var gn = $("#goodsNum");
		if(parseInt(gn.text()) > 1){
			var ngn = parseInt(gn.text()) - 1;
			gn.text(ngn);
		}
	});
	
	//立即购买
	$("#ljgm").click(function(){
		
		$.ajax({
			url : '../goodml/queryShopMsg.do',
			data : {"proName":proName,"cityName":cityName,"areaName":shopName,"goodsId":goodsId},
			type : 'post',
			dataType : 'json',
			success : function(result){
				
				if(result.code == 'success'){
					
					var gdColor = '';
					//遍历颜色
					$("#goodsColor a").each(function(){
						if(this.className == "se_co currenta"){
							gdColor = this.text;
						}
					});
					
					var gdNum = $("#goodsNum").text();
					
					window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(gdColor))+"&goodsNum="+gdNum+"&goodsId="+goodsId;
					
				}else{
					Message.showNotify(result.objs,3000);
				}
			}
		});
		
	});
	
	//收藏该商品信息
	$("#scGoods").click(function(){
		$.ajax({
			url :'../shoucang/addGoodsColl.do',
			data :{"id":goodsId,"type":"good"},
			async : false,
			type : 'POST',
			dataType :'json',
			success : function(result){
				if(result.message == 'success'){
					//收藏
					$("#scGoods img").attr("src","../skins/personcenter/img/star1orange.png");
					$('#scGoods p').text('已收藏');
					
				}else{
					$("#scGoods img").attr("src","../skins/personcenter/img/star2null.png");
					$('#scGoods p').text('收藏');
				}
			}
		});
	});
	
	//到店试玩
	$("#ddsw").click(function(){
		window.location.href = "../goodml/shopmap.do?gd="+goodsId;
	});
	
	/*//显示分享
	$("#showDownInfo").click(function(){
		var divobjs = document.getElementById("showDownInfo");
		
		if(divobjs.style.display == "none"){
			
			divobjs.style.display = "block";
		}else{
			divobjs.style.display = "none";
		}
	});*/
	
	
	//分享
	$("#fxGoods").click(function(){
		$('#showDownInfo').css("display","block");
		document.ontouchmove=function(){
			return false;
		};
	});
	
	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});

	
});		




