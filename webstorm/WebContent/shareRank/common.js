var serverPath = url_prefix + hs_url + "/zenlife_origin";

var getZenRankModule = '/userProperty/action/rank';

var getPersonalZenRankModule = '/userProperty/action/rank/personal';

var defaultUserHeadImg = '../skins/shareRank/img/user_header_icon_default.png';

var apiKey = "e872b4eeb5e92f61f0efcdb20ee4ad86";
var uid = '';
var token = '';
var commonParamStr = '';
var currentTime = '';
var sign = '';
var from = 'wx_public';


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

function getApiCommonDatas() {
    $.ajax({
        async: true,
        url: "../getZen/getLoginInfo.do",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data && data.uid && data.token) {
                uid = data.uid;
                token = data.token;
                // alert("uid0===" + uid + "   token0===" + token);
            }
        }
    });

    if (uid == '' && token == '') {
        token = getQueryString("token");
        uid = getQueryString("uid");
        // alert("uid1===" + uid + "   token1===" + token);
    }

    var commonParam = JSON.stringify({
        "uid": uid,
        "token": token,
        "from": from
    });

    commonParamStr = commonParam.toString();

    currentTime = getCrrentTime();

    sign = hex_md5("A-Common-Param" + commonParamStr + "A-Channel" + apiKey + "A-Timestamp" + currentTime);

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


function checkEmptyString(str) {
    if (str != null && str != "null" && str != "") {
        return false;
    }
    return true;
}


function getCrrentTime() {
    var date = new Date();
    // var seperator1 = "-";
    // var seperator2 = ":";
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