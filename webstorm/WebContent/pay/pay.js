/**
 * Created by wufei on 16/4/5.
 */

$(function(){
    $("#test").click(function() {
        var outTradeNo = generateStr();
        var url = "http://" + hs_url + "/mxj_weixin/pay/getUnified";
        var userId = "16c713f0e685ba121a399195222f5f8c";
        var token = "";
        var body = "thisisatestbody";
        var notifyUrl = "http://" + hs_url + "/mxj_weixin/pay/notify?outTradeNo="+outTradeNo;
        var totalFee = "1";
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json", //必须有
            dataType: "json", //表示返回值类型，不必须
            data: JSON.stringify({"userId":userId,"token":token ,"body":body,"outTradeNo":outTradeNo,"notifyUrl":notifyUrl,"totalFee":totalFee}),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
            success: function (obj) {
                if (obj.msg && obj.msg.packageStr) {
                    WeixinJSBridge.invoke('getBrandWCPayRequest',{
                        "appId" : obj.msg.appId,
                        "timeStamp" : obj.msg.timeStamp,
                        "nonceStr" : obj.msg.nonceStr,
                        "package" : obj.msg.packageStr,
                        "signType" : obj.msg.signType,
                        "paySign" : obj.msg.sign
                    },function(res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {}
                    })
                }
            }
        });
    })
});

function generateStr() {
    var length = 32;
    var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    var pos = chars.length;
    var result = '';
    for (var i = 0; i  < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * pos));
    }
    return result;
}

