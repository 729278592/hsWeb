
var mpServerPath = "http://" + hs_url + "/mxj_weixin";
var staticServicePath = "http://" + hs_url + "/mxj/auth/userShare/html";
var originServerPath = "http://" + hs_url + "/zenlife_origin";
var originAuthServerPath = "http://" + hs_url + "/zenlife_origin";
var type_product = "p";
var type_info = "i";
var ownOpenId;

// var commonParam = JSON.stringify({
//     "uid": uid,
//     "token": token,
//     "from": "pc"
// });
// var commonParamStr = commonParam.toString();
// var apiKey = "abc9d09d9aaf720da9s9f9c9b9s0d9c9";
// var currentTime = getCrrentTime();
// var sign = hex_md5("A-Common-Param" + commonParamStr + "A-Channel" + apiKey + "A-Timestamp" + currentTime);

/**
 * 弹出提示消息
 */
function showInfo(message) {
    $.messager.show({
        title: '提示',
        msg: message,
        timeout: 2000,
        showSpeed: 200,
        style: {
            right: '',
            top: document.body.scrollTop + document.documentElement.scrollTop,
            bottom: ''
        }
    });
}

//判断是否微信浏览器
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    // alert (ua)
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
// 获取指定URL参数
// function getQueryString(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search == "" ? null : decodeURIComponent(window.location.search).substr(1).match(reg);
//     alert(r)
//     if (r != null)
//         return unescape(r[2]);
//     return "";
// }

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

// function getQueryString(url, name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = url == "" ? null : url.substr(1).match(reg);
//     if (r != null)
//         return unescape(r[2]);
//     return "";
// }

function removeQueryString(url, ref) {
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

function processClick(param) {
    $.ajax({
        type: "post",
        url: mpServerPath + '/user/saveFlow',
        contentType: "application/json; charset=utf-8",
        data: param,
        dataType: "json",
        crossDomain: true,
        success: function (data) {

        },
        error: function () {
        }
    });
}

// function shareSuccess(param){
// 	$.ajax({
// 		type:"post",
// 		// url: originServerPath + '/userBehavior?platform=wx_public&uid='+uid,
// 		// url: "http://10.68.97.31:8080/mxj_weixin/rs" + '/user/rewardIntegal',
// 		url: mpServerPath + '/user/rewardIntegal',
// 		contentType: "application/json; charset=utf-8",
// 		data :param ,
// 		dataType : "json",
// 		crossDomain: true,
// 		success: function(data) {
// 			alert(JSON.stringify(data))
// 		},
// 		error: function() {
// 			alert("加积分失败");
// 		}
// 	});
// }

function shareSuccess(param, commonParamStr, apiKey, currentTime, sign) {
    $.ajax({
        type: "post",
        url: originAuthServerPath + '/pc/userBehavior',
        contentType: "application/json; charset=utf-8",
        data: param,
        dataType: "json",
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("A-Common-Param", commonParamStr);
            request.setRequestHeader("A-Channel", apiKey);
            request.setRequestHeader("A-Timestamp", currentTime);
            request.setRequestHeader("A-Sign", sign);
        },
        success: function (data) {
            var code = data.code;
            // console.info('code----' + code);
            if (code == 0) {
                alert(":) 恭喜已获得积分");
            } else if (code == -301) {
                alert(":( 已经分享过啦,换一条吧");
            } else {
                alert(":( 分享失败");
            }
            // alert(JSON.stringify(data))
        },
        error: function () {
            alert(":( 出错啦");
        }
    });
}

function checkEmptyString(str) {
    if (str != null && str != "null" && str != "") {
        return false;
    }
    return true;
}


function getCrrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    // if (second <= 0 && second <= 9) {
    //     second += "0";
    // }
    var currentdate = year + month + day
        + hour + minute
        + second;
    return currentdate;
}