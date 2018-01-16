var goodId;
var shopid;
var map = new BMap.Map();
var f_s;
var f_c;
var lng1;
var lat1;
var addr;
var city;

var uid;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function goback(){
	history.go(-1);
	return false;
}
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId+"&shopNo="+shopid;
}
function showShop(shopNo){
	$.post("../shop/oneshop.do?shopNo="+shopNo,function(obj){
		if(obj && obj.shop){
			city=obj.shop.m_shopTown;
			addr=obj.shop.m_shopCity+obj.shop.m_shopTown+obj.shop.m_shopArea+obj.shop.m_shopAddr;
			f_s=obj.share;
			f_c=obj.mc;
			if(f_c=="1"){
				$("#s_star").attr("src","../skins/goodmainline/img/wujiaoxing.png");
			}
			var urlmsg="url('../good/shopdown.do?filename="+obj.shop.m_shopPic+"')";
			$(".head").css("background-image",urlmsg);
			if(obj.shop.m_shopType!=null && obj.shop.m_shopType.length>0){
				$("#shoptype").html(obj.shop.m_shopType);
			}else{
				$("#shoptype").hide();
			}
			$("#shopname").html(obj.shop.m_shopName);
			/*去除"有限公司"*/
			var name2=$("#shopname");
			name2.html(name2.html().replace("有限公司",""));	
			var str = $("#shopname").html();
			var last = 0;
			var tempC=0;
			var tempA=1;
			for(var i =0;i<str.length;i++)
			{
				//当字符是汉字的时候就累计
				if(str.charCodeAt(i)>255){
					if(last<40){
						tempC +=1;
					}
					last += 2;
				}else{
					if(last<40){
						tempA +=1;
					}
					last +=1;
				}
			}
			if(tempC>18){
				str = str.substring(0,18)+"...";
			}else if(tempA>40){
				str = str.substring(0,40)+"...";
			}else if((tempC*2+tempA)>40){
				str = str.substring(0,40-tempC)+"...";
			}
			$("#shopname").html(str);
			$(".pingfen").html(obj.shop.m_shopFraction);
			$("#addr").html(obj.shop.m_shopCity+obj.shop.m_shopTown+obj.shop.m_shopArea+obj.shop.m_shopAddr);
			$("#worktime").html("营业时间&nbsp;&nbsp;&nbsp;<span id='wt'>"+obj.shop.m_shopWorkTime+"</span>");
			if(obj.shop.m_shopWorkTime==null ||obj.shop.m_shopWorkTime==""){
				$('#wt').html("未知");
			}
			$("#call").attr("href","tel:"+obj.shop.m_shopTel);
			var point=new BMap.Point(obj.shop.m_shopLng, obj.shop.m_shopLat);
			var geolocation = new BMap.Geolocation();  
			geolocation.getCurrentPosition(function(r){
				lng1=r.point.lng;
				lat1=r.point.lat;
				s=(map.getDistance(point,r.point)/1000).toFixed(2);
				$("#juli").html(s+"km");
				$("#daohang").show();
			});
			if(obj.shop.m_shopPayType !=null && obj.shop.m_shopPayType !=""){
				var strs=obj.shop.m_shopPayType.split(",");
				for(i=0;i<strs.length;i++){
					$("#paytype").append($("<span style='margin-left:10px;'><img src='../skins/personcenter/img/select_yes.png' width='15' />"+strs[i]+"</span>"));
				}
			}
			
			for(i=1;i<=obj.shop.m_shopFraction;i++){
				$("#star").append($("<img src='../skins/goodmainline/img/wujiaoxing.png' style='width:15px;margin-left:3px;'/>"));
			}
			$.post("../shopgoods/tuijian.do?shopNo="+shopNo,function(obj){
				if(obj && obj.goodlist){
					$("#goodlist li").remove();
					$.each(obj.goodlist,function(i,o){
						$("#goodlist").append($("<li id='li"+i+"'><div class='goodmsg' onclick='showgood("+o.m_good_id+")'><div><div class='leftdiv' id='left"+i+"'><img src='../good/down.do?filename="+o.m_good_pic+"' class='goodimg'/></div><div class='rightdiv' id='right"+i+"'><div id='goodname'>"+o.m_good_name+o.m_good_no+"</div><div id='miaoshu'>("+o.m_good_color+")</div><div><span class='send'>赠品</span><span class='obj'>返 积分</span></div><div><span style='color:red;' id='price'> ￥"+o.m_good_price+"</span></div></div></div></li>"));
						if($("#left"+i).height()>$("#right"+i).height()){
							$("#right"+i).height($("#left"+i).height());
							$("#li"+i).height($("#left"+i).height());
						}else{
							$("#left"+i).height($("#right"+i).height());
							$("#li"+i).height($("#right"+i).height());
						}
					});	
				}else{
					$("#goodlist").append($("<li><img src='../skins/imgs/none.png' id='nomsg' style='width:40%;margin-top:10%;margin-left:30%;'/></li>"));
				}
				
			},'json');
		}
	},'json');
}
function daohang(){
	if(lng1!=null && lat1!=null && addr !=null){
		window.location="http://api.map.baidu.com/direction?origin=latlng:"+lat1+","+lng1+"|name:我的位置&destination="+addr+"&mode=driving&region="+city+"&output=html&src=yourCompanyName|yourAppName";
	}else{
		setTimeout("daohang()", 50);
	}
}
function connectweixin(){
	$.ajaxSetup({  
	    async : false  
	});  
	var timestamp;
	var sign;
	var url="../weixin/key.do";	
	var appId;
	var signature;
	var nonceStr;
	var access_token;
	var shopimg="http://"+hs_url+"/mxj/skins/share/img/share.jpg";
	$.ajax({ //请求类型，这里为POST 
		type: 'POST', 
		url: url , 
		data:{"nowurl":location.href},
		cache:true, 
		dataType:"json",
		ContentType: "application/json",
		success: function(data){ 
		d=eval("("+data.key+")");
		timestamp=data.timestamp;
		sign=data.sign;	
		signature=data.signature;
		nonceStr=data.nonceStr;
		appId=d.msg.appId;
		//access_token=d.msg.token.access_token;	
		},
		error:function(){
			alert("获取失败");
		}
	});
	wx.config({
	    debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: appId, // 必填，公众号的唯一标识
	    timestamp:timestamp , // 必填，生成签名的时间戳
	    nonceStr: nonceStr, // 必填，生成签名的随机串
	    signature: signature,// 必填，签名，见附录1
	    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.error(function(res){
		alert(res.errMsg);
	});
	wx.ready(function(){
		//old request var fxUrl = "http://" + hs_url + "/web/userShare/html/secondbk3.html?fId=" + uid + "&t=s_" + shopid + "&showUrl=http://"+hs_url+"/mxj/goodml/shop.do?shopNo="+shopid;
		var fxUrl = share_url + "/secondbkAll.html?fId=" + uid + "&t=s_" + shopid + "&type=" + share_type_store + "&showUrl=http://"+hs_url+"/mxj/goodml/shop.do?shopNo="+shopid;
		wx.onMenuShareAppMessage({
		    title: 'HC门店:'+$("#shopname").html(), // 分享标题
		    desc: 'HC硕粉俱乐部优秀门店分享', // 分享描述
		    link: fxUrl, // 分享链接
		    imgUrl: shopimg, // 分享图标
		    type: 'link', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
			//alert("分享成功");
		        // 用户确认分享后执行的回调函数
		    	addshare();
		    },
		    cancel: function () { 
		    	Message.showNotify("已取消!",3000);
		        // 用户取消分享后执行的回调函数
		    },fail:function(){
		    	Message.showNotify("分享失败!",3000);
		    }
		});
		wx.onMenuShareTimeline({
		    title: 'HC门店:'+$("#shopname").html(), // 分享标题
		    link: fxUrl, // 分享链接
		    imgUrl: shopimg, // 分享图标
		    success: function () {
			//alert("分享成功");
		        // 用户确认分享后执行的回调函数
		    	addshare();
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	Message.showNotify("已取消!",3000);
		    },fail:function(){
		    	Message.showNotify("分享失败!",3000);
		    }
		});
	});
}
/*function addshare(){
	if(f_s == "0"){
		$.post("../share/add.do?type=shop&id="+shopid,function(obj){
			f_s="1";
		},'json');
	}
	alert("分享成功!");
}*/

function addshare(){
	$.post("../share/add.do?type=shop&id="+shopid,function(obj){
		if(obj.message == 'success'){
			Message.showNotify("分享成功!",3000);
		}else{
			Message.showNotify("分享失败!",3000);
		}
	},'json');
}

$(function(){
	
	var shopNo=GetQueryString("shopNo");
	shopid=shopNo;
	goodId=GetQueryString("goodId");
	showShop(shopNo);
	connectweixin();
	$("#yuyue").click(function(){
		$("#sellerlist li").remove();
		if(goodId=="0"){
			$(".goodmsg2").hide();
		}else{
			$.post("../shop/good.do?goodId="+goodId,function(obj){
				if(obj && obj.good){
					$(".goodimg2").attr("src","../good/down.do?filename="+obj.good.m_good_pic);
					$("#goodName").html(obj.good.m_good_name+obj.good.m_good_no);
					$("#gooddes").html(obj.good.m_good_des);
					$("#price_show").html("￥"+obj.good.m_good_price);
					$(".goodmsg2").show();
				}
				
			},'json');
		}
		$.post("../seller/shopsellers.do?shopNo="+shopNo,function(obj2){
			if(obj2 && obj2.sellers){
				$.each(obj2.sellers,function(i,o){
					$("#sellerlist").addClass("ou");
					$("#sellerlist").append($("<li ><div class='seller_msg'><div class='seller_img'><a href='../seller/sellerinfo.do?sd="+o.m_seller_id+"'><img src='../seller/down.do?filename="+o.m_seller_pic+"' class='sellerimg'/></a></div><div class='seller_msg_des'><div class='typlr'><span>"+o.m_seller_name+"</span><span style='display:inline-block;' class='grade'>金牌</span></div><div class='typlm' id='star"+i+"'></div><div class='hert'><span>产品体验<span id='tiyan"+i+"'></span>次</span></div></div><div class='seller_act'><div class='seller_sign'><a href='tel:"+o.m_seller_phone+"'><img src='../skins/personcenter/img/sales_phone.png' class='sign'/></a><a href='sms:"+o.m_seller_phone+"'><img src='../skins/personcenter/img/sales_messages.png' class='sign'/></a></div></div></div></li>"));
					for(var q=1;q<=o.m_seller_fraction;q++){
						$("#star"+i).append($("<img src='../skins/personcenter/img/star1orange.png' class='seller_star'/>"));
					}
					$("#star"+i).append($("<span style='color:orange;position:relative;bottom:0.2em;left:0.2em;'>"+o.m_seller_fraction+"</span>"));
					$.post("../seller/ticount.do?sellerId="+o.m_seller_id,function(objj){
						$("#tiyan"+i).html(objj.ticount);
					},'json');
				});
			}else{
				$("#sellerlist").append($("<li class='fixed'>该门店暂无销售代表</li>"));
			}
		},'json');
		$(".seller").show();
		$(".bg").show();
		$("body").css({"width":"100%","height":"100%","overflow":"hidden","position":"fixed","margin":"0 auto"});
		/*var a=$(".seller").height();
		alert(a);*/
		var a=$(".goodmsg2").css('display');
		
		
		if(a=='block'){
			
			var Height=$(".goodmsg2").height()+258;
			
			$(".seller").css("max-height",Height+"px");
		}else{
			$(".seller").css("max-height","258px");
		}
	});
	$('#bg').click(function(){
		//$('#sellerlist').css("display","none");
		$('#bg').css("display","none");
		$('.seller').css("display","none");
		
		$("body").css({"overflow":"visible","position":"relative"});
		$("body").css({"height":""});
		
		
	});	
	//收藏
	$("#shoucang").click(function(){
		/*if(f_c=="0"){
			$.post("../shoucang/add.do?type=shop&id="+shopNo,function(obj){
				$("#s_star").attr("src","../skins/goodmainline/img/wujiaoxing.png");
				f_c="1";
				alert(obj.msg);
			},'json');
		}else{
			alert("您已经收藏过了");
		}*/
		
		$.post("../shoucang/addGoodsColl.do?type=shop&id="+shopNo,function(obj){
			if(obj.message == 'success'){
				$("#s_star").attr("src","../skins/personcenter/img/star1orange.png");
				$("#save").text('已收藏');
			}else{
				$("#s_star").attr("src","../skins/personcenter/img/star2null.png");
				$("#save").text('收藏');
			}
		},'json');
		
	});
	/*$("#shoucang").click(function() {
		  if ($("#save").text() == '收藏' ) {
		    $("#save").text('已收藏');
		  } else {
		    $("#save").text('收藏');
		  }

		});*/
	
	$("#share").click(function(){
		$('#showDownInfo').css("display","block");
		document.ontouchmove=function(){
			return false;
		};
	});
	/*$("#showDownInfo").click(function(){
		if($("#showDownInfo")[0].style.display=="none"){
			$("#showDownInfo")[0].style.display="block";
			$("#shandow")[0].style.display="block";
		}else{
			$("#showDownInfo")[0].style.display="none";
			$("#shandow")[0].style.display="none";
		}
	});*/
	/*$('#bg').click(function(){
		//$('#sellerlist').css("display","none");
		$('#bg').css("display","none");
		$('.seller').css("display","none");
	});*/
	
	$("#daohang").click(function(){
		daohang();
	});
	$("#allgoods").click(function(){
		window.location="../goodml/shopgoodslist.do?shopNo="+shopNo;
	});
	$(".goodimg2").click(function(){
		showgood(goodId);
	});
	
	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});
	
});
