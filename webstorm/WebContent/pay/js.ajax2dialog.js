var defaultDialogOptions = { 
		width: 800, 
		height: 600,
		name: "_blank",
		resizable: "no"
	};

function openWindow(options) {
    options = options || {};
    var w = defaultDialogOptions.width;
    if (options.width)
    	w = options.width > screen.availWidth ? screen.availWidth : options.width;
    var h = defaultDialogOptions.height;
    if (options.height)
    	h = options.height > screen.availHeight ? screen.availHeight : options.height;
    var n = options.name || defaultDialogOptions.name;
    resizable = options.resizable || defaultDialogOptions.resizable;

    var features = "height=" + h + ",width=" + w + ",resizable=" + resizable
			+ ",toolbar=no,menubar=no,scrollbars=yes,location=no,status=yes";
    return window.open(options.url, n, features);
}

function closeWindow(notExecuteCanClose) {
    if (!notExecuteCanClose && window.canCloseWindow && !window.canCloseWindow())
        return;
    window.close();
    try {
        if (window.opener._currentDialog)
            window.opener.onDialogClosed();
    } catch (e) {
    }
}

var _currentDialog = null;
function showDialog(options, callback) {
    $.blockUI({
        message: null
    });
    _currentDialog = $.extend({}, { childWnd: null, callback: null, result: null }, options);
    if ($.isFunction(callback))
        _currentDialog.callback = callback;
    _currentDialog.childWnd = openWindow(options);
    jQuery('.blockOverlay').click(function () {
        try {
            if (isChildWndClosed())
                onDialogClosed();
            else
                _currentDialog.childWnd.focus();
        } catch (e) {
            onDialogClosed();
        }
    });
    var failedCnt = 0;
    _currentDialog.watcher = setInterval(function () {
        try {
            if (isChildWndClosed())
                failedCnt++;
            else
                failedCnt = 0;
        } catch (e) {
            failedCnt++;
        }
        if (failedCnt >= 2) {
            onDialogClosed();
        }
    }, 500);
}

function isChildWndClosed() {
	if (!_currentDialog || !(_currentDialog.childWnd) || !(_currentDialog.childWnd.document))
		return true;
	if (_currentDialog.childWnd.closed)
		return true;
	return false;
}

function onDialogClosed() {
    if (_currentDialog && _currentDialog.watcher) {
        clearInterval(_currentDialog.watcher);
        _currentDialog.watcher = null;
    }
    $.unblockUI();
    if (_currentDialog && _currentDialog.callback && _currentDialog.result)
        _currentDialog.callback.call(_currentDialog, _currentDialog.result);
    _currentDialog = null;
}

//对话框页面调用此方法设置回调参数
function setDialogResult(result) {
    if (window.opener && window.opener._currentDialog)
        window.opener._currentDialog.result = result;
}

//对话框页面调用此方法关闭页面并设置返回值
function closeDialog(result) {
    setDialogResult(result);
    window.close();
    try {
        if (window.opener && window.opener.onDialogClosed)
            window.opener.onDialogClosed();
    } catch (e) { }
}

function showWaitMessage(message) {
    return $.blockUI({
        message: message || "正在操作，请稍等...",
        baseZ: 2000,
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff',
            'font-size': '16px'
        }
    });
}

function closeWaitMessage() {
    $.unblockUI();
}

function ajaxSubmitForm(form, options, dataType) {
    if ($.isFunction(options)) {
        options = { response: options };
    } else  {
    	options = options || {};
    }
    if (dataType)
        options.dataType = dataType == "myhtml" ? "html" : dataType;
    options.beforeSubmit = function () {
        showWaitMessage(options.waitMsg);
        if (options.onSubmiting)
        	options.onSubmiting();
        return true;
    };
    options.success = function () {
    	closeWaitMessage();
        if (options.response) {
            if (dataType == "myhtml") {
                var html = arguments[0];
                if (html && html.indexOf("<!--success-->") > 0)
                    options.response.apply(options, [{
                        success: true,
                        html: html
                    }]);
                else {
                	var isLoginTimeout = html && html.indexOf("<!--login-->") >= 0;
                    options.response.apply(options, [{
                        success: false,
                        message: isLoginTimeout ? "登录超时，需要重新登录。" : "您请求的操作执行失败。",
                        html: html
                    }]);
                }
            } else
                options.response.apply(options, arguments);
        }
    };
    options.error = function () {
    	closeWaitMessage();
    	var isLoginTimeout = false;
    	if (arguments[0] && arguments[0].responseText) {
    		if (arguments[0].responseText.indexOf("<!--login-->") >= 0)
    			isLoginTimeout = true;
    			
    	}    	
        if (options.response) {
            if (options.dataType == "json" || dataType == "myhtml")
                options.response.apply(options, [{
                    success: false,
                    message: isLoginTimeout ? "登录超时，需要重新登录。" : "您请求的操作执行失败。"
                }]);
            else
                options.response.apply(options, arguments);
        }
    };

	jQuery(form).find("input[type='text']").each(function () {
        var s1 = jQuery(this).val();
        var s2 = trimEnd(s1);
        if (s1 != s2)
            jQuery(this).val(s2);
    });

    if (jQuery(form).hasClass("validate") && !jQuery(form).validate().form())
        return;

    if (window.onBeforeSubmit && !onBeforeSubmit(jQuery(form))) {
        return;
    }

    options.dataType = options.dataType || "json";
    jQuery(form).ajaxSubmit(options);
}

function ajaxPost(url, data, response, dataType, waitMsg) {
    var isMyHtml = dataType == "myhtml";
    dataType = dataType == "myhtml" ? "html" : dataType;
    showWaitMessage(waitMsg);
    $.post(url, data, function (data) {
        if (response) {
            if (isMyHtml) {
                if (data && data.indexOf("<!--success-->") > 0)
                    response({
                        success: true,
                        html: data
                    });
                else {
                	var isLoginTimeout = data && data.indexOf("<!--login-->") >= 0;
                    response({
                        success: false,
                        message: isLoginTimeout ? "登录超时，需要重新登录。" : "您请求的操作执行失败。",
                        html: data
                    });
                }
            } else
                response(data);
            closeWaitMessage();
        }
    }, dataType).error(function (data) {
    	var isLoginTimeout = false;
    	if (arguments[0] && arguments[0].responseText) {
    		if (arguments[0].responseText.indexOf("<!--login-->") >= 0)
    			isLoginTimeout = true;
    			
    	}
        response({
            success: false,
            message: isLoginTimeout ? "登录超时，需要重新登录。" : "您请求的操作执行失败。",
            html: data
        });
        closeWaitMessage();
    });
}

function getChildDialogOptions(url) {
	var options = {
			url: url,
			width: defaultDialogOptions.width,
			height: defaultDialogOptions.height
	};
	/*var s = url;
	if (s.length > baseUrl.length && s.substr(0, baseUrl.length) == baseUrl)
		s = url.substr(baseUrl.length);
	else if (s.length > baseUrlContext.length && s.substr(0, baseUrlContext.length) == baseUrlContext)
		s = url.substr(baseUrlContext.length);
	if (s.indexOf("?") > -1)
		s = s.substring(0, s.indexOf("?"));
	var ss = s.split("/");
	if (ss.length == 3) {
		if (ss[1] == "prj" || ss[1] == "apply") {
			options.width = 900;
			options.height = 800;
			if (ss[2] == "edit" || ss[2] == "add")
				options.width = 1024;
		} else if (ss[1] == "exp") {
			if (ss[2] == "edit") {
				options.width = 900;
				options.height = 800;
			} else if (ss[2].indexOf("import") == 0) {
				options.width = 800;
				options.height = 600;
			} else {
				options.height = 640;
			}
		}
	} else if (ss.length == 2) {
		if (ss[1] == "art")
			options.height = 800;
	}*/
	return options;
}

function showChildDialog(url, callback) {
	showDialog(getChildDialogOptions(url), callback);
}

var _modeldialog;
function showModelDialog(url,data,options){
	
	var _options = {
			title : "",
			autoOpen : false,
			height : 600,
			width : 800,
			modal : true
		};
	
	jQuery.extend(_options,options);
	
	if(jQuery("#_modeldialog").length !=0){
		jQuery("#_modeldialog").remove();
	}
	
	var html = '<div id="_modeldialog" title="Create new user"></div>';
	
	jQuery("body").append(html);
	
	_modeldialog = jQuery( "#_modeldialog" ).dialog(_options);
	
	ajaxPost(url, data, function(result) {
		if (result.success){
			jQuery( "#_modeldialog" ).html(result.html);
			_modeldialog.dialog("open");
		}else{
			alert(result.message);
		}
			
	},"myhtml");
}
function closeModelDialog(flag){
	if(_modeldialog != ""){
		_modeldialog.dialog( "close" );
	}
}