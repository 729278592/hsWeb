$(function() {
    var uid;
    var inj;
    var baseUrl = hs_url;

    $.post("../publish/getInfo.do?", function (data) {
        if (data && data.img != "" && data.img != null) {
            var img=document.createElement('img');
            img.id = "origin";
            img.src = "http://" + baseUrl + "/zenlife_origin/data/publishImg/"+data.img;
            img.style.position="absolute";
            img.style.visibility='hidden';
            inj=document.getElementById('testImg1').appendChild(img);
        }
        if (data && data.comment !="" && data.comment != null) {
            $("#comment2Content").html(data.comment);
            if (data.commentId == 1) {
                $("#comment2Content").css("margin-left","192px");
            } else if (data.commentId == 2 || data.commentId == 4) {
                $("#comment2Content").css("margin-left","192px");
            } else {
                $("#comment2Content").css("margin-left","192px");
            }
        }
        uid = data.uid;
    }, 'json');

    setTimeout(function(){
        var width = inj.offsetWidth;
        var height = inj.offsetHeight;
        if (height/width > 328/258) {
            $("#origin").css("width","258px");
            $("#origin").css("visibility","visible");
            $("#origin").css("position","relative");
            $("#origin").css("z-index","-100");
        } else {
            $("#origin").css("height","406px");
            var left = (258 - inj.offsetWidth)/2;
            $("#origin").css("margin-left", left + "px");
            $("#origin").css("visibility","visible");
            $("#origin").css("position","relative");
            $("#origin").css("z-index","-100");
        }
    }, 300);
});