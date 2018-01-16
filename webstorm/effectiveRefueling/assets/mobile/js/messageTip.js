/**
 * Created by WHB on 2016/5/16.
 */

$(function(){
    var errMessage = '<div id="errMsg" style="display: none;">'+
                         '<div class="weui_mask_transparent fixed"></div>'+
                         '<div class="weui_toast">'+
                             '<p class="weui_toast_content">' +
                                  '<img src="../../assets/mobile/images/smile_icon.png" alt="" id="smile-icon"/><br/>'+
                                  '<span class="errSpan"></span>'+
                             '</p>'+
                         '</div>'+
                     '</div>';
    $(".errDailog").append(errMessage);



  var loadingToast = '<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
                     '<div class="weui_mask_transparent fixed"></div>'+
                         '<div class="weui_toast">'+
                             '<div class="weui_loading">'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                                 '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                             '</div>'+
                             '<p class="weui_toast_content">' +
                                '<span class="errSpan"></span>'+
                            '</p>'+
                         '</div>'+
                     '</div>';
    $(".errDailog").append(loadingToast);

  var toast = '<div id="toast" style="display: none;">'+
              '<div class="weui_mask_transparent fixed"></div>'+
                  '<div class="weui_toast">'+
                      '<i class="weui_icon_toast"></i>'+
                      '<p class="weui_toast_content">' +
                          '<span class="errSpan"></span>'+
                      '</p>'+
                  '</div>'+
              '</div>';

    $(".errDailog").append(toast);
});

function showErrMsg(message) {
    $("#errMsg .weui_toast_content .errSpan").html(message);
    $('#errMsg').show();
    $("#errMsg .weui_toast").addClass("weui_toastshow");
    setTimeout(function () {
        $("#errMsg .weui_toast").removeClass("weui_toastshow");
        $('#errMsg').hide();
        $("#errMsg .weui_toast_content .errSpan").empty();
    }, 3000);
}


function showToast(message1) {
    $("#toast .weui_toast_content .errSpan").append(message1);
    $("#toast .weui_toast").addClass("weui_toastshow");
    $('#toast').show();
    setTimeout(function () {
        $("#toast .weui_toast").removeClass("weui_toastshow");
        $('#toast').hide();
        $("#toast .weui_toast_content .errSpan").empty();
        if($(".mainDoctor").get(0)){
            $(".mainDoctor").addClass("hide");
            $("span.myDoctor").removeClass("hide")
        }
    }, 3000);
}


function showLoading(message,message1) {
    $("#loadingToast .weui_toast_content .errSpan").append(message);
    $('#loadingToast').show();
    $("#loadingToast .weui_toast").addClass("weui_toastshow");
    setTimeout(function () {
        $("#loadingToast .weui_toast").removeClass("weui_toastshow");
        $('#loadingToast').hide();
        $("#loadingToast .weui_toast_content .errSpan").empty();
        showToast(message1);
    }, 3000);
}



var application = '<div id="application" style="display: none;">'+
                      '<div class="weui_mask_transparent fixed"></div>'+
                         '<div class="weui_toast">'+
                             '<p class="weui_toast_content">' +
                                 '<img src="" alt="" id="applicationInfor"/><br/>'+
                                 '<span class="errSpan"></span>'+
                             '</p>'+
                         '</div>'+
                     '</div>';
$(".errDailog").append(application);
function showApplication(img,message){
    $("#application .weui_toast_content .errSpan").append(message);
    $('#application').show();
    $("#application .weui_toast").addClass("weui_toastshow");
    var src = "../../assets/mobile/images/";
    var type = ".png";
    $("#applicationInfor").attr({src:src+img+type});
    setTimeout(function () {
        $("#application .weui_toast").removeClass("weui_toastshow");
        $('#application').hide();
        $("#application .weui_toast_content .errSpan").empty();
    }, 3000);
}