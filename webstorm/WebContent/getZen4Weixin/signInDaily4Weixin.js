$(function () {

    /*function getOrient(){
        if (window.orientation != undefined) {
            return window.orientation % 180 == 0 ? "portrait": "landscape"
        } else {
            return (window.innerWidth > window.innerHeight) ? "landscape": "portrait"
        };
    };

    getOrient();

    if(window.orientation!=0){
        var obj=document.getElementById('orientation');
        //alert('横屏内容太少啦，请使用竖屏观看！');
        alert(1);
        $('#body').css("transform","rotate(90deg)");
        alert(2);
        //obj.style.display='block';
    }

    window.onorientationchange=function(){
        var obj=document.getElementById('orientation');

        if(window.orientation==0){
            obj.style.display='none';
        }else
        {
            alert(3);
            $('#body').css("transform","rotate(90deg)");
            //alert('横屏内容太少啦，请使用竖屏观看！');
            alert(4);
            //obj.style.display='block';
        }
    };*/

    var htmlHeight = $("html").height();
    $("html").height(htmlHeight * 0.836);

    var width = $("body").width();
    var extra = 0;
    var dayNo = 0;

    /*$("#sign_in_total_num").css("font-size", width * 0.133);
    $("#sign_in_total_description").css("font-size", width * 0.053);*/
    /*$("#sign_in_zen_maked_num").css("font-size", width * 0.075);
    $("#sign_in_zen_maked_description").css("font-size", width * 0.053);*/

    //$("#sign_in_rank").css("border-left-width", width * 0.003);
    /*$("#sign_in_rank_num").css("font-size", width * 0.075);
    $("#sign_in_rank_description").css("font-size", width * 0.053);*/


    /*$("#sign_in_progress_chart_date").css("font-size", width * 0.27);
    $("#sign_in_progress_chart_unit").css("font-size", width * 0.053);
    $("#sign_in_progress_description").css("font-size", width * 0.048);
    $("#sign_in_rule").css("font-size", width * 0.04)

    $("#sign_in_bt_text").css("font-size", width * 0.053);
    $("#sign_in_bt_icon").css("width", width * 0.133);
    $("#sign_in_bt_point").css("font-size", width * 0.032);*/


    initial(extra, dayNo);

    $('.percentage-light').easyPieChart({
        barColor: function () {
            return '#68ae1d';
        },
        lineCap: 'butt',
        lineWidth: width * 0.02,
        animate: 1000,
        trackColor: '#dfdfdf',
        size: width * 0.6413
    });




    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    function initial(extra, dayNo) {

        var width = $("body").width();

        $.ajax({
            async: false,
            url: "../getZen4Weixin/mission.do",
            type: "get",
            success: function (data) {
                var period = data.msg.period;
                var extra = data.msg.extra;
                $("#sign_in_rule").html("连续签到" + period + "天,  额外奖励 " + extra + " 积分");
            }
        });

        $("#sign_in_progress_chart").css("left", -1 * width * 0.071);

        $.ajax({
            async: false,
            url: "../getZen4Weixin/missionDisplay.do",
            type: "get",
            success: function (data) {
                var checkInDays = data.msg.checkInDays;
                var checkInPoints = data.msg.checkInPoints;
                var percent = data.msg.percent;
                var turnOns = data.msg.turnOns;
                var remainDays = data.msg.remainDays;
                var dataPercent = turnOns * 100 / (turnOns + remainDays);
                try{
                	var point = data.msg.detail.point;
                    if (remainDays == 1) {
                        point += extra;
                    }
                }catch(e){
                	
                }
                if (remainDays == 0) {
                    dayNo = 1;
                } else {
                    dayNo = turnOns + 1;
                }
                $("#sign_in_total_num").html(checkInDays);
                $("#sign_in_zen_maked_num").html(checkInPoints);
                $("#sign_in_rank_num").html(percent);
                $("#sign_in_progress_chart_date").html(turnOns);
                $("#sign_in_progress_chart").attr("data-percent", dataPercent);
                $("#sign_in_bt_point").html("+" + point);
                if(data.msg.signToday > 0){
                	$("#sign_in_bt_text").html("已签到");
                }
            },
            error: function(e){
            	console.log(e);
            }
        });

        $("#sign_in_bt").on('click', function () {
            var jumpUrl;
            $.ajax({
                async: false,
                url: "../getZen4Weixin/getAds.do",
                type: "get",
                success: function (data) {
                   /* $("#mask").css("position","absolute");
                    $("#mask").css("margin-top",(-1)*517/590*(screen.height)+"px");
                    $("#mask").css("width", screen.width);
                    $("#mask").css("height", screen.height);
                    $("#mask").css("display","block");
                    $("#mask").css("background-color", "#7b7b7b");
                    $("#mask").css("opacity","0.6");
                    $("#mask").css("z-index","1000");
                    $("#ads").css("position","absolute");
                    $("#ads").css("width",870/1080*screen.width);
                    $("#ads").css("height",1350/1920*screen.height);
                    $("#ads").css("display","block");
                    $("#ads").css("margin-top",(-1)*429/590*screen.height+"px");
                    $("#ads").css("margin-left",(1080-870)/1080*(screen.width)/2+"px");
                    $("#ads").css("z-index","2000");
                    $("#adImg").css("display","block");
                    $("#adImg").attr("src",data.imgUrl);
                    $("#adImg").css("width",870/1080*screen.width);
                    $("#adImg").css("height",1350/1920*screen.height);
                    $("#close").css("display","block");
                    $("#close").css("width",90/1080*screen.width);
                    $("#close").css("height",90/1080*screen.width);
                    $("#closeImg").css("position","absolute");
                    $("#closeImg").css("display","block");
                    $("#closeImg").css("margin-left",290/360*screen.width + "px");
                    $("#closeImg").css("margin-top",(-1)*420/590*screen.height + "px");
                    $("#closeImg").css("width",90/1080*screen.width);
                    $("#closeImg").css("height",90/1080*screen.width);
                    $("#closeImg").css("z-index","3000");*/
                    jumpUrl = data.url;
                }
            });

            $("#adImg").click(function(){
                location.href = jumpUrl;
            });

            $("#closeImg").click(function(){
                $("#mask").css("display","none");
                $("#ads").css("display","none");
                $("#adImg").css("display","none");
                $("#close").css("display","none");
                $("#closeImg").css("display","none");
            });

            var url = '../getZen4Weixin/signIn.do?dayNo=' + dayNo;
            $.ajax({
                type: "POST",
                url: url,
                dataType: "json",
                success: function (obj) {
                    if (obj.code == '-302') {
                    	$("#sign_in_bt_text").html("已签到");//TODO
                        alert("今天已签到");
                        return false;
                    } else if (obj.code == '0') {
                        $.ajax({
                            async: false,
                            url: "../getZen4Weixin/updateEffect.do",
                            type: "get",
                            success: function (data) {
                                alert("签到成功");
                            }
                        });
                        location.reload(true);
                    } else {
                        alert("网络链接失败");
                        return false;
                    }
                },
                error: function () {
                }
            })
        });
    }
    function hengshuping() {
        var width = $("body").width();
        if (window.orientation == 180 || window.orientation == 0) {
            $("#sign_in_progress_chart").css("left", -1 * width * 0.107);
        }
        if (window.orientation == 90 || window.orientation == -90) {
            $("#sign_in_progress_chart").css("left", width * 0.049);
        }
    }
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);

    $("#backBtn").click(function(){
        window.history.back(-1);
    });
});


