function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}



//初始化
$(document).ready(function(){
	var goodsId = GetQueryString("goodsId");
	
	$.ajax({
		url : '../goodml/loadGoodsInfo.do',
		type : 'POST',
		data : {"goodsId":goodsId},
		dataType : 'json',
		async : false,
		success : function(result){
			$("#gid").val(result[0]);//赋值商品ID
			
			var dateTime = result[2].split("T");
			var ymd = dateTime[0].split("-");
			var hsm = dateTime[1].split(":");
			countDowns(ymd[0],ymd[1],ymd[2],hsm[0],hsm[1],hsm[2]);
			
			
			$("#goodsImg").html('<img src="../good/goodsDetailsDown.do?filename='+result[8]+'" height="285px" width="78%">');
			
			$("#jiage").text("￥"+result[5]);//价格
			$("#goodDes").text(result[4]);//商品描述

			var titleCodeHtml = '<span style="color: #fff;font-size: 0.8em;width: 10%;display:inline-block;background-color: #EDA200;height: 20px;float: left;margin-left: 20px;line-height: 21px;">自营</span>' +
								'<span style="width: 80%;color: #000;display:inline-block;float: left;height: 20px;text-align: left;font-size: 0.9em;line-height: 20px;">&nbsp;&nbsp;&nbsp;'+result[3]+'</span>' +
								'<span class="checkDes"></span>';
			
			$("#headTitle").html(titleCodeHtml);//商品名称
			var bqCodeHtml = "";
			
			if(result[9] == "线上" || result[9] == "都有"){
				bqCodeHtml += '<span class="gmfx">购买返现'+result[6]+'元</span>' +
							  '<span class="tjzgjl">推荐最高奖励'+result[7]+'元</span>' +
							  '<span><a href="javascript:void(0);" style="color: #000;font-size: 0.8em;line-height: 15px;">查看详情&nbsp;></a></span>';
			} 
			
			if(result[9] == "线下" || result[9] == "都有"){
				bqCodeHtml += '<span class="zcddsw">支持到店试玩</span>' +
							  '<span class="zbjl">积分奖励</span>';
			}
			
			if(result[9] == "线下"){
				bqCodeHtml += '<span><a href="javascript:void(0);" style="color: #000;font-size: 0.8em;line-height: 15px;">查看详情&nbsp;></a></span>';
			}
			
			$("#oTo").html(bqCodeHtml);
			
			
			var butCodeHtml = "";
			if(result[9] == "线下" || result[9] == "都有"){
				butCodeHtml = '<div style="width: 33.3%;height: 60px;background-color: #535353;float: left;display: inline-block;">' +
							  	'<span style="line-height: 60px;color: #fff;">到店试玩</span>' +
							  '</div>' +
							  '<div style="width: 33.3%;height: 60px;background-color: #C30404;float: left;" id="nowBuy">' +
							  	'<span style="line-height: 60px;color: #fff;">立即购买</span>' +
							  '</div>' +
							  '<div style="width: 33.3%;height: 60px;background-color: #FF620D;float: left;" id="tjBuy" class="getCloud">' +
							  	'<span style="line-height: 60px;color: #fff;">推荐购买</span>' +
							  '</div>';
			}else{
				butCodeHtml = '<div style="width: 50%;height: 60px;background-color: #C30404;float: left;" id="nowBuy">' +
							  	'<span style="line-height: 60px;color: #fff;">立即购买</span>' +
							  '</div>' +
							  '<div style="width: 50%;height: 60px;background-color: #FF620D;float: left;" id="tjBuy" class="getCloud">' +
							  	'<span style="line-height: 60px;color: #fff;">推荐购买</span>' +
							  '</div>';
			}
			
			$("#buttonSel").html(butCodeHtml);
			
		}
	});
	
	//显示分享
	$("#tjBuy").click(function(){
		$('#showDownInfo').css("display","block");
		document.ontouchmove=function(){
			return false;
			}
	});
	//立即购买
	$("#nowBuy").click(function(){
		var gid = $("#gid").val();
		$.ajax({
			url : '../goodml/judgeGoodsOver.do',
			data : {"goodsId":gid},
			dataType : 'JSON',
			type : 'POST',
			success : function(result){
				//判断商品是否已过期
				//过期就不能进行购买
				if(result != null && result.m_overdue == '00'){
					window.location.href = "../account/goToCAPage.do?goodsId="+gid;
				}
			}
		});
	});
	
	//立即下载APP
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});
});

//倒计时
function countDowns(years,months,days,hours,minutes,seconds){
	
	var nows = new Date();
	var endDates = new Date(years, months - 1, days,hours,minutes,seconds);//数据库的结束时间
	var leftTimes = endDates.getTime() - nows.getTime();
	
	//大于零活动没有结束
	if(leftTimes > 0){
		var leftseconds = parseInt(leftTimes / 1000);
		var day = Math.floor(leftseconds / (60 * 60 * 24));
		var hour = Math.floor((leftseconds - day * 24 * 60 * 60) / 3600);
		var minute = Math.floor((leftseconds - day * 24 * 60 * 60 - hour * 3600) / 60);
		var second = Math.floor(leftseconds - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
		
		$("#hour").text(hour > 9 ? hour : "0" + hour);
		$("#minute").text(minute > 9 ? minute : "0" + minute);
		$("#second").text(second > 9 ? second : "0" + second);
		
		setTimeout("countDowns("+years+","+months+","+days+","+hours+","+minutes+","+seconds+")",1000);
		
	}else{
		$("#hour").text("00");
		$("#minute").text("00");
		$("#second").text("00");
		
		//并同时把该商品设置为过期
		var gid = $("#gid").val();
		
		$.ajax({
			url : '../goodml/setGoodsState.do',
			data : {"goodsId":gid},
			type : 'POST',
			dataType : 'JSON'
		});
	}
}


//返回首页
function backPage(){
	window.history.go(-1);
	return false;
}