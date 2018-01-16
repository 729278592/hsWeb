var mp = (function() {

	var actUrl = decodeURIComponent(window.location.href);
    var urlParams = actUrl.substr(actUrl.indexOf("?"));

	var code = getQueryString(urlParams,"code"),
		state = getQueryString("state").substring(0, getQueryString("state").indexOf('#')),
		pageURL = getPageURL(),
		overdueTime = 1 // 授权过期时间（单位：天）;

	// 获取指定URL参数
	// function getQueryString(name) {
	// 	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	// 	var r = window.location.search == "" ? null : decodeURIComponent(window.location.search).substr(1).match(reg);
	// 	if (r != null)
	// 		return unescape(r[2]);
	// 	return "";
	// }

	// 获取URL路径
	function getPageURL() {
		return window.location.href.substring(0, window.location.href.indexOf('code=') - 1);
	}

	// 加载微信JSAPI配置信息
	function loadMpConfig(data, isDebug) {
		console.log(data);
		isDebug = (isDebug && typeof isDebug == 'boolean') || false;
		if (data) {
			wx.config({
				debug: isDebug,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
			});
		}
	}

	// 授权接口
	function oAuthAPI(callback) {
		var obj = new Object();
		obj.openId = window.localStorage.getItem('asus_openid');
		obj.nickName = window.localStorage.getItem('asus_nickname');
		obj.avatar = window.localStorage.getItem('asus_headimgurl');
		obj.unionId = window.localStorage.getItem('asus_unionid');
		obj.lastupdateTime = window.localStorage.getItem('asus_lastupdateTime');
		// alert("code=" + code)
		if (code != null && code != '') {
			$.ajax({
				type: "get",
				// async : false,
				url: mpServerPath + '/auth/mpCode2AccessToken',
				data: {
					"code": code
				},
				dataType: "json",
				crossDomain: true,
				success: function(data) {
					// alert('auth return :' + JSON.stringify(data));
					if (data.errcode) {
						obj.errmsg = 'code无效！';
						obj.errcode = '50000';
						if (callback && typeof callback == 'function') {
							callback(obj);
						}
					} else {
						// alert("mpAPI state = " + state)
						var scope = data.scope;
						//alert("mpAPI access_token = " + data.access_token)
						// alert("mpAPI openid = " + data.openid)
						if (scope == 'snsapi_userinfo') {
							// 获取用户基本信息
							$.ajax({
								type: "get",
								// async : false,
								url: mpServerPath + '/auth/mpUserInfo',
								data: {
									"accessToken": data.access_token,
									"openId": data.openid
								},
								dataType: "json",
								crossDomain: true,
								success: function(res) {
									// alert(JSON.stringify(res));
									if (data.errcode) {
										obj.errmsg = 'access_token无效！';
										obj.errcode = '50001';
										if (callback && typeof callback == 'function') {
											callback(obj);
										}
									} else {

										refreshLocalStorage(res);
										// 绑定接口
									}
								},
								error: function(e) {
									obj.errmsg = '获取微信用户个人信息失败！';
									obj.errcode = '50002';
									if (callback && typeof callback == 'function') {
										callback(obj);
									}
								}
							});
						} else if (scope == 'snsapi_base'){
							obj.openId = data.openid;
							window.localStorage.setItem('asus_openid', data.openid);
							// alert('mpAPI:'+ JSON.stringify(obj));
							callback(obj);
						} else {
							if (callback && typeof callback == 'function') {
								callback(obj);
							}
						}
					}
				},
				error: function(e) {
					obj.errmsg = '获取access_token失败！';
					obj.errcode = '50003';
					if (callback && typeof callback == 'function') {
						callback(obj);
					}
				}
			});
		} else {
			obj.errmsg = 'CODE不能为空！请确保访问路径为授权路径';
			obj.errcode = '50004';
			if (callback && typeof callback == 'function') {
				callback(obj);
			}
		}
	}

	// jsAPI接口
	function jsAPI(callback, isDebug) {

		wx.ready(function() {
			console.log('jsapi initial complete!');
			if (callback && typeof callback == 'function') {
				callback();
			}

			 wx.hideMenuItems({
                 menuList: ['menuItem:share:qq',
                            'menuItem:share:weiboApp',
                            'menuItem:favorite',
                            'menuItem:share:facebook',
                            '/menuItem:share:QZone'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                 success:function(res){
                     // alert("隐藏");
                 }
			 });
		});

		$.ajax({
			type: "get",
			// async : false,
			url: mpServerPath + '/signature/signature',
			data: {
				"url": window.location.href
			},
			dataType: "json",
			crossDomain: true,
			success: function(data) {
				loadMpConfig(data, isDebug);
			},
			error: function() {}
		});
	}

	// 刷新本地缓存
	function refreshLocalStorage(data) {
		var obj = new Object();
		window.localStorage.clear();
		window.localStorage.setItem('asus_openid', data.openid);
		window.localStorage.setItem('asus_nickname', data.nickname);
		window.localStorage.setItem('asus_headimgurl', data.headimgurl);
		window.localStorage.setItem('asus_unionid', data.unionid);
		obj.openId = data.openid;
		obj.nickName = data.nickname;
		obj.avatar = data.headimgurl;
		obj.unionId = data.unionid;
		return obj;
	}

	function addressAPI(callback){
		wx.ready(function() {
			if (callback && typeof callback == 'function') {
				callback();
			}

		});
	}
	return {
		oAuthAPI: oAuthAPI, // 授权接口
		jsAPI: jsAPI// jsAPI接口
	}

})(jQuery);