var openId = "";

$(function() {
	
	/*$.ajax({
		async : false,
		url : "../effect/effecttotal.do",
		type : "post",
		dataType : "json",
		success : function(data) {
			openId = data.map.openId;
		}
	});*/
	
   //微信分享
	$.ajax({
		url : '../weixin/key.do',
		data :{"nowurl":window.location.href},
		type : 'POST',
		dataType : 'json',
		async : false,
		success :function(result){
			openId = result.openId;//获取OPENID
			uid = result.uid;
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: hs_appId, // 必填，公众号的唯一标识
			    timestamp: result.timestamp, // 必填，生成签名的时间戳
			    nonceStr: result.nonceStr, // 必填，生成签名的随机串
			    signature: result.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','getLocation']  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			
			//config执行失败执行
			wx.error(function(res){
//				alert("code="+res);
			});
	
			
			//旧URL2016.09.09
//			var fxUrl = "http://"+ hs_url + "/mxj/share/page.do?show_openid="+openId+"&from=singlemessage&isappinstalled=0";
			//新URL
			var fxUrl = "http://"+ hs_url + "/mxj/share/pageNew.do?show_openid="+openId+"&show_uid=" + uid+ "&from=singlemessage&isappinstalled=0";
			
			wx.ready(function(){
				
					wx.onMenuShareAppMessage({
					    title: 'Hi朋友，我已经在这里小赚一笔，你还在等什么！', // 分享标题
					    desc: '现在关注，成为我的合伙人，一起开启玩赚生活！各类商品轻松得！', // 分享描述
					    link: fxUrl, // 分享链接
					    imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg', // 分享图标
					    type: 'link', // 分享类型,music、video或link，不填默认为link
					    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					    success: function (res) { 
					        // 用户确认分享后执行的回调函数
					    	Message.showNotify("分享成功",3000);
					    },
					    fail : function(res){
					    	Message.showNotify("分享失败",3000);
					    }
					});
				
				  wx.onMenuShareTimeline({
					      title: '邀请合伙人',
					      link: fxUrl,
					      imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg',
					      success: function (res) {
					    	  Message.showNotify("分享成功",3000);
					      },
					      fail: function (res) {
					    	  Message.showNotify("分享失败",3000);
					      }
				  });
				  
			});
		}
	});
});

function getAddress(){
	wx.ready(function(){
		// 7.2 获取当前地理位置
	    wx.getLocation({
	    	type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
	      success: function (res) {
	    	  
	      },
	      cancel: function (res) {
	        Message.showNotify("您拒绝授权获取地理位置,将无法定位，刷新页面可重新授权",3000);
	      },
	      fail:function(res){
	    	  Message.showNotify("获取地址失败",3000);
	      }
	    });
	});
}


