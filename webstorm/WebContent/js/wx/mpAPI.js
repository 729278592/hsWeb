var mp = (function() {
	function jsAPI(callback) {
		wx.ready(function() {
			if (callback && typeof callback == 'function') {
				callback();
			}
		});
		$.ajax({
			type: "get",
			async : false,
			url: "http://" + hs_url + '/weixin_fans/rs/signature/signature',
			data: {
				"url": window.location.href
			},
			dataType: "json",
			crossDomain: true,
			success: function(data) {
				wx.config({
					debug: true,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
				});
			},
			error: function() {}
		});
	}

	return {
		jsAPI: jsAPI
	};

})(jQuery);