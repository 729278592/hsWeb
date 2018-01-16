/**
 * Created by v5njj on 16/3/29.
 */

//var shareURL = mpServerPath + '/auth/mpOAuth?redirectUrl=';// + encodeURIComponent(mpServerPath + '/first.jsp');
$(function() {
    $.ajaxSetup({
        'timeout': 5000
    });

    var actUrl = decodeURIComponent(window.location.href);
    var urlParams = actUrl.substr(actUrl.indexOf("?"));
    // 获取指定URL参数
    var showUrl = getQueryString(urlParams,"showUrl");
    var t = getQueryString(urlParams,"t");
    var type;
    var id;
    if (!checkEmptyString(t)) {
        var pa = t.split('_');
        type = pa[0];
        id = pa[1];
    }
    var fromId = getQueryString(urlParams,"fId");
    // alert(fromId)
    // var info_url = mpServerPath + '/share/getInfoDetail?id=' + id;
    var info_url = partnerServerPath + '/getZen4Weixin/getShareInfoById.do?shareInfoId=' + id + '&uid=' + fromId;
    var title;
    var description;
    var imageUrl;
    var shareSuccParam;
    var uid;

    document.getElementById("second_iframe").src = showUrl;

    var iframe = document.getElementById("second_iframe");
    var bHeight = 0;
    bHeight = iframe.contentWindow.document.body.scrollHeight;

    var dHeight = 0;
    dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
    // alert("bHeight =" + bHeight + "; dHeight=" + dHeight);
    // iframe.style.height = Math.max(bHeight, dHeight) + "px";
    // var testHeight = Math.max(bHeight, dHeight) + "px";
    // $("#second_iframe").css("height",testHeight);
    // var secondHeight = $("#second_iframe").css("height");
    // var secondWidth = $("#second_iframe").css("width");
    // $(".page").css("height",secondHeight);
    // $(".page").css("width",secondWidth);
    if ( type == type_info) {
      /**$.get(info_url, function(data, status){
          if (data.code == 0 ){
              title = data.msg.title;
              description =data.msg.description;
              imageUrl = data.msg.imageUrl;
          }

      });**/
      $.ajax({
        async: false,
        url: info_url,
        type: "get",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
        },
        success: function (data) {
            var result = $.parseJSON(data.shareInfo);
            var msg = result.msg;
            title = msg.title;
            description = msg.description;
            imageUrl = msg.imageUrl;
        }
    });
    }
    var openid;
    var param = JSON.stringify({ 'url': id , 'fromUid':fromId, 'action':1220});
                    // alert(param)
                    processClick(param);
    core.requireJS(['../js/jweixin-1.0.0.js', '../js/mpAPI.js'], function() {

        mp.oAuthAPI(function(data) {
            openid = data.openId;
            mp.jsAPI(function() {
            var param = JSON.stringify({ 'url': id , 'fromUid':fromId,'clickOpenId' : openid, 'action':1220});
                    processClick(param);
            	if (checkEmptyString(fromId)){
                    fromId = openid;
                } else if (!checkEmptyString(fromId)){
                    var count_url = mpServerPath + '/share/getClickCount?fromId='+fromId + '&url=' + t;
                    $.get(count_url, function(data, status){
                        if (data.code == 0){
                            var count = data.msg;
                            if (checkEmptyString(count)){
                                count = '0';
                            }
                        }

                    });
                }

                var shareURL = staticServicePath + '/second.html?fId=' + fromId + '&t='+t +'&showUrl='+ encodeURIComponent(showUrl);

                // 获取userId
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {

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
