var newHomeUid;
var newHomeToken;

function initUserPropertyData() {
    var obj = eval('(' + commonParamStr + ')');

    if (obj.uid && obj.token)
    {
        newHomeUid = obj.uid;
        newHomeToken = obj.token;
        console.log("uid is " + obj.uid);
        console.log("token is " + obj.token);

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
    }
}


$(function(){
    $.ajax({
        url: '../home/weather.do',
        type: 'POST',
        data: {},
        dataType: 'JSON',
        async: true,
        success: function (obj) {
            $("#city").html(obj.weather.city);
            $("#temperature").html(obj.weather.temperature + "℃");
            if (obj && obj.isLink) {
                if (obj.isLink == "true") {
                    $("#mobileConnected").html("连接状态:已连接");
                    $("#connectPic").attr("src", "../skins/newHome/img/Mobile_service_connected.png");
                } else {
                    $("#mobileConnected").html("连接状态:未连接");
                    $("#connectPic").attr("src", "../skins/newHome/img/Mobile_service.png");
                }
            }
        }
    });

    initUserPropertyData();

    $("#headImg").click(function(){
        if (newHomeUid == null && newHomeToken == null) {
            window.parent.postMessage({ "fnName": "navigateToLogin"}, '*');
        }
    });

    $("#task").click(function(){
        if (newHomeUid == null && newHomeToken == null) {
            window.parent.postMessage({"fnName": "navigateToLogin"}, '*');
        } else {
            if (typeof (UWP) != "undefined" && UWP != null) {
                window.parent.postMessage({
                    fnName : "asusIframeReturn"
                },'*');
            } else {
                parent.AppMain.Main.asusIframeReturn();
            }
            window.location = "../getZen/shareInfoMission.do?uid=" + newHomeUid + "&token=" + newHomeToken;
        }
    });

    $("#coupon").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"https://s.phone580.com/project/asus/recharge/#/coupon?item=coupon"}},'*');
    });

    $("#exchange").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"mall"}},"*");
    });

    $("#lifeService").click(function(){
        if (newHomeUid == null && newHomeToken == null) {
            window.parent.postMessage({"fnName": "navigateToLogin"}, '*');
        } else {
            
        }
    });

    $("#mobileManager").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"install"}},'*');
    });

    $("#crew").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"https://s.phone580.com/project/asus/recharge/#/video/mgTV?item=video"}},'*');
    });

    $("#zen").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"play"}},'*');
    });

    $("#store").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"http://store.asus.com.cn/"}},'*');
    });

    $("#phone").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"calls"}},"*");
    });

    $("#net").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"target":"resource"}},'*');
    });

    $("#service").click(function(){
        window.parent.postMessage({"fnName":"asusHomeAction","options":{"openPortal":"http://www.asus.com/cn/support/callus"}},'*');
    });
});