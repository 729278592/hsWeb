$(function(){
    var userId = '';

    $.post("../login/user.do?",function(obj){
        if (obj.userId) {
            userId = obj.userId;
            $.post("../mine/showall.do?",function(obj){
                if(obj && obj.user){
                    $("#name").html(obj.user.nickname);
                    $("#sharecount").html(obj.sharecount);
                    $("#mccount").html(obj.mccount);
                    $("#postcount").html(obj.postcount);
                    $("#points").html(obj.user.points);
                    $("#cash").html("￥"+obj.user.ready_money+"&nbsp;&nbsp;");
                    $(".yingxiangli").html(obj.effect);
                    $("#vip").html(obj.vip);
                    if(obj.hehuo){
                        $("#hehuo").html(obj.hehuo);
                    }
                }
            },'json');
        }
    },'json');

    $("#payTest").click(function(){
        window.location.replace("../pay/pay.do?");
    })
});