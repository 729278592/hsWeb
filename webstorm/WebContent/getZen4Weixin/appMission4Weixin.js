var uid = '';
var actionId = 401;

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
function setLoginInfo() {
    uid = GetQueryString("uid");
}
function sizeTransform(size) {
    var fileSize = parseFloat(size)
    var megabyte = 1024 * 1024;
    var kilobyte = 1024;

    var returnValue = fileSize / megabyte;
    if (returnValue > 1) {
        returnValue = Math.round(returnValue * 100) / 100;
        return returnValue + "MB";
    } else {
        returnValue = fileSize / kilobyte;
        if (returnValue > 1) {
            returnValue = Math.round(returnValue * 100) / 100;
            return returnValue + "KB";
        } else {
            returnValue = Math.round(fileSize * 100) / 100;
            return returnValue + "B";
        }
    }

}

//生成数据html,append到div中
function insertDiv(item, i, index) {
    var ul = document.getElementById('mainDiv');
    var li = document.createElement('li');
    li.className = 'item';
    var size = item.zlPcApp.size;
    size = sizeTransform(size);


    var appIcon = item.zlPcApp.iconUrl;


    var button_id = "button" + index;
    var downloadUrl=item.zlPcApp.downloadUrl;
    var html = '';
    html += '<div class="icon">';
    html += '<img class="icon_image" src="' + appIcon + '"/>';
    html += '</div>';
    html += '<div class="content">';
    html += '<div class="title">' + item.zlPcApp.appName + '</div>';
    html += '<div class="app_info">';
    html += '<div class="size">' + size + '</div>';
    html += '<div class="download_total">' + item.zlPcApp.downloadTotal + '次下载' + '</div>';
    html += '</div>';
    html += '<div class="sub_title">' + item.zlPcApp.description + '</div>';
    html += '</div>';
    html += '<div class="button">';
    html += '<a id="' + button_id + '" class="button_redirect" href="#" target="_blank" downloadUrl="' + downloadUrl + '">';
    html += '<div class="button_text">下载</div>';
    html += '</a>';
    html += '</div>';
    li.innerHTML = html;
    ul.insertBefore(li, ul.childNodes[i]);
}


$(function () {

    setLoginInfo();

    //初始化加载第一页数据


    var scrollHandler = function () {
        var marginBot = 0;
        if (document.compatMode === "BackCompat") {
            marginBot = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
        } else {
            marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
        }
    }
    $(window).scroll(scrollHandler);

    $(".button a").click(function () {
        var id = $(this).attr("id");
        var downloadUrl = $(this).attr("downloadUrl");
        window.open(downloadUrl);
    });
});