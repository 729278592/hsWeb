/**
 * 好享赚
 */
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function(){
	
	var gameName = GetQueryString("gameName");//活动名称
	
	//异步加载数据
	$.ajax({
		url : '../hxz/queryGameList.do',
		type : 'POST',
		data : {"gameName":gameName},
		dataType : 'JSON',
		async : false,
		success : function(result){
			//alert(JSON.stringify(result));
			if(result != null && result.length > 0){
				$(".h-title").html(result[0][11]+"商品");
				var contHtml = "";
				for(var i = 0;i < result.length;i ++){
					contHtml = '<div style="margin-bottom:15px">' +
									'<div class="zwcdiv">' +
											'<div class="decdiv">' +
												'<div class="imgdiv">' +
											'<a href="javascript:goToDetails('+result[i][2]+');">' +
												'<img src="../hxz/haoxzDown.do?filename='+result[i][4]+'" class="imgwh">' +
											'</a>' +
										'</div>' +
										'<div style="float: left; width: 65%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size:16px; padding-left: 14px; padding-top: 8px; padding-bottom: 6px;">'+result[i][11]+'</div>' +
										'<a style="float: right; margin-top: 5px;" href="javascript:showOrHide(\''+result[i][0]+'\');">' +
										'<div class="dscdiv">' +
												'<span class="scfont">活动详情<i class="sd" id="sd_'+result[i][0]+'"></i></span>' +
										'</div>' +
									'</a>' +
										'</div>' +
									'</div>' +
									'<div class="gameInfo" style="width: 95%;height: auto;background: #fff;margin: 0 auto;margin-top: 1px;display: none;text-indent: 2em;" id="sh_'+result[i][0]+'">' +
										result[i][1] +
									'</div>' +
								'</div>';
					
					$("#congame").append(contHtml);	
					//现在不要倒计时
					//countDown(result[i][5],result[i][6],result[i][7],result[i][8],result[i][9],result[i][10],result[i][0]);
				}
			}else{
				$("#congame").html('<span style="float: left; width: 100%; text-align: center; margin-top: 30px; font-size: 14px; color: #999;">抱歉，没有相关活动！</span>');
			}
		}
	});
});

//倒计时
function countDown(year,month,day,hours,minutes,seconds,did){
	
	var now = new Date();
	var endDate = new Date(year, month - 1, day,hours,minutes,seconds);//数据库的结束时间
	var leftTime = endDate.getTime() - now.getTime();

	//大于零活动没有结束
	if(leftTime > 0){
		var leftsecond = parseInt(leftTime / 1000);
		var day1 = Math.floor(leftsecond / (60 * 60 * 24));
		var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
		var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
		var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
		
		var nhour =  0;
		if(day1 != null && day1 > 0){
			nhour = Math.floor(leftsecond / (60 * 60));
		}
		
		var nhours = hour + nhour;
		
		$("#ds_"+did).text(nhours > 9 ? nhours : "0" + nhours);
		$("#ms_"+did).text(minute > 9 ? minute : "0" + minute);
		$("#ss_"+did).text(second > 9 ? second : "0" + second);
		
//		setTimeout(countDown(year,month,day,hours,minutes,seconds,did),1000);//递归太多消耗内在太多报异常
	}
	
	/*else{
		$("#ds_"+did).text("00");
		$("#ms_"+did).text("00");
		$("#ss_"+did).text("00");
	}*/
	
}


//跳转商品详情页面
function goToDetails(goodsId){
	//modify by zhangzhen:去掉无效的get参数
	window.location.href="../goodml/goToGoodsDetails.do?goodsId="+goodsId; 
}

//返回首页
function backPage(){
	window.history.go(-1);
	return false;
}

function showOrHide(divId){
	var objs = document.getElementById("sh_"+divId);
	var changImg = $("#sd_"+divId);
	
	//等于none说明要展开
	if(objs.style.display == "none"){
		//objs.style.display = "block";直接显示
		changImg.css({
			"background":"url(../skins/haoxz/img/icon_down.png) no-repeat left",
			"display":"block",
			"margin-top":"-12px",
			"margin-left":"72px",
			"background-size":"12px 12px",
			"width":"18px",
			"height":"22px"
		});
		
		//$("#sh_"+divId).fadeIn(2000);慢慢显示出来
		$("#sh_"+divId).slideDown(300);//拉下效果
		
	}else{
		//objs.style.display = "none";直接隐藏
		changImg.css({
			"background":"url(../skins/haoxz/img/icon_arrow.png) no-repeat left",
			"display":"block",
			"margin-top":"-12px",
			"margin-left":"72px",
			"background-size":"12px 12px",
			"width":"18px",
			"height":"22px"
		});
		
		//$("#sh_"+divId).fadeOut(2000);//慢慢显示出来
		$("#sh_"+divId).slideUp(300);// 拉上效果
	}
	
}









