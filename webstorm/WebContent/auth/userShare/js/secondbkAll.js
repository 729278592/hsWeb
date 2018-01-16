var shareInfoId;

//转换type
var relType = "";

$(function() {

    var actUrl = decodeURIComponent(window.location.href);
    var urlParams = actUrl.substr(actUrl.indexOf("?"));
    // 获取指定URL参数
    var showUrl = getQueryString(urlParams,"showUrl");
    var method = getQueryString(urlParams,"type");
    var t = getQueryString(urlParams,"t");
    shareInfoId = t.substring(t.indexOf("_") + 1,t.length);
    var fromId = getQueryString(urlParams,"fId");
    
	//转换type
	relType = method;
//	if(method==share_type_store){
//		relType = "shop";
//	}
//	else if(method==share_type_info){
//		relType = "share";
//	}
	
    //检查是否收藏过
    var shareOriginUrl = partnerServerPath + "/getZen4Weixin/checkStore.do?shareInfoId="+shareInfoId+"&uid="+fromId + "&type=" + relType ;
    $.get(shareOriginUrl, function(data, status){
        if (data.stored == true) {
            $("#storeWord").css("display","none");
            $("#storedWord").css("display","block");
        }
    });
    var idd = getQueryString(urlParams, "fId");
    var type;
    var id;
    if (!checkEmptyString(t)) {
        var pa = t.split('_');
        type = pa[0];
        id = pa[1];
    }
    //获取二维码
    var qrImg_url = mpServerPath + '/qr/getShareQr?uid='+fromId;
    $.get(qrImg_url, function(data, status){
        $("#qrImg").attr("src",data.msg);
    });
    $("#split").css("margin-top", 60 + "px");
    $("#split").css("margin-bottom", 60 + "px");
    $("#invitePic").css("margin-top", 60 + "px");
    var width = 392 * 90 / 100;
    var originLeft = screen.width * 3.5 / 100 + 193 * 1.04;
    var goLeft = (screen.width - width * 92 / 100) / 2;
    var goTop = 200 + 651 * 90.5 / 100;
    var shareSentence;
    $("#qrImg").css("width", width + "px");
    $("#qrImg").css("margin-left", goLeft - originLeft + "px");
    $("#qrImg").css("margin-top", 0 - goTop + "px");
    $("#storeAndShare").css("bottom", 0);
    $("#storeAndShare").css("margin-left", "-1%");
    $("#storeAndShare").css("width", "101%");
    $("#storeWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");
    $("#shareWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");
    $("#storedWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");
    
    //用户点击收藏事件
    $("#storeMask").click(function(){
        if ($("#storedWord").css("display") == "none") {
            $.ajax({
                async: false,
                url: partnerServerPath + "/getZen4Weixin/store.do?shareInfoId="+shareInfoId + "&type=" + relType,
                type: "get",
                dataType : "json",
                success: function (data) {
                    $("#storeWord").css("display","none");
                    $("#storedWord").css("display","block");
                }
            });
        }
    });
    
    var bubbleImg = document.getElementById("bubbleImg");
    var shareMask = document.getElementById("shareMask");
    var word1 = document.getElementById("bubbleWord1");
    var word2 = document.getElementById("bubbleWord2");
    var word3 = document.getElementById("bubbleWord3");
    /*var word4 = document.getElementById("bubbleWord4");
     var word5 = document.getElementById("bubbleWord5");*/
    /*var down = document.getElementById("nowDown");*/

    document.addEventListener('touchend',function(event){
        var e = event || window.event;
        var aim = e.srcElement || e.target;
        
        if (e.srcElement) {
            var aim = e.srcElement;
            if (aim != bubbleImg && aim != shareMask && aim != word1 && aim != word2 && aim != word3) {
                $("#bubble").css("display","none");
                $("#mask").css("display","none");
                $("#bubbleWord").css("display","none");
            } else if (aim == shareMask || $("#shareMask").css("display")=="none") {
                $("#mask").css("display","block");
                $("#bubble").css("top","30px");
                $("#bubble").css("display","block");
                $("#bubbleWord").css("display","block");
            }
        } else {
            var aim = e.target;
            if (aim != bubbleImg && aim != shareMask && aim != word1 && aim != word2 && aim != word3) {
                $("#bubble").css("display","none");
                $("#mask").css("display","none");
                $("#bubbleWord").css("display","none");
            } else if (aim == shareMask || $("#shareMask").css("display")=="none") {
                $("#mask").css("display","block");
                $("#bubble").css("top","30px");
                $("#bubble").css("display","block");
                /*$("#bubbleWord").css("display","block");*/
            }
        }
    },false);

    $.ajaxSetup({
        'timeout': 5000
    });
    
    //加载文章
    var info_url = partnerServerPath + '/getZen4Weixin/getShareInfoById.do?shareInfoId=' + id + '&uid=' + fromId;
    var title;
    var description;
    var imageUrl;
    var shareSuccParam;
    var uid;

    document.getElementById("second_iframe").src = showUrl;
    if ( type == type_info) {
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
    
    //if weixin start
    if( is_weixn() ){
    	
    var openid="";
    core.requireJS(['../js/jweixin-1.0.0.js', '../js/mpAPI.js'], function() {
        mp.oAuthAPI(function(data) {
            openid = data.openId;
            mp.jsAPI(function() {
                if (!checkEmptyString(fromId)){
                    var param = JSON.stringify({ 'url': id , 'fromUid':fromId,'clickOpenId' : openid,'type':relType, 'action':1221});
                    //记录用户点击行为,加积分
                    processClick(param);
                }
                
                var shareURL = staticServicePath + '/secondbkAll.html?fId=' + fromId + '&t='+t +'&showUrl='+ encodeURIComponent(showUrl) + '&type='+method;
                var addShareUrl = partnerServerPath + "/share/add.do?type=" + share_type_info + "&id="+id;

                //分享朋友圈
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {
                        $.post(addShareUrl,function(obj){
                            if (obj.message == 'success') {
                                alert("分享成功");

                                //分享头条时加积分:微信侧只负责上报，省事儿负责校验
                                if (method==share_type_info) {
                                var addZenUrl = partnerServerPath + "/getZen4Weixin/addZen.do?uid="+fromId+"&infoId="+id;
                                    $.post(addZenUrl,function(obj){
                                    });
                                }

                                //更新用户分享次数
                                var count_share_url = mpServerPath + '/share/countShare?uid='+fromId;
                                $.get(count_share_url, function(data, status){
                                    if (data.code == 0){
                                    }
                                });
                            } else {
                                alert("分享失败");
                            }
                        },'json');
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        console.log("分享朋友圈失败")
                    }
                });
                //分享到好友
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: description, // 分享描述
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {
                        $.post(addShareUrl,function(obj){
                            if (obj.message == 'success') {
                                alert("分享成功");

                                //只有为分享任务时,分享时才加积分
                                if (method==share_type_info) {
                                var addZenUrl = partnerServerPath + "/getZen4Weixin/addZen.do?uid="+fromId+"&infoId="+id;
                                    $.post(addZenUrl,function(obj){
                                    });
                                }
                                var count_share_url = mpServerPath + '/share/countShare?uid='+fromId;
                                $.get(count_share_url, function(data, status){
                                    if (data.code == 0){
                                    }
                                });
                            } else {
                                alert("分享失败");
                            }
                        },'json');

                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        console.log("分享朋友失败")
                    }
                });
            }, false);
        });
    });

    $("#buddleWord5").click(function(){
        $.post(partnerServerPath + "/cashRanking/getDownWebSite.do",function(obj){
            window.location.href = obj.m_desc;
        });
    });

    $("#nowDown").click(function(){
        $.post(partnerServerPath + "/cashRanking/getDownWebSite.do",function(obj){
            window.location.href = obj.m_desc;
        });
    });
    
    }//if weixin end
    else
	{	
    	// 如果不是微信客户端打开的，直接记录用户行为(APK专用)
    	var openId = "";
    	if (!checkEmptyString(fromId)){
             var param = JSON.stringify({ 'url': id, 'fromUid':fromId,'clickOpenId' : openId,'type':relType, 'action':1221 });
             //记录用户点击行为,加积分
             processClick(param);
        }
	}
})
function earn_goback(){
	window.location.href = "file:///android_asset/WebContent/index.html";
}