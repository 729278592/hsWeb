var mpServerPath = "http://" + hs_url + "/mxj_weixin";
var staticServicePath = "http://" + hs_url + "/web/proLaunch/html";
var originServerPath = "https://" + hs_url + "/zenlife_origin";
var type_product = "p";
var type_info = "i";
var ownOpenId;
/**
 * 弹出提示消息
 */
function showInfo(message){
	$.messager.show({
		title:'提示',
		msg:message,
		timeout:2000,
		showSpeed:200,
		style:{
            right:'',
            top:document.body.scrollTop+document.documentElement.scrollTop,
            bottom:''
        }
	});
}

//判断是否微信浏览器
function is_weixn(){
	var ua = navigator.userAgent.toLowerCase();
	// alert (ua)
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}
// 获取指定URL参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search == "" ? null : decodeURIComponent(window.location.search).substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return "";
}

function getQueryString(url,name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = url == "" ? null : url.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return "";
}

function removeQueryString(url,ref){
	var str = "";

    if (url.indexOf('?') != -1)
        str = url.substr(url.indexOf('?') + 1);
    else
        return url;
    var arr = "";
    var returnurl = "";
    var setparam = "";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (i in arr) {
            if (arr[i].split('=')[0] != ref) {
                returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
            }
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
    }
    else {
        arr = str.split('=');
        if (arr[0] == ref)
            return url.substr(0, url.indexOf('?'));
        else
            return url;
    }
}
//mpServerPath + 
function processClick(param){
	$.ajax({
		type:"post",
		url: mpServerPath + '/share/saveFlow',
		contentType: "application/json; charset=utf-8",
		data :param ,
		dataType : "json",
		crossDomain: true,
		success: function(data) {
			
		},
		error: function() {}
	});
}

function shareSuccess(param,uid){
	$.ajax({
		type:"post",
		// url: originServerPath + '/userBehavior?platform=wx_public&uid='+uid,
		// url: "http://10.68.97.31:8080/mxj_weixin/rs" + '/user/rewardIntegal',
		url:"http://" + hs_url + "/zenlife_origin/userBehavior?platform=wx_public&uid=" + uid,
		// url: mpServerPath + '/user/rewardIntegal',
		contentType: "application/json; charset=utf-8",
		data :param ,
		dataType : "json",
		crossDomain: true,
		success: function(data) {
			// alert(JSON.stringify(data));
			// alert("test")
		},
		error: function() {
			// alert("加积分失败");
		}
	});
}

function checkEmptyString(str){
	if (str != null && str != "null" && str != "" ) {
		return false;
	}
	return true;
}