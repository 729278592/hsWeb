var d;
var ur;
var openId = "";

var bpage = 1;
var pageCount = 0;//总记录数

$(function() {
	setTimeout(function(){
		//加载周报数据
		timeline();
	},0);
	
	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});
	
	$('#add').click(function(){
		share();
	});
	var activity = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction : false,
        autoplay: 3000 
	});
	
	// 加载数据
	load();
	/*var swiper = new Swiper('.menu_title', {
		pagination : '.swiper-pagination',
		loop : false,
		onTouchEnd : function(swiper, even) {
		}
	});*/

	$("#return2").click(function() {
		//history.go(-1);
		window.location.href = "../goodml/mine.do";
		return false;
	});

	$(".effect_right").click(function() {
		window.location.href = "../effect/goToRanking.do";
	});

	$("#effectforme").click(function() {
		window.location.href = "../effect/descPage.do?type=6";
	});

	$("#partenerforme").click(function() {
		window.location.href = "../effect/descPage.do?type=1";
	});

	/* 云弹出 
	$("#shandow").click(function() {
		alert(5);
		$("#shandow").hide();
		$("#showDownInfo").hide();
		document.ontouchmove=function(){
			return true;
		};
	});*/
   //微信分享
	$.ajax({
		url : '../weixin/key.do',
		data :{"nowurl":window.location.href},
		type : 'POST',
		dataType : 'json',
		async : true,
		success :function(result){
			
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: hs_appId, // 必填，公众号的唯一标识
			    timestamp: result.timestamp, // 必填，生成签名的时间戳
			    nonceStr: result.nonceStr, // 必填，生成签名的随机串
			    signature: result.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline']  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			
			//config执行失败执行
			wx.error(function(res){
//				alert("code="+res);
			});
			
			var s = location.href;
			s = s.substr(0,s.length-16);
			var fxUrl = s+"share/page.do?show_openid="+openId+"&from=singlemessage&isappinstalled=0";
			
			wx.ready(function(){
					wx.onMenuShareAppMessage({
					    title: '邀请合伙人', // 分享标题
					    desc: '合伙人邀请', // 分享描述
					    link: fxUrl, // 分享链接
					    imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg', // 分享图标
					    type: 'link', // 分享类型,music、video或link，不填默认为link
					    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					    success: function (res) { 
					        // 用户确认分享后执行的回调函数
					    	Message.showNotify("分享成功!",3000);
					    },
					    fail : function(res){
					    	Message.showNotify("分享失败!",3000);
					    }
					});
				
				  wx.onMenuShareTimeline({
					      title: '邀请合伙人',
					      link: fxUrl,
					      imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg',
					      success: function (res) {
					    	  Message.showNotify("分享成功!",3000);
					      },
					      fail: function (res) {
					    	  Message.showNotify("分享失败!",3000);
					      }
				  });

			});
		
		}
	});
	
	/*var imgs =  $(".partner_top img");
	for(var i =0;i<imgs.length;i++){
		$(imgs[i]).css("height",imgs[0].width);
	}*/
	
	
	//2016.10.09 屏蔽了弹出云朵得方法,就要重新定义点击事件
	$("#invation").click(function(){
		location.href="../effect/goToNewScan.do";
	});
	$("#saoma").click(function(){
		location.href="../effect/goToScan.do";
	});
	
});

function timeline(){
	
	$.ajax({
		async : true,
		url : "../effect/timeline.do",
		data : {"cpage":bpage},
		type : "post",
		dataType : "json",
		success : function(data) {
			
			if(data.code == 'success'){
				
				//名次
				if(data.objs.ranking != 0){
					//$(".all").html("全网排名：第<span>"+data.objs.ranking+"</span>名&gt;");
					$(".all").html("全网排名：第<span>"+data.objs.ranking+"</span>名");
				}else{
					//$(".all").html("全网排名：暂无排名&gt;");
					$(".all").html("全网排名：暂无排名");
				}
				
				pageCount = data.objs.count;//总记录数
				
				var htmlCode = '<p class="Time"><b class="left_button" onclick="upClick();">'+
							   '<img src="../images/Left.png"></b>'+data.objs.times+'<b class="right_button" onclick="downClick()">' +
							   '<img src="../images/right.png"></b></p>';

				if(data.objs.msgList != null){
					for(var i =0;i<data.objs.msgList.length;i++){
						var dataText = data.objs.msgList[i].m_msg_text.split("<p>");					
						htmlCode += '<div class="msg_box">' +
										'<div class="margker_top">' +
											'<div class="img_box">' +
											'<img src="../images/Milepost.png">' +
												'</div>' +
											'<p>里程碑：</p>'+
											'<div class="btm">'+
												'<span>' +
													dataText[0] +
												'</span>' +
											'<span>'+dataText[1]+'</span>' +
										'</div>'+
									'</div>'+
									'<div class="margker_bottom">' +
										'<div class="img_box">' +
											'<img src="../images/target.png">' +
										'</div>' +
										'<p>目标建议：</p>' +
										'<span>' +
											dataText[2] +
										'</span>' +
									'</div>' +
								'</div>';
						
					}
					
				}else{
					
					for(var i = 0;i < 3;i ++){
						htmlCode += '<div class="msg_box"><p style="text-align:center;">暂无数据</p></div>';
					}
					
				}
				
				$(".orbit_box").html(htmlCode);
				
			}
		}
	});
}


function upClick(){
	bpage = bpage + 1;
	
	if(bpage > pageCount){
		Message.showNotify("没有上周数据!",3000);
		bpage = bpage - 1;
	}else{
		timeline();
	}
	
}

function downClick(){
	bpage = bpage - 1;
	if(bpage != 0){
		timeline();
	}else{
		Message.showNotify("没有下周数据!",3000);
		bpage = bpage + 1;
	}
}
//var _data = {"map":{"maxcashCount":6,"progress":1.2646666666666666,"maxshareCount":17058,"vip":{"id":2,"m_content":"<p>英勇白银<\/p>","m_createtime":"2016-05-09T13:46:56","m_maxvalue":1500,"m_minvalue":501,"m_vip":"2","m_vip_title":"英勇白银"},"ue":{"cashCount":6,"partnerCount":3800,"pointsCount":124,"shareClick":318,"shares":34,"signdaysCount":45,"userid":"d5217957194d5af57df7448e187225ff"},"maxpointCount":42934,"ues":{"firstPartnerCount":11,"partnerCount":38,"points_total":124.2,"ready_money_total":6.5,"secondPartnerCount":27,"shareClick":159,"shares":17,"signdays":45,"userid":"d5217957194d5af57df7448e187225ff"},"elist":[{"desc_img":"e_details_partner.png","id":1,"index_img":"shuliang.png","index_name":"合伙人数量","second_bottomlink":"立即邀请合伙人","second_counttitle":"合伙人数量","second_countunit":"人","second_img":"sshuliang.png","second_memo":"<p>合伙人的分类分别为一级合伙人和合计合伙人。一级合伙人是指通过你分享的邀请链接或微信二维码成功关注微信公众号的人。二级合伙人是指通过你的一级合伙人分享的邀请链接或微信二维码成功关注微信公众号的人。<\/p>"},{"desc_img":"e_details_share.png","id":2,"index_img":"share.png","index_name":"分享点击量","second_bottomlink":"立即去分享","second_counttitle":"分享点击量","second_countunit":"次","second_img":"sshare.png","second_memo":"<p>&nbsp; 分享点击量是指你通过分享的资讯链接至微信朋友圈而获得的点击量。分享频率越频繁，好友点击次机率越大，分享点击量也越高。<\/p><p><br\/><\/p>"},{"desc_img":"e_details_zen.png","id":3,"index_img":"zen.png","index_name":"积分数量","second_bottomlink":"立即去赚积分","second_counttitle":"积分累积数量","second_countunit":"枚","second_img":"szen.png","second_memo":"<p>您可以通过下列方法增加积分<\/p><p>1、通过连续签到获得奖励积分<\/p><p>2、通过玩赚专区内通过做任务获得奖励积分<\/p><p>3、购买指定商品获得奖励<\/p><p>4、通过邀请合伙人，凡是你的合伙人赚取的积分，你都可以拿到相应比例的提成。<\/p>"},{"desc_img":"e_details_cash.png","id":4,"index_img":"cash.png","index_name":"现金数量","second_bottomlink":"查看活动商品","second_counttitle":"现金累积数量","second_countunit":"元","second_img":"scash.png","second_memo":"<p>本系统提供了多种途径获取现金奖励：<\/p><p>1、购买有现金返现的商品，成交7天后您将获得现金返现奖励；<\/p><p>2、您的一级或二级合伙人的购物获得现金奖励，那么您也可以获得相应比例的提成；<\/p><p>3、如果您注册为门店促销员，您的顾客获得现金奖励，那么您也可以获得相应比例的提成；<\/p>"},{"desc_img":"e_details_sign.png","id":5,"index_img":"day.png","index_name":"签到总天数","second_bottomlink":"去签到","second_counttitle":"签到总天数","second_countunit":"天","second_img":"sday.png","second_memo":"<p>每天签到系统赠送1积分，连续签到15天后，每天签到赠送11积分；如果您有漏签，以最近一次漏签的日期计算连续签天数。<\/p>"},{"desc_img":"e_details_effect.png","id":6,"index_img":null,"index_name":"影响力及作用","second_bottomlink":"  ","second_counttitle":"","second_countunit":"","second_img":null,"second_memo":"      影响力是一个综合评估值，根据个人的合伙人数量、签到率、现金数量、积分数量和分享点击量这五大因素按照一定的权重计算所得。\r\n    影响力决定了会员VIP等级和提成系数。影响力数值越大，VIP等级越高，赚钱的提成越多，拥有的特权越多。"}],"maxSigndaysCount":486,"effecttotal":1897,"maxpartnerCount":50280,"openId":"ogKMCwKIOHgBRVS9QcjBEPg8tH5Q"}};
function load() {
	$.ajax({
		async : true,
		url : "../effect/effecttotal.do",
		type : "post",
		dataType : "json",
		success : function(data) {
			//data = _data;
			var t = {
				progress : data.map.progress,
				vip : data.map.vip,
				_effect: data.map.effecttotal
			};
			loadring(t);
			$("#effectnum").html(data.map.effecttotal);
			//$("#effectnum").append("<img style='width:14px;' src='../skins/personcenter/img/myeffect_icon_white.png'>");
			//$("#yxl").html(data.map.effecttotal);
			d = {
				elist : data.map.elist,
				ue : data.map.ue,
				maxpartnerCount : data.map.maxpartnerCount,
				maxcashCount : data.map.maxcashCount,
				maxpointCount : data.map.maxpointCount,
				maxshareCount : data.map.maxshareCount,
				maxSigndaysCount : data.map.maxSigndaysCount,
				ues : data.map.ues,
			};
			// 绘制五维图
			loadchart(d);
			openId = data.map.openId;
			loadPartner(data.map.partners);
		}
	});
}

function loadPartner(data) {
	if(typeof(data)=="undefined"){
		return;
	}

	$("#FirstPartner .swiper-slide").remove();

	var contHtml = '<div class="swiper-slide">';
	var src="" ;
	if (data.length > 0) {
		for ( var i = 0; i < data.length; i++) {
			if(data[i].head_img.substr(0,7)=="http://"){
					src=data[i].head_img;
			}else{
				src="../cashRanking/img.do?imgName="+data[i].head_img;
			}
			contHtml += '<div class="partner">'
					+ '<div class="partner_top">'
					+ '<img src="'
					+ src
					+ '"/>'
					+ '<span class="partner_vip">VIP'
					+ data[i].vip.m_vip
					+ '</span>'
					+ '</div>'
					+ '<div class="partner_foot">'
					+ '<dd class="partner_foot_top" >'
					+ data[i].nickname
					+ '</dd>'
					+ '<dd class="partner_foot_top">'
					+ '<span>'
					+ '<img src="../skins/effect/img/myeffect_icon_black.png"/>'
					+ '<span>' + data[i].effect + '</span>'
					+ '</span> </dd> </div> </div>';

			if (i + 1 > 0 && (i + 1) % 4 == 0) {
				if (i == data.length - 1) {
					contHtml += '</div>';
				} else {
					contHtml += '</div>';
					contHtml += '<div class="swiper-slide">';
				}

			} else if (i % 4 != 0 && i == data.length) {
				contHtml += '</div>';

			}
		}
	} else {
		contHtml += '<div class="partner">' + '<div class="partner_top">'
				+ '<img src="../skins/effect/img/add.png" id="add"/>'  
				+ '</div>' + '<div class="partner_foot">'
				+ '<dd class="partner_foot_top" >添加合伙人</dd>'
				+ '<dd class="partner_foot_top"></dd> </div> </div>';

		
		contHtml+='<div style="float:left;width:75%;text-align:center;color: #868686;padding-top: 4%;">目前没有合伙人，赶紧去邀请吧~</div>';
		contHtml += '</div>';


	}
	$("#FirstPartner").append(contHtml);

}

function loadring(data) {

	$("#vipl").html("VIP" + data.vip.m_vip);
	$("#vipr").html("VIP" + (parseInt(data.vip.m_vip) + 1));
	$("#min").html(data.vip.m_minvalue);
	$("#max").html(data.vip.m_maxvalue);
	//计算影响力比例
	var _codes = (data._effect/data.vip.m_maxvalue*100).toFixed(2);
	$('.line-blue').css('width',_codes+'%');
	
	//定义圆弧的div高度和宽度
	/*var c = document.getElementById("vip");
	var sc  = window.devicePixelRatio;
	
	c.style.width = c.width + "px";
	c.style.height = c.hight + "px";
	c.width = c.width * sc;
	c.height = c.height * sc;
	// =======圆=======
	var paint = c.getContext("2d");
	paint.fillStyle = "blue"; // 定义演示

	paint.beginPath(); // 从新开始画，防止冲突重叠
	/* Math.PI * 5/6 Math.PI * 13 / 6 

	paint.arc(c.width / 2, c.height / 2, c.height / 2.2, Math.PI * 4 / 5,
			Math.PI * 11 / 5, false);
	// 结束画布，防止冲突重叠
	paint.strokeStyle = '#cc4e0a';
	paint.lineWidth = 13;
	paint.stroke();
	paint.closePath();
	paint.beginPath(); // 从新开始画，防止冲突重叠
	var i = 1;
	if (parseFloat(data.progress) <= 0) {
		i = 0;
	}else if (parseFloat(data.progress) > 0) {
		if(parseFloat(data.progress)>=1){
			i=1;
		}else{
			i = data.progress;
		}
	}
	paint.arc(c.width / 2, c.height / 2, c.height / 2.2, Math.PI * 4 / 5,
			(Math.PI * (4+(i*7)) /5), false);
	// 结束画布，防止冲突重叠
	paint.strokeStyle = '#ffffff';
	paint.lineWidth = 13;
	paint.stroke();
	paint.closePath();
	//加载完毕后才显示出来 这样保证样式不会混乱
	$(c).show();*/
}
function showDiv(t) {
	t.style.display = 'block';
	document.getElementById('bg').style.display = 'block';
}

function closeDiv(t) {
	t.style.display = 'none';
	document.getElementById('bg').style.display = 'none';
}

/*function invite(){
	location.href="../effect/goToScan.do";
}*/

// 加载雷达图
function loadchart(d) {
	radarChart(d);
	var str = "";
	var temp_count;
	try{
		/* 显示坐标图片并生成相应的弹出层 */
		ur = d.elist[d.elist.length - 1].desc_img;
	}catch(e){}
	for (var j = 0; j < d.elist.length - 1; j++) {
		
		if (j == 0) {
			temp_count = d.ues.partnerCount;
		} else if (j == 1) {
//			// 这是点击量的加载
//			var djl_url = "http://" + hs_url + "/mxj_weixin/share/countShares";
//			var data = JSON.stringify({
//				"uid" : d.ues.userid
//			});
//			temp_count = 0;
//			$.ajax({
//				type : "POST",
//				url : djl_url,
//				contentType : "application/json", // 必须有
//				dataType : "json", // 表示返回值类型，不必须
//				data : data,
//				success : function(obj) {
//					temp_count = obj.msg == null ? 0 : obj.msg; 
//					str = showHtml(d, temp_count, j);
//					$("#pop" + (j + 1)).append(str);
//				}
//			});
			temp_count=d.ues.shareClick;
			
		} else if (j == 2) {
//			temp_count = 0;
//			$.ajax({
//				async : false,
//				url : "../getZen4Weixin/figure.do",
//				type : "get",
//				dataType : "json",
//				success : function(data) {
//					var result = $.parseJSON(data);
//					var incomeInfo = result.msg;
//					temp_count = incomeInfo.totalIncome;
//					str = showHtml(d, temp_count, j);
//					$("#pop" + (j + 1)).append(str);
//				}
//			});
			
			temp_count = d.ues.points_total;
			
		} else if (j == 3) {
			temp_count = d.ues.ready_money_total;
		} else if (j == 4) {
			temp_count = d.ues.signdays;
		}

		str = showHtml(d, temp_count, j);
		$("#pop" + (j + 1)).append(str);
	}
	/* 绑定事件 */
	// $("#pop1").click(function() {
	// closeDiv(document.getElementById('pop1'));
	// });
	$("#img1").click(function() {
		showDiv(document.getElementById('pop1'));
	});
	// $("#pop2").click(function() {
	// closeDiv(document.getElementById('pop2'));
	// });

	$("#img2").click(function() {
		showDiv(document.getElementById('pop2'));
	});
	// $("#pop3").click(function() {
	// closeDiv(document.getElementById('pop3'));
	// });

	$("#img3").click(function() {
		showDiv(document.getElementById('pop3'));
	});
	// $("#pop4").click(function() {
	// closeDiv(document.getElementById('pop4'));
	// });

	$("#img4").click(function() {
		showDiv(document.getElementById('pop4'));
	});
	// $("#pop5").click(function() {
	// closeDiv(document.getElementById('pop5'));
	// });

	$("#img5").click(function() {
		showDiv(document.getElementById('pop5'));
	});

	$("#bg").click(function() {
		document.getElementById('bg').style.display = 'none';
		document.getElementById('pop1').style.display = 'none';
		document.getElementById('pop2').style.display = 'none';
		document.getElementById('pop3').style.display = 'none';
		document.getElementById('pop4').style.display = 'none';
		document.getElementById('pop5').style.display = 'none';
	});

	$("#copylink").click(function() {
		// http://"+hs_url+"/share/page.do?show_openid="+openId+"&from=singlemessage&isappinstalled=0
		share();
		// new Toast({context:$('body'),message:'邀请链接复制成功'}).show();
	});
	$("#jump1").click(function() {
		share();
		document.getElementById('pop1').style.display = 'none';
		document.getElementById('bg').style.display = 'none';

	});
}

/**
 * 生成雷达及各维度的点击事件
 * 
 * @param d
 *            雷达对象
 * @param temp_count
 *            数值
 * @param j
 *            维度，从0维开始，注意+1
 * @returns {String}
 */
function showHtml(d, temp_count, j) {
	var str="";
	$("#img" + (j + 1)).append(
			"<span><img src=\"../effect/down.do?imgName="
					+ d.elist[j].index_img + "\" /> </span><span>"
					+ d.elist[j].index_name + "</span>");
	str = "<div style=\"height: 47%; font-size: 0;\">"
			+ "<img src=\"../effect/down.do?imgName="
			+ d.elist[j].second_img
			+ "\" width=100% />"
			+ "</div>"
			+ "<div style=\"padding: .1rem; height: 40%; background-color: #fff; font-size: 0; border-bottom: 1px solid RGBA(182, 179, 177, 0.5)\">"
			+ "<span style=\"text-align: center; font-size: .1365rem; color: #505050\">"
			+ d.elist[j].second_counttitle
			+ "<span style=\"font-size: .1365rem; font-weight: bold; color: #000;\">" + temp_count
			+ "</span>" + d.elist[j].second_countunit + " </span> <br/><br>"
			+ "<span style=\"font-size: 0.1195rem; color:#9c9c9c; margin-top: 10px; display: block;\">";

	if (d.elist[j].second_memo.length > 80) {
		str += d.elist[j].second_memo.substring(0, 80) + "...";
	} else {
		str += d.elist[j].second_memo;
	}
	var tempSrc = "";
	// 跳转页面
	if (d.elist[j].id == 1) {
		tempSrc = "javascript:void(0)\" id=\"jump1\"";

	} else if (d.elist[j].id == 2) {
		// 分享点击量
		tempSrc = "../getZen4Weixin/shareInfoMission.do\"";
	} else if (d.elist[j].id == 3) {
		// 积分数量
		tempSrc = "../getZen4Weixin/getZen.do\"";
	} else if (d.elist[j].id == 4) {
		tempSrc = "../hxz/goToHxzList.do?openId=" + openId + "&gameName=\"";
	} else if (d.elist[j].id == 5) {
		tempSrc = "../getZen4Weixin/signInDaily.do\"";
	}
	str += "<a href=\"../effect/descPage.do?type="
			+ d.elist[j].desc_img
			+ "\" style=\"color:#ABABAB; display: block; text-align: left; margin-top: 5px\">详情  >></a></span><br/>"
			+ "</div>"
			+ "<a href=\""
			+ tempSrc
			+ ">"
			+ "<div style=\"height: 13%; text-align: center; background-color: #fff; padding:3%; font-size: 0;\">"
			+ "<span style=\"color: #ff620d; font-size: .1365rem;\">";

	/*
	 * 跳转页面 if (d.elist[j].id == 1) { str += "javascript:void(0)\"
	 * id=\"jump1\"";
	 *  } else if (d.elist[j].id == 2) { // 分享点击量 str
	 * +="../getZen4Weixin/shareInfoMission.do\""; } else if (d.elist[j].id ==
	 * 3) { // 积分数量 str += "../getZen4Weixin/getZen.do\""; } else if
	 * (d.elist[j].id == 4) { str += "../hxz/goToHxzList.do?openId=" + openId +
	 * "&gameName=\""; } else if (d.elist[j].id == 5) { str
	 * +="../getZen4Weixin/signInDaily.do\""; }
	 */

	// str += "\">" + d.elist[j].second_bottomlink + "</a></span>" + "</div>";
	// str += ">" + d.elist[j].second_bottomlink + "</a></span>" + "</div>";
	str += d.elist[j].second_bottomlink + "</span>" + "</div></a>";
	
	//alert("j=" + j + ";count=" + temp_count + "str=" + str);
	return str;
}

function share(){
	if($("#showDownInfo")[0].style.display=="none"){
		$("#showDownInfo")[0].style.display="block";
		$("#shandow")[0].style.display="block";
		document.ontouchmove=function(){
			return false;
			};
	}else{
		$("#showDownInfo")[0].style.display="none";
		$("#shandow")[0].style.display="none";
		document.ontouchmove=function(){
			return true;
			};
	}
	
}

//toast效果
var Toast = function(config){  
    this.context = config.context==null?$('body'):config.context;//上下文
    this.message = config.message;//显示内容
    this.time = config.time==null?3000:config.time;//持续时间  
    this.left = config.left;//距容器左边的距离  
    this.top = config.top;//距容器上方的距离     
	this.init();  
};
var msgEntity;  
Toast.prototype = {  
    //初始化显示的位置内容等  
    init : function(){  
        $("#toastMessage").remove();  
        //设置消息体  
        var msgDIV = new Array();  
        msgDIV.push('<div id="toastMessage">');  
        msgDIV.push('<span>'+this.message+'</span>');  
        msgDIV.push('</div>');  
        msgEntity = $(msgDIV.join('')).appendTo(this.context);  
        //设置消息样式  
        var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;  
        var top = this.top == null ? '30%' : this.top;  
        msgEntity.css({position:'absolute',top:top,'z-index':'130',left:left,'background-color':'#fff',color:'#505050','font-size':'1em',padding:'0.5em',margin:'0.5em'});  
        msgEntity.hide();  
    },  
    //显示动画  
    show :function(){  
        msgEntity.fadeIn(this.time/2);  
        msgEntity.fadeOut(this.time/2);  
    }  
          
};

function radarChart(d)
{    
	var dom = document.getElementById("main");
    var myChart = echarts.init(dom);
    var partner =  1;
    if(d.ue.partnerCount<1){
    	partner = 1;
    }else if(d.ue.partnerCount>=d.maxpartnerCount){
    	partner = 10;
    }else{
    	partner=10-Math.floor(d.maxpartnerCount/(d.ue.partnerCount+(d.maxpartnerCount/10)));
    }
    var share =1 ;
    var userShreCount = d.ue.shares + d.ue.shareClick;
    if(userShreCount<1){
    	share = 1;
    }else if(userShreCount>=d.maxshareCount){
    	share = 10;
    }else{
    	//share=10-Math.floor(d.maxshareCount/(userShreCount + (d.maxshareCount/10))); 
    	share = Math.max(1,  Math.floor(10 *(userShreCount)/d.maxshareCount));	
    }
    var point =1;
    if(d.ue.pointsCount<1){
    	point = 1;
    }else if(d.ue.pointsCount>= d.maxpointCount){
    	point = 10;
    }else{
    	point=10-Math.floor(d.maxpointCount/( d.ue.pointsCount+( d.maxpointCount/10)));
    }
    var  cash = d.ue.cashCount;
    if(d.ue.cashCount<1){
    	cash = 1;
    }else if(d.ue.cashCount>=d.maxcashCount){
    	cash = 10;
    }else{
    	cash=10-Math.floor(d.maxcashCount/(d.ue.cashCount+(d.maxcashCount/10)));
    }
    var day = d.ue.signdaysCount;
    if(d.ue.signdaysCount<1){
    	day = 1;
    }else if(d.ue.signdaysCount>=d.maxSigndaysCount){
    	day = 10;
    }else{
    	day=10-Math.floor(d.maxSigndaysCount/(d.ue.signdaysCount+(d.maxSigndaysCount/10)));
    }
   /* d.maxshareCount,
    d.maxpointCount,
    d.maxcashCount, 
    d.maxSigndaysCount*/
    var option = 
    {
		polar :[
            /*{splitLine:{show : false},*/
            {splitLine:{show : true,lineStyle : {width : 1, color : 'rgba(131,189,253,1)'}},
		     axisTick :{show : false},
		     splitArea:{show : true,areaStyle : {color:['rgba(131,189,253,1)','rgba(131,189,253,1)']}},
		     axisLine :{show : true,lineStyle : {width :1.5,color:'rgba(255,255,255,0.2)'}},
		     indicator:[ 
		              {text:'',max:10}, 
		        	  {text:'',max:10}, 
		        	  {text:'',max:10},
		        	  {text:'',max:10}, 
		        	  {text:'',max:10}],
		     center : [ '50%', '50%' ],
		     radius : '50%'}], //图的大小范围
	    series : [ {
		type : 'radar',
		symbol:'none',  //显示出线中的点
		data : [
		 {
			value : [ 10,10,10,10,10 ],
						itemStyle: {
	                        normal: {
	                        	color : 'rgba(131,189,253,1)' , // 调整线的颜色
	                        		   lineStyle: {
	                                       width:1.5
	                                     }
	                          
	                        }
	                    }
		},
        {
			value : [ partner,share,point, cash, day],
						itemStyle : {
							normal : {
								color : 'rgba(131,189,253,1)', // 调整数据线的颜色
								lineStyle: {
                                    width:1.5
                                  },
								areaStyle : {
										color : 'rgba(230, 242,255,0.7)' // 数据面积的样式
								}
							}
						}
			}
		 
		 
		 ]
	    } ]
    };
    myChart.setOption(option);
    window.onresize = myChart.resize;	
}

//(function (){
//    window.addEventListener("load", function(){
//    var c = document.getElementById('vip');
//
//    var tScale  = window.devicePixelRatio;
// 
//    c.style.width = c.width + "px";
//    c.style.height = c.hight + "px";
//    c.width = c.width * tScale;
//    c.height = c.height * tScale;
//    var paint = c.getContext("2d");
//    paint.fillStyle = "blue"; // 定义演示
//
//    paint.beginPath(); // 从新开始画，防止冲突重叠
//    /* Math.PI * 5/6 Math.PI * 13 / 6 */
//
//    paint.arc(c.width / 2, c.height / 2, c.height / 3, Math.PI * 4 / 5,
//		Math.PI * 11 / 5, false);
//    // 结束画布，防止冲突重叠
//    paint.strokeStyle = '#ffffff';
//    paint.lineWidth = 8;
//    paint.stroke();
//    paint.closePath();
//  },false);
//})();