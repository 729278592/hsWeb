/**
 * Created by WHB on 2016/8/5.
 */
var confim = '<div class="weui_dialog_confirm hide" id="dialogConfirm">'+
             '<div class="weui_mask"></div>'+
                 '<div class="weui_dialog vux-dialog-transition">'+
                     '<div class="weui_dialog_hd">'+
                          '<strong class="weui_dialog_title"></strong>'+
                     '</div>'+
                     '<div class="weui_dialog_ft">'+
                         '<a href="javascript:;" class="weui_btn_dialog default" id="signCancel">取消</a>'+
                         '<a href="javascript:;" class="weui_btn_dialog primary" id="signSure">确定</a>'+
                     '</div>'+
                 '</div>'+
             '</div>';
$(".page").append(confim);

function confirmTip(message){
    var dialogConfirm = $("#dialogConfirm");
    dialogConfirm.removeClass("hide");
    dialogConfirm.find(".weui_dialog_title").text(message);
}