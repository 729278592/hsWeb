var uid = '';
var actionId = 402;
var token = '';
var realTotal = 0; //全部行数
var realStart = 0; //分页起始行数
var realLimit = 4; //每页加载的行数
var realAppend = 0;//已经展示的行数
var openId = '';
var showFakeFlag = false;//是否显示假数据

var total = 0;//已经加载的行数

function loaded() {

    var j = 0;
    var bannersSize = 0;

    //获取广告数据
    $.ajax({
        async: false,
        url: "../getZen4Weixin/banner.do",
        type: "get",
        success: function (data) {
            var bannerList = data.msg;
            $.each(bannerList, function (index) {
                bannersSize++;
                addBanners(bannerList[index], index);
            });
        }
    });

    //绘制广告
    function addBanners(data, index) {
        var ul = document.getElementById('banner_list');
        var li = document.createElement('li');
        li.className = 'banner_list_item swiper-slide';
        var html = '';
        var imageUrl = '';
        var redirectUrl = '';
        var wxRedirectId = '';
        var banner_list_item_image_a_id = "banner_list_item_image_a" + index;
        if (data) {
            imageUrl = data.imageUrl;
            redirectUrl = data.redirectUrl;
            wxRedirectId = data.wxRedirectUrl;

            if (imageUrl == null || imageUrl == '') {
                imageUrl = '../skins/getZen4Weixin/img/banner_1.png';
            }
            html += '<div class="banner_list_item_image_bk" style="height: 100%;width: 100%">';
            html += '<img id="' + banner_list_item_image_a_id + '" class="' + 'banner_list_item_image' + '" src="' + imageUrl + '" wxRedirectId="' + wxRedirectId + '" redirectUrl="' + redirectUrl + '" width="100%" height="100%">';
            html += '</div>';
        }
        li.innerHTML = html;
        ul.appendChild(li, ul.childNodes[0]);
        /*if (redirectUrl == null || redirectUrl == '') {
            $("#" + banner_list_item_image_a_id).attr("herf", "");
        } else {
            $("#" + banner_list_item_image_a_id).click(function () {
                //window.location = redirectUrl;
                alert("2 " + openId);
                window.location.href="../goodml/goToGoodsDetails.do?goodsId="+wxRedirectId+"&openId="+openId;
            })
        }*/
        /*$("#" + banner_list_item_image_a_id).bind("click",function(){
            alert("2 " + openId);
            window.location.href="../goodml/goToGoodsDetails.do?goodsId="+wxRedirectId+"&openId="+openId;
        });*/

    };


    var myScroll1 = new IScroll('#banner_cover', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapSpeed: 400,
        keyBindings: true,
    });

    document.addEventListener('touchmove', function (e) {
    }, false);

    setInterval(move, 3000);

    function move() {
        var content;
        if (j == 0) {
            content = document.querySelector("#banner_cover li:nth-child(1)");
            myScroll1.scrollToElement(content, 2000);
            content.addEventListener("touchend",function(){
                var redirectUrl = $("#banner_list_item_image_a0").attr("redirectUrl");
                var wxRedirecId = $("#banner_list_item_image_a0").attr("wxRedirectId");
                if (redirectUrl != null && redirectUrl != '') {
                    window.location.href = redirectUrl;
                } else {
                    window.location.href="../goodml/goToGoodsDetails.do?goodsId="+wxRedirecId+"&openId="+openId;
                }
            });
        }
        if (j == 1) {
            content = document.querySelector("#banner_cover li:nth-child(2)");
            myScroll1.scrollToElement(content, 2000);
            content.addEventListener("touchend",function(){
                var redirectUrl = $("#banner_list_item_image_a1").attr("redirectUrl");
                var wxRedirecId = $("#banner_list_item_image_a1").attr("wxRedirectId");
                if (redirectUrl != null && redirectUrl != '') {
                    window.location.href = redirectUrl;
                } else {
                    window.location.href="../goodml/goToGoodsDetails.do?goodsId="+wxRedirecId+"&openId="+openId;
                }
            });
        }
        /*if (j == 2) {
            content = document.querySelector("#banner_cover li:nth-child(3)");
            myScroll1.scrollToElement(content, 2000);
            content.addEventListener("touchend",function(){
            });
            content.addEventListener("click",function(){
            });
        }*/
        if (j < bannersSize - 1) {
            j++;
        } else {
            j = 0
        }
    }

}

//获取url中的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function initial() {
    //token = GetQueryString("token");
    //uid = GetQueryString("uid");
	
    $.ajax({
        async: false,
        url: "../getZen4Weixin/info.do?start=0&limit=4",
        type: "get",
        success: function (data) {
        	realTotal = data.msg.total;
            var shareInfoList = data.msg.list;
            //更新翻页信息
            realStart += realLimit;
            total = realStart;
            if( realTotal >0 ){
            	$.each(shareInfoList, function (index) {
            		
                	var item = shareInfoList[index];
                	if( 0 == index ){
                		//显示头条信息
                        showTopLine( item.id, item.imageBigUrl, item.totalCount - item.shareCount, item.infoUrl);
                	}
                	appendLi(item, realAppend);
                    realAppend++;                        
                });
            }
        }
    });
}

//显示头条信息
function showTopLine(infoId, imgUrl, remainTaskNum, url){
	  $("#share_info_list_item0").attr('src', imgUrl);
      $("#shareInfoWordsRemains").html("任务剩余 : "+remainTaskNum);
      $("#mission_share_banner_a").click(function () {
          window.location = initShareUrl(uid, infoId, url);
      });
}

function addApps(data, index) {
    //var ul = document.getElementById('app_list');
    var li = document.createElement('li');
    li.className = 'app_list_item';
    var html = '';
    var app_icon_redirect_id = 'app_icon_redirect_' + index;
    var app_download_bt_id = 'app_download_bt' + index;
    var downloadStatus = '';
    var appTitle = '';
    var appPoint = '';
    var appIcon = '';
    var size = data.zlPcApp.size;
    var downloadUrl = '';
    if (data) {
        downloadStatus = data.isDownload;
        appTitle = data.zlPcApp.appName;
        appIcon = data.zlPcApp.iconUrl;
        if (downloadStatus == 0) {
            if (data.zlPcApp.point != null) {
                appPoint = data.zlPcApp.point;
            } else {
                appPoint = 0;
            }
        }
        if (appIcon == null || appIcon == '') {
            appIcon = '../skins/getZen/img/zl_app_default_icon.png';
        }

        downloadUrl = "http://" + data.zlPcApp.downloadUrl;


        html += '<div class="app">';
        html += '<a id="' + app_icon_redirect_id + '" class="app_icon_redirect" target="_blank" style="display:block;width:100%;height:42%;" ><img id="app_icon_5" class="app_icon" src="' + appIcon + '" width="100%"></a>';
        html += '<p class="app_title">' + appTitle + '</p>';
        html += '<a id="' + app_download_bt_id + '" class="app_download_bt" href="#" style="background: url("../skins/getZen/img/btn_download_n1.png");color: white;background-size: 100%;background-repeat: round">' + '+' + appPoint + '</a>';
        html += '</div>';


    }
    li.innerHTML = html;
    /!*ul.appendChild(li, ul.childNodes[0]);*!/


    $(".app_icon").load(function () {
        $("#" + app_icon_redirect_id).css({background: "none"});
    });

    $('#' + app_download_bt_id).click(function () {
        window.open(downloadUrl);
    })
}


function loadMore(start, limit) {
    $.ajax({
        async: false,
        url: "../getZen4Weixin/info.do?start="+realStart+"&limit="+realLimit,
        type: "get",
        success: function (data) {
            $("#load_more").hide();
            //更新翻页信息
            realStart += realLimit;
            total = realStart;
            var shareInfoList = data.msg.list;
            
            $.each(shareInfoList, function (index, item) {
                appendLi(item, realAppend);
                realAppend++;
            });
        },
        beforeSend: function () {
            $("#load_more").show();
        },
        error: function () {
            $("#load_more").hide();
        }
    });
}

function appendFakeLi(liIndex) {
    var ul = document.getElementById('share_info_list');
    var li = document.createElement('li');
    li.className = 'share_info_list_item';
    var html = '';
    html += '<div class="share_info_list_item_content">';
    html += '<div class="share_info_img">';
    html += '</div>';
    html += '<div class="share_info_blanket">';
    html += '</div>';
    html += '</div>';
    li.innerHTML = html;
    ul.insertBefore(li, ul.childNodes[liIndex]);
}

function appendLi(data, liIndex) {
    var shareInfoAccessTotal = data.totalCount - data.shareCount;
    var infoUrl = data.infoUrl;
    var infoId = data.id;
    var share_info_icon_a_id = "share_info_icon_a" + infoId;
    var share_info_title_id = "share_info_title" + infoId;
    var ul = document.getElementById('share_info_list');
    var li = document.createElement('li');
    li.className = 'share_info_list_item';
    var html = '';
    html += '<div class="share_info_list_item_content">';
    html += '<div class="share_info_img">';
    html += '<a id="' + share_info_icon_a_id + '" target="_blank"><img class="share_info_icon" src="' + data.imageUrl + '"width="100%" height="100%"/></a>';
    html += '</div>';
    html += '<div class="share_info_blanket">';
    html += '<div class="share_info_blanket_title">';
    if (isExceed(data.title)) {
        data.title = data.title.substring(0, lastWord(data.title)) + "...";
    }
    html += '<a id="' + share_info_title_id + '" style="color: black" class="share_info_title" target="_blank">' + data.title + '</a>';
    html += '</div>';
    html += '<div class="share_info_blanket_content">';
    html += '<div class="share_info_blanket_content_award">分享奖励</div>';
    html += '<div class="share_info_blanket_point">' + '+' + data.points + '</div>';
    html += '<div class="share_info_blanket_remain">' + '任务剩余 ' + shareInfoAccessTotal + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    li.innerHTML = html;
    ul.insertBefore(li, ul.childNodes[liIndex]);
    $("#" + share_info_icon_a_id).click(function () {
        //window.location = "http://" + hs_url + "/mxj_weixin/auth/mpOAuth?redirectUrl=" + encodeURIComponent(share_url + "/secondbkAll.html?fId=" + uid + "&t=i_" + infoId + "&showUrl=" + infoUrl + "&type=" + share_type_info);
    	window.location = initShareUrl(uid, infoId, infoUrl);
    	
    });
    $("#" + share_info_title_id).click(function () {
        //window.location = "http://" + hs_url + "/mxj_weixin/auth/mpOAuth?redirectUrl=" + encodeURIComponent(share_url + "/secondbkAll.html?fId=" + uid + "&t=i_" + infoId + "&showUrl=" + infoUrl + "&type=" + share_type_info);
    	window.location = initShareUrl(uid, infoId, infoUrl);
    });
}

function isExceed (sentence) {
    var maxLength = 20;
    var length = 0;
    for (var i = 0; i < sentence.length; i++) {
        if (sentence.charCodeAt(i) < 0 || sentence.charCodeAt(i) > 255) {
            length += 2;
        } else {
            length += 1;
        }
    }
    if (length > maxLength) {
        return true;
    } else {
        return false;
    }
}

function lastWord (sentence) {
    if (sentence.charCodeAt(20) < 0 || sentence.charCodeAt(20) > 255) {
        return 9;
    } else {
        return 10;
    }
}

function removejscssfile(filename, filetype){
//判断文件类型
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
//判断文件名
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
    var allsuspects=document.getElementsByTagName(targetelement);
//遍历元素， 并删除匹配的元素
    for (var i=allsuspects.length; i>=0; i--){
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
    }
};

function loadjscssfile(filename, filetype){
    if (filetype=="js"){
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
};

function initShareUrl(uid, infoId, infoUrl)
{
	var redirectUrl = "http://" + hs_url + "/mxj/auth/userShare/html/secondbkAll.html?fId=" 
					+ uid + "&t=i_" + infoId + "&type=" + share_type_info + "&platform=" + platfrom_type_wx + "&showUrl=" + infoUrl;
	var shareUrl = redirectUrl;
	
	//如果是微信客户端,增加鉴权码
	if( is_weixn() ){
		shareUrl = "http://" + hs_url + "/mxj_weixin/auth/mpOAuth?redirectUrl=" + encodeURIComponent( redirectUrl );
	}

	return shareUrl;
}
/*
function showmsg(){
	$("#showDiv").html("加载中...");
	$("#showDiv").show();
	$("#bg").show();
}
function hidemsg(){
	$("#showDiv").hide();
	$("#bg").hide();
}*/

$(function () {
    
	// 1、获取登陆信息 openid、uid、token
	$.ajax({
	        async: false,
	        url: "../getZen4Weixin/getUserInfo.do",
	        type: "get",
	        dataType: "json",
	        //beforeSend:showmsg,
	        success: function (data) {
	        	 uid = data.user.id;
	        	 openId = data.openId;
	        	 token = data.token;
	        	 $("#pointsDetail").html( parseFloat(data.user.points).toFixed(2) );
	        	 //hidemsg();
	        },
	        error:function (data) {
	        	console.log(data);
	        	return;
	        }
	});
	
    var zenUrl;
    /*兑换商城跳转*/
    $.post("../mine/zenpage.do?act=2",function(data){
        if(data && data.url){
            zenUrl=data.url;
        }
    },'json');

    $("#storeEntrance").click(function(){
        window.location.href = zenUrl;
    });
    /*$(".head").click(function () {
        //window.location = redirectUrl;
        alert("2 " + openId);
        window.location.href="../goodml/goToGoodsDetails.do?goodsId="+$(this).attr("wxRedirectId")+"&openId="+openId;
    });*/
    /*function getOrient(){
        if (window.orientation != undefined) {
            return window.orientation % 180 == 0 ? "portrait": "landscape"
        } else {
            return (window.innerWidth > window.innerHeight) ? "landscape": "portrait"
        };
    };

    getOrient();

    if(window.orientation!=0){
        var obj=document.getElementById('orientation');
        //alert('横屏内容太少啦，请使用竖屏观看！');
        obj.style.display='block';
    }

    window.onorientationchange=function(){
        var obj=document.getElementById('orientation');

        if(window.orientation==0){
            obj.style.display='none';
        }else
        {
            //alert('横屏内容太少啦，请使用竖屏观看！');
            obj.style.display='block';
        }
    };*/

    //废弃,直接从接口里面获取任务总数
//    $.ajax({
//        async: false,
//        url: "../getZen4Weixin/taskTotalNum.do",
//        type: "get",
//        success: function (data) {
//        	realTotal = parseInt(data.msg);
//        }
//    });
    
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    /*if (isAndroid) {
        /!*removejscssfile("../skins/css/util.css", "css");
        loadjscssfile("../skins/getZen4Weixin/css/genZen4WeixinUtil.css", "css")*!/
        $("#firstpage").css("margin-top","0.42rem");
        $("#zhoubian").css("margin-top","0.42rem");
        $("#play").css("margin-top","0.42rem");
        $("#mine").css("margin-top","0.42rem");
        $("#firstPageImg").css("margin-top","0.4em");
        $("#zhouBianImg").css("margin-top","0.4em");
        $("#playImg").css("margin-top","0.4em");
        $("#mineImg").css("margin-top","0.4em");
    }*/

    /*$("#play p").css("color","#ff620d");*/

    initial();
    loaded();

    var scrollHandler = function () {
        var marginBot = 0;
        if (document.compatMode === "BackCompat") {
            marginBot = document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
        } else {
            marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
        }
        if (marginBot <= 20) {
            if (total <= realTotal || total - realTotal < realLimit) {
                loadMore(realStart, realLimit);
               
            } else if (showFakeFlag) {
                appendFakeLi(realAppend + 3);
                showFakeFlag = false;
            }
        } else {

        }
    };
    $(window).scroll(scrollHandler);

    $("#individualPropertyBt").click(function(){
        window.location = "../zenRanking/page.do";
    });

    $("#appMissionBt").click(function(){
        window.location = "../getZen4Weixin/appMission.do?uid=" + uid + "&token=" + token;
    });

    $("#mission_app_title_right").click(function(){
        window.location = "../getZen4Weixin/appMission.do?uid=" + uid + "&token=" + token;
    });
    //分享任务页面
    $("#shareInfoMissionBt").click(function(){
        window.location = "../getZen4Weixin/shareInfoMission.do?uid=" + uid + "&token=" + token;
    });
    //分享总赚积分
    $("#mission_share_title_right").click(function(){
        window.location = "../getZen4Weixin/shareInfoMission.do?uid=" + uid + "&token=" + token;
    });

    $("#signInDailyBt").click(function(){
        window.location = "../getZen4Weixin/signInDaily.do?uid=" + uid + "&token=" + token;
    });

    $("#mine").click(function() {
        window.location = "../goodml/mine.do";
    });

    $("#zhoubian").click(function() {
        window.location = "../goodml/shopmap.do";
    });

    $("#firstpage").click(function() {
        window.location = "../goodml/firstpage.do";
    });
});