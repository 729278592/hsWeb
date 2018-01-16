$(function() {
    var inj;
    var uid;
    var width;
    var height;
    var url = window.location.href;
    uid = url.substring(url.indexOf("=") + 1,url.indexOf("&"));
    var baseUrl = hs_url;

    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            alert('竖屏状态！');
        }
        if (window.orientation === 90 || window.orientation === -90 ){
            /*$("#out").style.display='block';
            $("#frame").style.display='block';*/
            alert('横屏状态！');
        }
    }, false);

    //$("#frame").css("width",screen.width);
    //$("#frame").css("height",screen.height - 66);

    $("html").css("width","100%");
    $("html").css("height","100%");

    $("body").css("width","100%");
    $("body").css("height","100%");

    $("#frame").css("width","100%");
    $("#frame").css("height","100%");



    var heightStr = $("html").css("height");
    var widthStr = $("html").css("width");
    width = widthStr.substring(0, widthStr.length - 2);
    height = heightStr.substring(0, heightStr.length - 2);
    $("#out").css("margin-top",-1 * (parseInt(height) + 3) + "px");

    /*var ub = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ub)) {
        alert("iphone");
    } else if (/android/.test(ub)) {
        alert("android");
    }*/

    core.requireJS(['../publish/jweixin-1.0.0.js','../publish/mpAPI.js'],function(){
        mp.oAuthAPI(function(data){
            if (data.openId == "" || data.openId == null) {
                uid = url.substring(url.indexOf("=")+1, url.length);
                var param = JSON.stringify({ 'url': "result_url" , 'fromUid':uid,'clickOpenId' : ""});
                processClick(param);
            } else {
                var param = JSON.stringify({ 'url': "result_url" , 'fromUid':uid,'clickOpenId' : data.openId});
                processClick(param);
            }
        });
    });

    $.post("../publish/getInfo.do?", function (data) {
        if (data && data.img != "" && data.img != null) {

            var img=document.createElement('img');
            img.id = "result";
            img.src = "http://" + baseUrl + "/zenlife_origin/data/publishImg/"+data.img;
            img.style.position="absolute";
            img.style.visibility='hidden';
            inj=document.getElementById('img').appendChild(img);
        }
        if (data && data.comment != "" && data.comment != null) {
            $("#comment2Content").html(data.comment);
            /*if (data.commentId == 1) {
                $("#comment2Content").css("margin-left","157px");
            } else if (data.commentId == 2 || data.commentId == 4) {
                $("#comment2Content").css("margin-left","158px");
            } else {
                $("#comment2Content").css("margin-left","163px");
            }*/
        }
        uid = data.uid;
    }, 'json');

    setTimeout(function(){
        var innerWidth = inj.offsetWidth;
        var innerHeight = inj.offsetHeight;
        var littleWidth = parseInt(height)*0.82/innerHeight * innerWidth;
        var move = (littleWidth - screen.width) / 2;
        if (innerHeight/innerWidth > 328/258) {
            $("#result").css("width",width+"px");
            $("#result").css("height",parseInt(height)*0.82+"px");
            /*$("#result").css("width",screen.width);
             $("#result").css("height",screen.height - 66);*/
            $("#result").css("visibility","visible");
            $("#result").css("position","relative");
            $("#result").css("z-index","-100");

        } else {
            /*$("#result").css("width",width+"px");*/
            $("#result").css("height",parseInt(height)*0.82+"px");
            /*$("#result").css("width",screen.width);
             $("#result").css("height",screen.height - 66);*/
            var left = (screen.width - inj.offsetWidth)/2;
            $("#result").css("margin-left", -1 * move + "px");
            $("#result").css("visibility","visible");
            $("#result").css("position","relative");
            $("#result").css("z-index","-100");
            $("#comment1Content").css("margin-top","30px");
            $("#comment2Content").css("margin-top","52px");
            /*$("#result").css("margin-top","-2px");*/
        }
    }, 300);

    function processClick(param){

        $.ajax({
            async: false,
            url: "../publish/saveFlow.do?param="+param,
            type: "get",
            success: function (data) {
            }
        });
    }
})