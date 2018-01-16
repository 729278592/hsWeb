//var shareURL = mpServerPath + '/auth/mpOAuth?redirectUrl=';// + encodeURIComponent(mpServerPath + '/first.jsp');
$(function () {

    // alert("js执行");
    $.ajaxSetup({
        'timeout': 5000
    });

    // var actUrl = decodeURIComponent(window.location.href);
    // var urlParams = actUrl.substr(actUrl.indexOf("?"));
    // // 获取指定URL参数
    // var showUrl = getQueryString(urlParams,"showUrl");
    // var t = getQueryString(urlParams,"t");
    // var type;

    // if (!checkEmptyString(t)) {
    //     var pa = t.split('_');
    //     type = pa[0];
    //     id = pa[1];
    // }
    // var fromId = getQueryString(urlParams,"fId");

    var actUrl = decodeURIComponent(window.location.href);
    var urlParams = actUrl.substr(actUrl.indexOf("?"));
    var id = getQueryString("infoId");
    var uid = getQueryString("uid");
    var token = getQueryString("token");
    // alert("id-----" + id);
    // alert("uid-----" + uid);
    // alert("token-----" + token);

    var commonParam = JSON.stringify({
        "uid": uid,
        "token": token,
        "from": "pc"
    });

    var commonParamStr = commonParam.toString();

    var apiKey = "abc9d09d9aaf720da9s9f9c9b9s0d9c9";

    var currentTime = getCrrentTime();

    var sign = hex_md5("A-Common-Param" + commonParamStr + "A-Channel" + apiKey + "A-Timestamp" + currentTime);

    var infoId = 'info#' + id;
    // var info_url = mpServerPath + '/share/getInfoDetail?id=' + id;
    var info_url = originServerPath + '/pc/shareInfo/get';
    var title;
    var description;
    var imageUrl;
    var showUrl;
    // var shareSuccParam;


    // if (type == type_info) {
    // $.get(info_url, function (data, status) {
    //     if (data.code == 0) {
    //         var msg = JSON.parse(data.msg);
    //         title = msg.title;
    //         alert('分享标题----' + title);
    //         description = msg.description;
    //         imageUrl = msg.imageUrl;
    //         document.getElementById("second_iframe").src = msg.infoUrl;
    //     }
    //
    // });

    // $.ajax({
    //     type: "get",
    //     // url: originServerPath + '/userBehavior?platform=wx_public&uid='+uid,
    //     // url: "http://10.68.97.31:8080/mxj_weixin/rs" + '/user/rewardIntegal',
    //     url: info_url,
    //     contentType: "application/json; charset=utf-8",
    //     dataType: "json",
    //     crossDomain: true,
    //     beforeSend: function (request) {
    //         request.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     },
    //     success: function (data) {
    //         var msg = data.msg;
    //         title = msg.title;
    //         // alert('分享标题----' + title);
    //         description = msg.description;
    //         imageUrl = msg.imageUrl;
    //         showUrl = msg.infoUrl;
    //         // alert("分享页面--------" + msg.infoUrl);
    //         document.getElementById("second_iframe").src = showUrl;
    //     }
    // });


    var param = JSON.stringify({
        "id": id
    });

    $.ajax({
        type: "post",
        url: info_url,
        contentType: "application/json; charset=utf-8",
        data: param,
        dataType: "json",
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
            request.setRequestHeader("A-Common-Param", commonParamStr);
            request.setRequestHeader("A-Channel", apiKey);
            request.setRequestHeader("A-Timestamp", currentTime);
            request.setRequestHeader("A-Sign", sign);
        },
        success: function (data) {
            var msg = data.msg;
            title = msg.title;
            description = msg.description;
            imageUrl = msg.imageUrl;
            showUrl = msg.infoUrl;
            console.log("pc省事儿微信分享获取分享信息>>>" + showUrl);
            document.getElementById("second_iframe").src = showUrl;
        },
        error: function () {
            console.log("pc省事儿微信分享获取分享信息出错!")
        }
    });

    //生成二维码
    // if (!checkEmptyString(fromId)){
    //     var qr_url = 'http://' + hs_url + '/mxj_weixin/qr/getPersonalQrUrl?openId='+fromId;
    //     $.get(qr_url, function(data, status){
    //     if (data.code == 0){
    //         var options = {
    //             "render": "image",
    //             "size": 300,
    //             "color": "#3a3",
    //             "text": data.msg
    //         } ;
    //         $('#person_qr').empty().qrcode(options);
    //     }
    //
    // });
    // }

    // }
    // var openid;

    core.requireJS(['../weixinShare/jweixin-1.0.0.js', '../weixinShare/mpAPI.js'], function () {

        mp.oAuthAPI(function (data) {
            // openid = data.openId;

            mp.jsAPI(function () {

                // var redirectUrl = staticServicePath + '/second.html?fId=' + openid + '&t=' + t + '&showUrl=' + showUrl;
                // var shareURL = mpServerPath + '/auth/mpOAuth?redirectUrl=' + encodeURIComponent(redirectUrl);

                var shareURL = "http://" + hs_url + "/mxj/getZen/getShowUrl.do?uid="+uid+"&token="+token+"&infoId="+id;

                var jsonData = JSON.stringify({
                    "device": null,
                    "model": null,
                    "imei": null,
                    "records": [{
                        "time": null,
                        "ip": null,
                        "uid": uid,
                        "lat": null,
                        "lng": null,
                        "city": null,
                        "province": null,
                        "action": 301,
                        "data": {
                            "infoId": infoId
                        }
                    }]
                });

                //统计点击
                // if (!checkEmptyString(fromId)){
                //     var param = JSON.stringify({ 'url': showUrl, 'fromUid':fromId,'clickOpenId' : openid});
                //     processClick(param);
                // }
                //获取userId
                // $.get(mpServerPath + '/user/getUid?openId='+openid, function(data,status){
                //      alert(JSON.stringify(data));
                //     if (data.code == 0){
                //         uid = data.msg.uId;
                //         shareSuccParam = JSON.stringify({
                //             "records": [{
                //                 "time": new Date().getTime(),
                //                 "uid": uid,
                //                 "action": 301,
                //                 "data": {
                //                     "infoId": "info#"+id,
                //                 }
                //             }]
                //         })
                //     } else {
                //         alert("获取用户失败")
                //     }
                // });

                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {

                        if (type = type_info) {
                            //alert('')
                            shareSuccess(jsonData, commonParamStr, apiKey, currentTime, sign);
                        }
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        console.log("分享朋友圈失败")
                    }
                });
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: description, // 分享描述
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        if (type = type_info) {
                            shareSuccess(jsonData, commonParamStr, apiKey, currentTime, sign);
                        }
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        console.log("分享朋友失败")
                    }
                });
            }, false);
        });
    });

});
