var debug = false;
var debug_msg = true;
var url_prefix = "http://";
var url_ssl_prefix = "https://";
var hs_url="mxj.huachuo.com.cn";
var file_hs_url="file.huachuo.com.cn";
var hs_img_baseurl=url_prefix + file_hs_url + "/mxj/data/image/";
var hs_appId = "wx26d8e2bb02360cb0";
var hs_money = false;//是否允许提现
var hs_nowtx = false;//首页(index.html)提现设置
//分享地址
var share_url = url_prefix + hs_url +"/mxj/auth/userShare/html";

//分享对象类型
var share_type_info = "share";
var share_type_good = "good";
var share_type_store = "shop";

var platfrom_type_wx = "wx_public";

var _hmt = _hmt || [];
(function() {
	if (typeof (UWP) != "undefined" && UWP != null) {

	} else {
		//var hm = document.createElement("script");
		//hm.src = "//hm.baidu.com/hm.js?2b1c7c43494255e443ed47466f3f691e";
		//var s = document.getElementsByTagName("script")[0];
		//s.parentNode.insertBefore(hm, s);
	}
})();

function loadQrcode(){
	$.ajax({
		url : '../pubMet/qrCodeHtml.do',
		type : 'post',
		dataType : 'json',
		async : false,
		success : function(result){
			$("#showScan").html(result);
		}
	});
}
//获取云朵
function getCloud(){
	  var cloud = $(".getCloud");
	  if(cloud.length>0){
		  $.ajax({
				url : '../effect/getCloud.do',
				type : 'POST',
				dataType : 'json',
				async : true,
				success :function(obj){
					$("#showDownInfo").html(obj);
					$('#shandow').click(function(){
						$('#showDownInfo').hide();
						document.ontouchmove = function() {
							return true;
						};
					});
				}
			});
			$("#showDownInfo_message").html("");
			$("#showDownInfo_remark").html("");
			$("#nowDown").html("");
			$.post("../effect/getParameter.do?type=9",function(obj) {
				var html="";
				$.each(obj.splist,function(i, o) {
					if(o.m_value<100){
						html+=o.m_desc+"<br>";
					}
					if(o.m_value==901){
						$("#showDownInfo_remark").html(o.m_desc);
					}
					if(o.m_value==902){
						$("#nowDown").html(o.m_desc);
					}
					$("#showDownInfo_message").html(html);
				});
			});
	  }

	  $(".getCloud").bind('click',function(){
		  $('#showDownInfo').css("display","block");
			document.ontouchmove=function(){
				return false;
			};
	  });
	  //add by zhangzhen for: 开放省事儿apk下载功能
	  //绑定下载按钮点击事件
	  $("#nowDown").bind('click',function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	  });
}

function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}

//将请求连接提取到数组中
function getRequestParams()
{
	var url=window.location.search;
	//alert(url);
	var params = new Array(); 
	var startpos = url.indexOf("?");
	if(startpos!=-1) 
	{ 
		var str = url.substr( startpos + 1 ) 
	    var strs = str.split("&");
	    var key=new Array(strs.length);
	    var value=new Array(strs.length);
		var pair = [];
	    for(i=0;i<strs.length;i++) 
	    { 
			params[i] = new Array()
			pair = strs[i].split("=");
			params[i][0] = pair[0]
			params[i][1] =unescape(pair[1]); 
			//alert(params[i][0]+"="+params[i][1]);
	   } 
	}
	return params;
}

//获取get请求中的参数
function getParamByName(params,name){ 
	var size = params.length;
	var key="";
	var value = "";
	
	for(i=0;i<size;i++) {
	   key = params[i][0];
	   value = params[i][1];
	   if( name == key) {
		 break;
	   }
	}
	return value;
}

//判断是否微信浏览器
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    // alert (ua)
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}