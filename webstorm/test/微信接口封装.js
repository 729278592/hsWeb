$(function () {
    // 3. 通过config接口注入权限验证配置
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: commonJson.AppID, // 必填，公众号的唯一标识
        timestamp: commonJson.TimeStamp, // 必填，生成签名的时间戳
        nonceStr: commonJson.NonceStr, // 必填，生成签名的随机串
        signature: commonJson.Signature, // 必填，签名，见附录1
        jsApiList: [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "chooseImage",
            "uploadImage",
            "downloadImage",
            "previewImage"


        ]
    });

    // 4. 通过ready接口处理成功验证
    wx.ready(function () {

        weixin.wxShareTimeline(); //微信分享到朋友圈

        weixin.wxShareAppMessage(); //微信分享给朋友

        weixin.wxShareWeibo(); //微信分享到微博

        weixin.wxShareQQ(); //微信分享到QQ

    });

    // 5. 通过error接口处理失败验证
    wx.error(function (res) {
        //alert(JSON.stringify(res));
        //alert("微信接口验证失败!查看是否配置url");
    });

    //获取头像
    $("#imgTop").click(function () {

        weixin.wxChooseImage(); //获取手机图片
    })

    //获取广告图片
    $("#imgAdve").click(function () {

        weixin.wxChooseGgImage(); //获取广告图片
    })

    $(".clickpic").click(function () {
        var picurl = $(".clickpic").attr("data");
        //预览图片
        wx.previewImage({
            current: picurl, // 当前显示的图片链接
            urls: urls // 需要预览的图片链接列表
        });


    })


});

var imgUrl = $("#shareImg").text(); //图片url
var descContent = document.title;    //描述内容
var shareTitle = document.title;     //标题
var weixin = {

    localIds: "",
    serverId: "",

    //微信分享到朋友圈
    wxShareTimeline: function () {
        wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: lineLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数

            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    },

    //微信分享给朋友
    wxShareAppMessage: function () {
        wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: commonJson.sharelanguage, // 分享描述
            link: lineLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

    },

    //微信分享到微博
    wxShareWeibo: function () {
        wx.onMenuShareWeibo({
            title: shareTitle, // 分享标题
            desc: commonJson.sharelanguage, // 分享描述
            link: lineLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

    },

    //微信分享到QQ
    wxShareQQ: function () {
        wx.onMenuShareQQ({
            title: shareTitle, // 分享标题
            desc: commonJson.sharelanguage, // 分享描述
            link: lineLink, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    },

    //获取手机图片
    wxChooseImage: function () {
        wx.chooseImage({
            success: function (res) {
                weixin.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $("#imgTop").attr("src", weixin.localIds);
                weixin.wxUploadImge(0);
            }
        });
    },

    //上传图片
    wxUploadImge: function (param) {
        wx.uploadImage({
            localId: weixin.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                weixin.serverId = res.serverId; // 返回图片的服务器端ID

                weixin.wxDownImge(param);

            },
            fail: function (res) {
                alert("图片上传失败");


            }
        });
    },

    //下载图片到我们服务器
    wxDownImge: function (param) {
        var strurl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + commonJson.tonkey + "&media_id=" + weixin.serverId
        $.ajax({
            type: "POST",
            url: "/index.php?g=WShop&m=AjaxProduct&a=index",
            data: { "act": "uploadwximage", "access_token": commonJson.tonkey, "media_id": weixin.serverId },
            async: true,
            success: function (res) {
                res=$.parseJSON(res);
                if (res == 0) {
                    alert("下载图片失败")
                } else {
                    if (param == 0) {
                        $("#imgTop").attr("src", res);
                        $("#ImgeTop").val(res);
                    } else {
                        $("#imgAdve").attr("src", res);
                        $("#ImgeAdve").val(res);
                    }
                }

            }

        });
    },

    //获取手机图片
    wxChooseGgImage: function () {
        wx.chooseImage({
            success: function (res) {
                weixin.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $("#imgAdve").attr("src", weixin.localIds);
                weixin.wxUploadImge(1);
            }
        });
    }

}