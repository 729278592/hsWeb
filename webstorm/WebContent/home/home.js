function initUserPropertyData() {
    var obj = eval('(' + commonParamStr + ')');

    //alert(obj.token);
    //alert(!obj.uid && typeof(obj.uid)!="undefined" && obj.uid!=0);
    //alert(!obj.token && typeof(obj.token)!="undefined" && obj.token!=0);

    var params = JSON.stringify({type: 'total'});

    if (obj.uid && obj.token)
    {
        console.log("uid is " + obj.uid);
        console.log("token is " + obj.token);
        $.ajax({
            async: true,
            type: "POST",
            url: url_ssl_prefix + hs_url + pcUserPropertyRankPersonalApi,
            contentType: "application/json; charset=utf-8",
            data: params,
            dataType: "JSON",
            crossDomain: true,
            beforeSend: function (request) {
                request.setRequestHeader("A-Common-Param", commonParamStr);
                request.setRequestHeader("A-Channel", apiKey);
                request.setRequestHeader("A-Timestamp", currentTime);
                request.setRequestHeader("A-Sign", sign);
            },
            success: function (data) {
                if (data) {
                    var code = data.code;
                    var msg = data.msg;
                    var points = 0;
                    var rank = 0;
                    var percentage = 0;
                    if ('' != uid) {
                        if ("-20030" == code || "-20009" == code || "-20005" == code) {
                            if (typeof (UWP) != "undefined" && UWP != null) {
                                window.parent.postMessage({
                                    fnName: "userLoginDateTip",//
                                    options: {
                                        code: code
                                    }
                                }, '*');
                            } else {
                                parent.AppMain.User.userLoginDateTip(code);
                            }
                        } else if ("0" == code) {
                            if (msg.points != null) {
                                points = msg.points;
                            }
                            if (msg.rank != null) {
                                rank = msg.rank;
                                if (rank > 500) {
                                    rank = "500+";
                                }
                            }
                            if (msg.percentage != null) {
                                percentage = msg.percentage;
                            }
                        }
                    }
                    $("#assetsCnt_num").html(points);
                    $("#assetsRank").html(rank);
                    $("#assetsRate").attr("data-percent", percentage);
                    if (rank / 10 <= 1) {
                        $("#assetsRank").css({left: "87px"});
                    } else if (rank / 10 > 1 && rank / 10 < 10) {
                        $("#assetsRank").css({left: "78px"});
                    } else if (rank / 10 >= 10 && rank <= 500) {
                        $("#assetsRank").css({left: "66px"});
                    } else {
                        $("#assetsRank").css({left: "59px"});
                    }
                }

                $('.percentage').easyPieChart({
                    animate: 1000
                });
                $('.percentage-light').easyPieChart({
                    barColor: function () {
                        return "rgb(255,255,255)";
                    },
                    lineCap: 'butt',
                    lineWidth: 12,
                    animate: 1000
                });
            },
            error: function () {
                console.log("获取个人排位失败");
            }
        });
    }
}

function initAnimation() {
    var sWidth = $("#focus").width(); //获取焦点图的宽度（显示面积）
    var littleSWidth = $("#little-focus").width();
    var bigSWidth = $("#big-focus").width();
    var len = $("#focus ul li").length; //获取焦点图个数
    var littleLen = $("#little-focus ul li").length;
    var bigLen = $("#big-focus ul li").length;
    var index = 0;
    var littleIndex = 0;
    var bigIndex = 0;
    var picTimer;
    var littlePicTimer = 0;
    var bigPicTimer = 0;

    //显示图片函数，根据接收的index值显示相应的内容
    function showPics(index) { //普通切换
        var nowLeft = -index * sWidth; //根据index值计算ul元素的left值
        $("#focus ul").stop(true, false).animate({"left": nowLeft}, 300); //通过animate()调整ul元素滚动到计算出的position
        //$("#focus .btn span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
        $("#focus .btn span").stop(true, false).animate({"opacity": "0.4"}, 300).eq(index).stop(true, false).animate({"opacity": "1"}, 300); //为当前的按钮切换到选中的效果
    }

    function showBigPics(bigIndex) {
        var nowLeft = -bigIndex * bigSWidth;
        $("#big-focus ul").stop(true, false).animate({"left": nowLeft}, 300);
    }

    if (!checkEmptyString(token)) {
        // console.log('have token!');
        $('#illustrator_banner').css({display: "none"});
        // location.reload(true);
        //本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
        $("#focus ul").css("width", sWidth * (len));
        $("#big-focus ul").css("width", bigSWidth * (bigLen));
        // $("#little-focus ul").css("width", littleSWidth * (littleLen));
        //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
        $("#focus").hover(function () {
            clearInterval(picTimer);
        }, function () {
            picTimer = setInterval(function () {
                showPics(index);
                index++;
                if (index == len) {
                    index = 0;
                }
            }, 5000); //此4000代表自动播放的间隔，单位：毫秒
        }).trigger("mouseleave");
    } else {
        // console.log('no token!');
        //本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
        $("#focus ul").css("width", sWidth * (len));
        $("#big-focus ul").css("width", bigSWidth * (bigLen));
        // $("#little-focus ul").css("width", littleSWidth * (littleLen));
        //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
        $("#focus").hover(function () {
            clearInterval(picTimer);
        }, function () {
            picTimer = setInterval(function () {
                showPics(index);
                index++;
                if (index == len) {
                    index = 0;
                }
            }, 5000); //此4000代表自动播放的间隔，单位：毫秒
        }).trigger("mouseleave");

        $("#big-focus").hover(function () {
            clearInterval(bigPicTimer);
        }, function () {
            bigPicTimer = setInterval(function () {
                showBigPics(bigIndex);
                bigIndex++;
                if (bigIndex == bigLen) {
                    bigIndex = 0;
                }
            }, 3000)
        }).trigger("mouseleave");
    }
}

$(function () {
    //获取通用参数

    getApiCommonDatas4Home();
    initAnimation();
    initUserPropertyData();

    $(this).click(function () {
        $("#searchInputBg").attr("src", "../skins/home/img/btn_bg_search_n.png");
        if ($("#searchInput").val() == '') {
            $("#searchInput").val('HC手机');
        }
    });

    $("#searchInput").click(function (e) {
        e = e || event;
        stopFunc(e);
        if ($("#searchInput").val() == 'HC手机') {
            $("#searchInput").val('');
        }
        $("#searchInputBg").attr("src", "../skins/home/img/btn_bg_search_p.png");
    });

    function stopFunc(e) {
        e.stopPropagation() ? e.stopPropagation() : e.cancelBubble = true;
    }

    $.ajax({
        url: '../home/weather.do',
        type: 'POST',
        data: {},
        dataType: 'JSON',
        async: true,
        success: function (obj) {
            $("#city").html(obj.weather.city);
            $("#weatherIcon").attr("src", obj.weather.icon);
            $("#temperature").html(obj.weather.temperature);
            if (obj && obj.isLink) {
                if (obj.isLink == "true") {
                    $("#mobileConnected").html("手机已连接");
                    $("#connectPic").attr("src", "../skins/home/img/icon_connect.png");
                } else {
                    $("#mobileConnected").html("手机未连接");
                    $("#connectPic").attr("src", "../skins/home/img/icon_disconnect.png");
                }
            }
        }
    });

    $("#searchInput").hover(
        function () {
            if ($("#searchInput").is(":focus")) {
            } else {
                $("#searchInputBg").attr("src", "../skins/home/img/btn_bg_search_p.png");
            }
        },
        function () {
            if ($("#searchInput").is(":focus")) {
            } else {
                /*var length = $("#searchInput").val().length;
                alert(length);
                if (length == 0) {
                    $("#searchInput").val("HC手机");
                }*/
                $("#searchInput").val("HC手机");
                $("#searchInputBg").attr("src", "../skins/home/img/btn_bg_search_n.png");
            }
        });

    $("#searchIconPic").click(function () {
        console.log("进入搜索点击方法");
        var query = $("#searchInput").val();
        console.log("搜索能容是 " + query);
        $("#searchIconPic").css("outline", 0);
        $("#searchIconPic").attr("src", "../skins/home/img/btn_search_h.png");

        if (typeof (UWP) != "undefined" && UWP != null) {
            console.log("这是uwp版本");
            window.parent.postMessage({"fnName":"asusHomeAction","options":{target:"keyword", search:query}},'*');
        } else {

        }
	});

    $("#zenbiIcon").hover(
        function () {
            $("#zenbiIcon").attr("src", "../skins/home/img/btn_zenbi_h.png");
            $("#zenbiWord").css("color", "#ff620d")
        },
        function () {
            $("#zenbiIcon").attr("src", "../skins/home/img/btn_zenbi_n.png");
            $("#zenbiWord").css("color", "#778088")
        });

    $("#changeIcon").hover(
        function () {
            $("#changeIcon").attr("src", "../skins/home/img/btn_log_h.png");
            $("#changeWord").css("color", "#ff620d")
        },
        function () {
            $("#changeIcon").attr("src", "../skins/home/img/btn_log_n.png");
            $("#changeWord").css("color", "#778088")
        });

    $("#storeIcon").hover(
        function () {
            $("#storeIcon").attr("src", "../skins/home/img/btn_store_h.png");
            $("#storeWord").css("color", "#ff620d")
        },
        function () {
            $("#storeIcon").attr("src", "../skins/home/img/btn_store_n.png");
            $("#storeWord").css("color", "#778088")
        });

    if (typeof (UWP) != "undefined" && UWP != null) {
        $("#store").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"http://store.asus.com.cn/"}},'*');
        });

        $("#customer").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"http://www.asus.com/cn/support/callus"}},'*');
        });

        $("#mobile_manage_box").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"install"}},'*');
        });

        $("#assets").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"assets"}},'*');
        });

        $("#total_benefit").click(function(){
            console.info("总计收益点击");
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"assets"}},'*');
        });

        $("#my_individual_property").click(function(){
            console.info("我的资产点击");
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"assets"}},'*');
        });

        $("#rank").click(function(){
            console.info("财富排行点击");
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"assets"}},'*');
        });

        $("#assetsCnt").click(function(){
            console.info("积分数量点击");
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"assets"}},'*');
        });

        $("#play").click(function () {
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"play"}},'*');
        });

        $("#record").click(function () {
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"record"}},'*');
        });

        $("#mall").click(function () {
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"mall"}},"*");
        });

        $("#telephone").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"calls"}},"*");
        });

        $("#life").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"service"}},'*');
        });

        $("#netResource").click(function(){
            window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"resource"}},'*');
        });
    } else {

    }
});
