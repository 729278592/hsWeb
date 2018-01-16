$(function(){
	
	$.ajax({
		url : '../user/loadShowQr.do',
		type : 'POST',
		dataType : 'JSON',
		success : function(result){
			if(result != null){
				$(".code").text(result[0]);
				$(".icon").css({
					"background": "url(http://"+hs_url+"/mxj_weixin/qr/getPersonalQr?openId="+result[1]+"&uid="+result[2]+")no-repeat",
					"background-size":"100% 100%"
				});
			}
		}
	});
	
	//返回
	$("#backPage").click(function(){
		window.location.href="../personcenter/personalcenter.html";
	});
	
	
});















