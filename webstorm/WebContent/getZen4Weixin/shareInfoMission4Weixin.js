var uid = '';
var realTotal = 0;
var realStart = 0;
var realLimit = 4;
var realAppend = 0;
//调整banner顺序
function addBannerLi() {
    var ul = document.getElementById('banner_list');
    var li = document.createElement('li');
    li.className = 'banner_list_item';
    var html = ''
    html += '<div class="banner_list_item_image_bk">';
    html += '<img class="banner_list_item_image" src="../skins/getZen4Weixin/img/banner_1.png">';
    html += '</div>';
    li.innerHTML = html;
    ul.appendChild(li);
    var firstLi = document.querySelector('#banner_cover li:nth-child(1)');
    //alert("节点1------>"+firstLi);
    ul.removeChild(firstLi);
}

//加载广告
function loaded() {
    var i = 0;

    function addBanners(data, index) {
        var ul = document.getElementById('banner_list');
        var li = document.createElement('li');
        li.className = 'banner_list_item';
        var html = '';
        var imageUrl = '';
        var redirectUrl = '';
        var banner_list_item_image_a_id = "banner_list_item_image_a" + index;
        if (data) {
            imageUrl = data.imageUrl;
            redirectUrl = data.redirectUrl;
            //alert(redirectUrl);
            if (imageUrl == null || imageUrl == '') {
                imageUrl = '../skins/getZen4Weixin/img/banner_1.png';
            }
            html += '<a id="' + banner_list_item_image_a_id + '" href="#">';
            html += '<div class="banner_list_item_image_bk">';
            html += '<img class="banner_list_item_image" src="' + imageUrl + '">';
            html += '</div>';
            html += '</a>';
        }

        li.innerHTML = html;
        ul.appendChild(li, ul.childNodes[0]);
        if (redirectUrl == null || redirectUrl == '') {
            $("#" + banner_list_item_image_a_id).attr("herf", "");
        } else {
            $("#" + banner_list_item_image_a_id).click(function () {
                window.location = redirectUrl;
            })
        }
    }

    $.ajax({
        async: true,
        url: "../getZen4Weixin/shareInfoBanner.do",
        type: "get",
        success: function (data) {
            var bannerList = data.msg;
            $.each(bannerList, function (index, item) {
                addBanners(item, index);
            });
        }
    });


    var myScroll = new IScroll('#banner_cover', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapSpeed: 400,
        keyBindings: true,
    });
    document.addEventListener('touchmove', function (e) {
        //e.preventDefault();
    }, false);

    setInterval(move, 3000);

    function move() {
        if (i == 0) {
            myScroll.scrollToElement(document.querySelector('#banner_cover li:nth-child(1)'), 2000);
        }
        if (i == 1) {
            myScroll.scrollToElement(document.querySelector('#banner_cover li:nth-child(2)'), 2000);
        }
        if (i == 2) {
            myScroll.scrollToElement(document.querySelector('#banner_cover li:nth-child(3)'), 2000);
        }
        if (i < 1) {
            i++;
        } else {
            i = 0
        }
    }
}


function insertLi(item, index, realAppend) {
    var ul = document.getElementById('share_info_list');
    var li = document.createElement('li');
    li.className = 'share_info_item';
    var imageUrl = item.imageUrl;
    var title = item.title;
    var points = item.points;
    var createDateTime = item.createDateTime;
    var infoId = item.id;
    var infoUrl = item.infoUrl;
    var share_info_item_content_title_a_id = "share_info_item_content_title_a" + infoId;
    createDateTime = createDateTime.substring(0, 10);
    var shareCount = item.shareCount;
    if (imageUrl == null && imageUrl == '') {
        imageUrl = '../skins/getZen/img/zl_app_default_icon.png';
    }
    var html = '';
    html += '<div class="share_info_item_up">';
    html += '<div class="share_info_item_icon">';
    html += '<img class="share_info_item_icon_image" src="' + imageUrl + '">';
    html += '</div>';
    html += '<div class="share_info_item_content">';
    html += '<a id="' + share_info_item_content_title_a_id + '" style="color: black">';
    html += '<div class="share_info_item_content_title">' + title + '</div>';
    html += '</a>';
    html += '<div class="share_info_item_content_main">';
    html += '<div class="share_info_item_content_main_text">分享奖励 </div>';
    html += '<div class="share_info_item_content_main_point"> +' + points + ' </div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="share_info_item_result">';
    html += '<div class="share_info_item_result_date">发布时间 : ' + createDateTime + '</div>';
    html += '<div class="share_info_item_result_main">已有' + shareCount + '人分享</div>';
    html += '</div>';
    li.innerHTML = html;
    ul.insertBefore(li, ul.childNodes[realAppend]);

    $("#" + share_info_item_content_title_a_id).click(function () {
        window.location = "http://" + hs_url + "/mxj_weixin/auth/mpOAuth?redirectUrl=" + encodeURIComponent(share_url + "/secondbkAll.html?fId=" + uid + "&t=i_" + infoId + "&showUrl=" + infoUrl + "&type=" + share_type_info);
    });
}
/* 虚拟数据
var datas = {
		"msg" : {
			"list": [
				{
					"item": {
						"imageUrl":"111",
						"title":"111",
						"points":"111",
						"createDateTime": '2017-05-26-100',
						"id":"111",
						"infoUrl":"111",
						"shareCount":"111"
					}
				},
				{
					"item": {
						"imageUrl":"111",
						"title":"111",
						"points":"111",
						"createDateTime":'2017-05-26-100',
						"id":"111",
						"infoUrl":"111",
						"shareCount":"111"
					}
				}
			]
		}	
}*/
function getData(start, limit) {
    $.ajax({
        async: true,
        url: "../getZen4Weixin/info.do?start="+realStart+"&limit="+realLimit,
        type: "get",
        success: function (data) {
        	realTotal = data.msg.total;
            $("#loaddiv").hide();
            realAppend = realStart;
            $.each(data.msg.list, function (index) {
                var item = data.msg.list[index];
                insertLi(item, index, realAppend);
                realAppend++;
            })
        },
        beforeSend: function () {
            $("#loaddiv").show();
        },
        error: function () {
            $("#loaddiv").hide();
        }
    });
}

/**
 * 获得当前页面查询参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

//function setLoginInfo(uid, token) {
//    token = GetQueryString("token");
//    uid = GetQueryString("uid");
//}

function initial() {
    var uid = '';
    var token = '';
    token = GetQueryString("token");
    uid = GetQueryString("uid");

    if (uid == '' || token == '') {
    	$.ajax({
	        async: false,
	        url: "../getZen4Weixin/getUserInfo.do",
	        type: "get",
	        dataType: "json",
	        success: function (data) {
	        	 uid = data.user.id;
	        	 openId = data.openId;
	        	 token = data.token;
	        	 $("#pointsDetail").html( parseFloat(data.user.points).toFixed(2) );
	        },
	        error:function (data) {
	        	alert(data);
	        	return;
	        }
    	});
    }

    $.ajax({
        async: true,
        url: "../getZen4Weixin/shareInfo.do",
        type: "get",
        success: function (data) {
            var shareInfo = data.msg;
            var beatPercent = shareInfo.beatPercent;
            var sharePoints = shareInfo.sharePoints;
            $('#personal_zen_count_available').html(sharePoints);
            $('#personal_zen_count_maked').html(beatPercent);
        }
    });

    //初始化加载第一页分享资讯数据
    getData();
    realStart = realStart + 4;

    var total = 0;
    var scrollHandler = function () {
        var marginBot = 0;
        if (document.compatMode === "BackCompat") {
            marginBot = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
        } else {
            marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
        }
        if (marginBot <= 10) {
            if (total <= realTotal || total - realTotal < realLimit) {
                getData(realStart, realLimit);
                realStart = realStart + 4;
                total = realStart + realLimit;
            }
        } else {
        }
    }
    $(window).scroll(scrollHandler);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

$(function () {
    uid = GetQueryString("uid");
    loaded();
    initial();
//    $.ajax({
//        async: false,
//        url: "../getZen4Weixin/info.do",
//        type: "get",
//        success: function (data) {
//            var shareInfoList = data.msg.list;
//            $.each(shareInfoList, function (){
//                realTotal++;
//            });
//        }
//    });
    $("#backBtn").click(function(){
        window.history.back(-1);
    });
});
