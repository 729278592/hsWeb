/**
 * Created by v5njj on 16/3/29.
 */

//var shareURL = mpServerPath + '/auth/mpOAuth?redirectUrl=';// + encodeURIComponent(mpServerPath + '/first.jsp');
var shareInfoId;
$(function() {
    $("#split").css("margin-top", 60 + "px");
    $("#split").css("margin-bottom", 60 + "px");
    $("#invitePic").css("margin-top", 60 + "px");
    var width = 392 * 90 / 100;
    var originLeft = screen.width * 3.5 / 100 + 193 * 1.04;
    var goLeft = (screen.width - width * 92 / 100) / 2;
    var goTop = 200 + 651 * 90.5 / 100;
    $("#qrImg").css("width", width + "px");
    $("#qrImg").css("margin-left", goLeft - originLeft + "px");
    $("#qrImg").css("margin-top", 0 - goTop + "px");

    $("#storeAndShare").css("bottom", 0);
    $("#storeAndShare").css("margin-left", "-1%");
    $("#storeAndShare").css("width", "101%");

    $("#storeWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");
    $("#shareWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");
    $("#storedWord").css("font-size", 5 / 100 * document.body.clientWidth + "px");

    $("#storeMask").click(function(){
      if ($("#storedWord").css("display") == "none") {
            $.ajax({
                async: false,
                url: partnerServerPath + "/getZen4Weixin/store.do?shareInfoId="+shareInfoId,
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
    var word4 = document.getElementById("bubbleWord4");
    var word5 = document.getElementById("bubbleWord5");
    var down = document.getElementById("nowDown");

    /**$("#bubbleWord").css("font-size",5.5 / 100 * document.body.clientWidth + "px");**/

    document.addEventListener('touchend',function(event){
      var e = event || window.event;
      var aim = e.srcElement || e.target;
      if (e.srcElement) {
        var aim = e.srcElement;
        if (aim != bubbleImg && aim != shareMask && aim != word1 && aim != word2 && aim != word3 && aim != word4 && aim != word5 && aim != down) {
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
        if (aim != bubbleImg && aim != shareMask && aim != word1 && aim != word2 && aim != word3 && aim != word4 && aim != word5 && aim != down) {
            $("#bubble").css("display","none");
            $("#mask").css("display","none");
            $("#bubbleWord").css("display","none");
        } else if (aim == shareMask || $("#shareMask").css("display")=="none") {
            $("#mask").css("display","block");
            $("#bubble").css("top","30px");
            $("#bubble").css("display","block");
            $("#bubbleWord").css("display","block");
        }
      }
    },false);

    // $(document).click(function(event){

    // });


      // document.onclick = function(event) {

      // }

    // $("#shareMask").click(function(){
      // $("#mask").css("display","block");
      // $("#bubble").css("top","100px");
      // $("#bubble").css("display","block");
    // });

    $.ajaxSetup({
        'timeout': 5000
    });

    var actUrl = decodeURIComponent(window.location.href);
    var urlParams = actUrl.substr(actUrl.indexOf("?"));
    // 获取指定URL参数
    var showUrl = getQueryString(urlParams,"showUrl");
    var t = getQueryString(urlParams,"t");
    shareInfoId = t.substring(t.indexOf("_") + 1,t.length);
    var fromId = getQueryString(urlParams,"fId");

    var shareOriginUrl = partnerServerPath + "/getZen4Weixin/checkStore.do?shareInfoId="+shareInfoId+"&uid="+fromId;
    // $.ajax({
    //           async: false,
    //           url: partnerServerPath + "/getZen4Weixin/checkStore.do?shareInfoId="+shareInfoId+"&uid="+fromId,
    //           type: "get",
    //           dataType : "json",
    //           success: function (data) {
    //               if (data.stored == true) {
    //                 $("#storeWord").css("display","none");
    //                 $("#storedWord").css("display","block");
    //               }
    //           }
    //       });

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

    var qrImg_url = mpServerPath + '/qr/getShareQr?uid='+fromId;
    $.get(qrImg_url, function(data, status){
        $("#qrImg").attr("src",data.msg);
    });

    // var info_url = mpServerPath + '/share/getInfoDetail?id=' + id;
    var info_url = partnerServerPath + '/getZen4Weixin/getShareInfoById.do?shareInfoId=' + id + '&uid=' + fromId;
    var title;
    var description;
    var imageUrl;
    var shareSuccParam;
    var uid;

    document.getElementById("second_iframe").src = showUrl;
    // var iframe = document.getElementById("second_iframe");
    // var bHeight = 0;
    // bHeight = iframe.contentWindow.document.body.scrollHeight;

    // var dHeight = 0;
    // dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
    // alert("bHeight =" + bHeight + "; dHeight=" + dHeight);
    // iframe.style.height = Math.max(bHeight, dHeight) + "px";
    // iframe.style.height = "10000px";
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
            // alert('分享标题----' + title);
            description = msg.description;
            imageUrl = msg.imageUrl;
            // alert("分享页面--------" + msg.infoUrl);
        }
    });
    }
    var openid;

    core.requireJS(['../js/jweixin-1.0.0.js', '../js/mpAPI.js'], function() {

        mp.oAuthAPI(function(data) {
            openid = data.openId;
            var sh_url = mpServerPath + "/share/saveGoodFlow";
            var headInfo = "application/json";//头信息
            var payData = JSON.stringify({"fromUid":fromId,"relId":id,"type":"good"});
            $.ajax({
						 type: "POST",
					     url: sh_url,
					     contentType: headInfo, //必须有
					     dataType: "json", //表示返回值类型，不必须
					     data:payData,
					     success: function (obj) {
					    	 if(debug){
					    		 //TODO 正式环境不需要
					    		 obj = eval("("+obj+")");
					    	 }
		             if (obj.msg) {
                    // alert("分享点击量增加成功");
		             }
					     }
					 });

            mp.jsAPI(function() {

            	if (checkEmptyString(fromId)){
                    fromId = openid;
                } else if (!checkEmptyString(fromId)){
                    var param = JSON.stringify({ 'url': t , 'fromUid':fromId,'clickOpenId' : openid});
                    processClick(param);
                    var count_url = mpServerPath + '/share/getClickCount?fromId='+fromId + '&url=' + t;
                    // var count_url = 'http://10.68.97.31:8080/mxj_weixin/rs/share/getClickCount?fromId='+fromId + '&url=' + t;
                    $.get(count_url, function(data, status){
                        if (data.code == 0){
                            var count = data.msg;
                            if (checkEmptyString(count)){
                                count = '0';
                            }
                            // $('#click_count').html(count) ;
                            // $('#click_count').style.fontSize = '35px';
                        }

                    });
                }

                var shareURL = staticServicePath + '/secondbkAll.html?fId=' + fromId + '&t='+t +'&showUrl='+ encodeURIComponent(showUrl) + "&type=" + share_type_good;

                var addZenUrl = partnerServerPath + "/getZen4Weixin/addZen.do?type=" + share_type_good + "&uid="+fromId+"&infoId="+id;
                // var shareURL = mpServerPath + '/auth/mpOAuth?redirectUrl=' + encodeURIComponent(redirectUrl);

                //获取userId
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {
                        // if (type = type_info && checkEmptyString(fromId)){
                        //     shareSuccess(shareSuccParam,fromId);
                        // }
                        $.post(partnerServerPath + "/share/add.do?type=" + share_type_info + "&id="+id,function(obj){
                          if (obj.message == 'success') {
                            alert("分享成功");

                            // $.post(addZenUrl,function(obj){
                            //     alert("积分增加成功Y");
                            // });

                            var count_share_url = mpServerPath + '/share/countShare?uid='+fromId;
                            $.get(count_share_url, function(data, status){
                                if (data.code == 0){
                                    // alert("更新成功");
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
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: description, // 分享描述
                    link: shareURL, // 分享链接
                    imgUrl: imageUrl, // 分享图标
                    success: function () {
                      $.post(partnerServerPath + "/share/add.do?type=" + share_type_info + "&id="+id,function(obj){
                        if (obj.message == 'success') {
                          alert("分享成功");
                          // $.post(addZenUrl,function(obj){
                          //     alert("积分增加成功Y");
                          // });

                          var count_share_url = mpServerPath + '/share/countShare?uid='+fromId;
                          $.get(count_share_url, function(data, status){
                              if (data.code == 0){
                                  // alert("更新成功");
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
        // alert(obj.m_desc);
        window.location.href = obj.m_desc;
      });
    });

    $("#nowDown").click(function(){
      $.post(partnerServerPath + "/cashRanking/getDownWebSite.do",function(obj){
        // alert(obj.m_desc);
        window.location.href = obj.m_desc;
      });
    });

});
