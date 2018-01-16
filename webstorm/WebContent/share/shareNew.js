$(function(){
	//获取OPENID
	//var str = location.search; 
	//var openid = str.substring(13);
	var params = getRequestParams();
	var openid = getParamByName(params,"show_openid");
	var uid = getParamByName(params,"show_uid");
	$("#shareimg").attr("src","http://"+hs_url+"/mxj/qrCode/shareQrPic.do?openId="+openid+"&uid=" +uid);
});
