$(function(){
	//如是微信浏览器为返回结果为true
	if(isWeiXin()){
		var downHtml =  "<nav>" +
								"<div class='tip'>" +
								"<span>请点击右上角将直通卡“发送给朋友”</span>" + 
								"<span class='arrow'><img src='../skins/download/img/arrowup.png'></span>" +
							"</div>" +
						"</nav>";
		$(downHtml).insertBefore("body");
	}
	$("#shareimg").attr("src","http://"+hs_url+"/mxj/qrCode/shareQrPic.do?openId="+openId);
});

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}