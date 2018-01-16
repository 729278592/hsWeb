$(function() {
    var subcontent = "";
    var subId = "";
    var inj;
    var width;
    var height;
    var baseUrl = hs_url;

    $.post("../publish/getInfo.do?", function (data) {
        if (data && data.img) {
            var img=document.createElement('img');
            img.id = "origin";
            img.src = "http://" + baseUrl + "/zenlife_origin/data/publishImg/"+data.img;
            img.style.position="absolute";
            img.style.visibility='hidden';
            inj=document.getElementById('box').appendChild(img);

            $("#userimg").attr("edited","1");
            $("#userimg").attr('src',"http://" + baseUrl + "/zenlife_origin/data/publishImg/"+data.img);
        }
        if (data && data.commentId != "" && data.commentId != null){
            $("#radio_1").parent("span").attr("class","pay_list_c1 off");
            $("#radio_"+data.commentId).parent("span").attr("class","pay_list_c1 on");
        }
    }, 'json');

    setTimeout(function(){
        width = inj.offsetWidth;
        height = inj.offsetHeight;
        $.ajax({
            async: false,
            url: "../publish/cut.do?width="+width+"&height="+height,
            type: "get",
            success: function (data) {
                $("#box").css("display","none");
            }
        });
    }, 300);

    $("#userimg").click(function () {
        for (var i = 1; i <= 5; i++) {
            if ($("#radio_"+i).parent("span").attr("class") == "pay_list_c1 on") {
                subId = i;
                subcontent = $("#subcontent_"+i).html();
            }
        }
        $.ajax({
            async: false,
            url: "../publish/saveComment.do?comment="+subcontent+"&commentId="+subId,
            type: "get",
            success: function (data) {
            }
        });
        $("#img_head").click();
    });
    $("#img_head").change(function () {
        checkFormat(this);
    });
    $("#shareWord").mousedown(function(){
        $(this).attr("src","../skins/publish/img/btn_赚家分享汇_p.png");
    });
    $("#shareWord").mouseup(function() {
        $(this).attr("src","../skins/publish/img/btn_赚家分享汇_n.png");
    });
    $("#share").mousedown(function(){
        $(this).attr("src","../skins/publish/img/btn_赚家分享汇_p.png");
    });
    $("#share").mouseup(function() {
        $(this).attr("src","../skins/publish/img/btn_赚家分享汇_n.png");
    });

    $(".radioclass").click(function(){
        for (var i = 1; i <= 5; i++) {
            $("#radio_"+i).attr("checked", "unchecked");
            $("#radio_"+i).parent("span").attr("class", "pay_list_c1 off");
        }
       var id = $(this).attr("id");
       var no = id.substring(5,7);
       var subcontentId = "subcontent"+no;
       $(this).attr("checked", "checked");
       $(this).parent("span").attr("class","pay_list_c1 on");
       subcontent = $("#"+subcontentId).html();
        subId = no.substring(1,2);
    });


    $("#sharePart").click(function(){
        if ($("#userimg").attr("edited") == "0") {
            alert("请先上传头像");
            return false;
        }
        for (var i = 1; i <= 5; i++) {
            if ($("#radio_"+i).parent("span").attr("class") == "pay_list_c1 on") {
                subId = i;
                subcontent = $("#subcontent_"+i).html();
            }
        }
        $.ajax({
            async: false,
            url: "../publish/saveComment.do?comment="+subcontent+"&commentId="+subId,
            type: "get",
            success: function (data) {
            }
        });
        location.href="http://" + baseUrl + "/mxj/wxlogin/cut.do";
    });

    function checkFormat(th) {
        var filePath = th.value;
        var i = filePath.lastIndexOf('.');
        var len = filePath.length;
        var str = filePath.substring(len, i + 1);
        var extName = "JPG,GIF,PNG,JPEG,BMP";
        if (extName.indexOf(str.toUpperCase()) < 0) {
            th.remove();
            alert("请选择正确的图片文件!");
        } else {
            $.ajaxFileUpload({
                url:"../publish/upload.do",
                type:'post',
                fileElementId:'img_head',
                data:null,
                dataType:'json',
                success:function(){
                    location.reload();
                }
            });
        }
    }
})