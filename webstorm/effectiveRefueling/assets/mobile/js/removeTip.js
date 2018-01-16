/**
 * Created by WHB on 2016/8/5.
 */
var errMessage =    '<div id="errMsg" style="display: none;">'+
                        '<div class="weui_mask_transparent fixed"></div>'+
                        '<div class="weui_toast">'+
                            '<p class="weui_toast_content">' +
                            '<img src="../../assets/mobile/images/smile_icon.png" alt="" id="smile-icon"/><br/>'+
                            '<span class="errSpan"></span>'+
                            '</p>'+
                        '</div>'+
                    '</div>';
$(".errDailog").append(errMessage);

function showErrMsg(message) {
    $("#errMsg .weui_toast_content .errSpan").append(message);
    $('#errMsg').show();
    $("#errMsg .weui_toast").addClass("weui_toastshow");
    setTimeout(function () {
        $("#errMsg .weui_toast").removeClass("weui_toastshow");
        $('#errMsg').hide();
        $("#errMsg .weui_toast_content .errSpan").empty();
    }, 2000);
}