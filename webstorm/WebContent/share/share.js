$(function(){
	//var str=location.search;
	var params = getRequestParams();
	var openid = getParamByName(params,"show_openid");
	var uid = getParamByName(params,"show_uid");
	$("#shareimg").attr("src","http://"+hs_url+"/mxj_weixin/qr/getPersonalQr?openId="+openid+"&uid="+uid);
});
