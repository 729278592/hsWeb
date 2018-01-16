function getParam(params, name) {
	var size = params.length;
	var key = "";
	var value = "";

	for (i = 0; i < size; i++) {
		key = params[i][0];
		value = params[i][1];
		if (name == key) {
			break;
		}
	}
	return value;
}

function getRequestParam() {
	var url = document.getElementById('test').value;
	// window.location.search;
	alert(url);
	var params = new Array();
	var startpos = url.indexOf("?");
	if (startpos != -1) {
		var str = url.substr(startpos + 1)
		var strs = str.split("&");
		var key = new Array(strs.length);
		var value = new Array(strs.length);
		var pair = [];
		for (i = 0; i < strs.length; i++) {
			params[i] = new Array()
			pair = strs[i].split("=");
			params[i][0] = pair[0]
			params[i][1] = unescape(pair[1]);
			// alert(params[i][0]+"="+params[i][1]);
		}
	}
	return params;
}

function check() {

	var params = getRequestParam();
	for (i = 0; i < params.length; i++) {
		alert(params[i][0] + "=" + params[i][1]);

		alert("---" + getParam(params, params[i][0]));
	}

}

function bondPhone() {
	var mergeUrl = "userData/merge.do?mobile=13913882606&uid=c739a568b161ea5547bd060f7b574d68";
	alert(mergeUrl);

	$.get(mergeUrl, function(obj) {
		alert(obj);
		if (obj) {
			alert(obj.code + "||" + obj.msg);
		}
	}, 'json');
}