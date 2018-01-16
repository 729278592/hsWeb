$(function(){
	$.ajax({
		url : '../user/loadUserRanking.do',
		type : 'POSt',
		dataType : 'JSON',
		async : true,
		success : function(result){
			$("#one").text(result.curUserInfo[5]);//一级合伙人总人数
			$("#two").text(result.curUserInfo[6]);//二级合伙人总人数
			//一级和二级总共人数
			$("#otCount").html(result.curUserInfo[7]+"&nbsp;位");
			//影响力个人
			$("#effectVal").text(result.curUserInfo[3]);
			//用户昵称
			$("#uname").text(result.curUserInfo[2]);
			//用户头像
			var origin = result.curUserInfo[1];
			if (origin.substring(0,7) == 'http://') {
			} else {
				origin = "../user/rankingDown.do?filename=" + origin;
			}
			$("#headPic").attr("src",origin);
			if(origin==null){
				$("#headPic").attr("src","../skins/firstpage/img/body_default.png");
			}
			//VIP等级
			$("#vipLevel").text("VIP" + result.curUserInfo[4]);
			
			var uListHtml = "";
			var rankColor = "";
			
			if(result.firstObj != null && result.firstObj != ""){
				for(var i = 0;i < result.firstObj.length;i ++){
					rankColor = '<span class="li-number">'+ (i + 1)+'</span>';
					var origin2 = result.firstObj[i][1];
					if (origin2.substring(0,7) == 'http://') {
					} else {
						origin2 = "../user/rankingDown.do?filename=" + origin2;
					}
					uListHtml += '<li class="list" id="'+result.firstObj[i][0]+'">' +
						rankColor +
						'<div class="head">' +
							'<span class="img-box">'+
									'<span class="img-box">'+
									'<img src="'+origin2+'" />'+
								'</span>'+
								'<span class="grade">VIP'+result.firstObj[i][4]+'</span>'+
							'</span>'+
						'</div>' +
						'<div class="head-content">' +
								'<span class="name">'+result.firstObj[i][2]+'</span>'+
								'<span class="icon"></span>'+
								'<span class="num">'+result.firstObj[i][3]+'</span>'+
						'</div>' +
						'<span class="li-num">' +
							'<span class="icon"></span><span>'+result.firstObj[i][5]+'</span>'+
						'</span>' +
				'</li>';
				}
			}
			//目前没有相关信息,赶快去邀请吧
			if(uListHtml == "" || uListHtml.length <= 0){
				uListHtml += '<div class="partner-none">'+
						'<div class="img"></div>'+
						'<div class="title">目前没有相关信息，赶快去邀请吧~</div>'+
						'<span class="partner-btn" id="tixian">邀请好友</span>'+
					'</div>';
			}
			$(".main").append(uListHtml);
		}
	});

	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});

	$('#tixian').click(function(){
		//2016.10.09  屏蔽云朵改成展示个性化二维码 
		//$('#showDownInfo').show();
		location.href="../effect/goToNewScan.do";
	});
	$('#invation').click(function(){
		//$('#showDownInfo').show();
		location.href="../effect/goToNewScan.do";
		
	});
	/*$('#shandow').click(function(){
		$('#showDownInfo').hide();
	});*/
	//对列表对象进行绑定事件 
	$(".list").click(function(){
		change();
		showHieDiv();
		//加载用户信息
		$.ajax({
			url : '../zenProfit/helpMakeZen.do',
			data : {"checkUserId":$(this)[0].id},
			type : 'POST',
			async : true,
			dataType : 'JSON',
			success : function(result){
				var origin = result[1];
				if (origin.substring(0,7) == 'http://') {
				} else {
					origin = "../user/rankingDown.do?filename=" + origin;
				}

				var checkHtml = "";
				checkHtml+= '<div class="message_detail">' +
					             '<dl>' +
					                 '<dt>' +
					                     '<img src="'+origin+'" width="40%" height="40%" >' +
					                     '<span>VIP'+result[2]+'</span>' +
					                 '</dt>' +
					                 '<dd>' +
					                     '<p>'+result[3]+'</p>' +
					                     '<div>' +
					                         '<img src="../skins/effect/img/myeffect_icon_white.png" width="13rem">&nbsp;' +
					                         '<span>'+result[4]+'</span>' +
					                     '</div>' +
					                 '</dd>' +
					             '</dl>' +
					         '</div>' +
					         '<div class="mes">' +
					             '<p>帮赚积分:&nbsp;<span >'+result[5]+'&nbsp;枚</span></p>' +
					             '<p>帮赚现金:&nbsp;<span>'+result[6]+'&nbsp;元</span></p>' +
					             '<p>帮找二级合伙人:&nbsp;<span>'+result[7]+'&nbsp;位</span></p>' +
					             '<p>二级合伙人帮赚积分:&nbsp;<span>'+result[8]+'&nbsp;枚</span></p>' +
					             '<p>二级合伙人帮赚现金:&nbsp;<span>'+result[9]+'&nbsp;元</span></p>' +
					         '</div>' +
					         '<p  class="send" onclick="x();" id="iKnow">我知道了</p>' +
					         '<div id="addJSDiv" style="dispaly:none"><script type="text/javascript">function x(){$("#showUserInfo").hide();$("#addJSDiv").remove();}</script></div>';
				
				$(".message").html(checkHtml);
				
			}
		});
		
	});
	
	//点击DIV进行隐藏
	$(".mask").click(function(){
		showHieDiv();
		$("#addJSDiv").remove();
		document.ontouchmove=function(){
			return true;
		};
	});

	function showHieDiv(){
		var divStatus = document.getElementById("showUserInfo");
		
		if(divStatus.style.display == "none"){
			divStatus.style.display = "block";
		}else{
			divStatus.style.display = "none";
		}
	}
	//返回
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
		//window.location.href = "../goodml/mine.do";
	});
	
	//点击头像跳转影响介绍
	$("#defEft").click(function(){
		window.location.href = "../effect/goToLevel.do";
	});
});
function change(){
    var postion = $(".message").css("position");
  //获取滚动的高度
	var h=document.body.scrollTop;
	if(postion=="absolute"){
		//大于零 说明已下拉
		$(".message").css({"top": h+10});
		
	}else{
		setTimeout("change()",10);
	}
}
setTimeout("change()",0);








