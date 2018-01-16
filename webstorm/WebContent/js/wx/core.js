var core = (function(){
	
	var len = num = 0;
	
	// 动态加载JS
	function requireJS(path, callback) {
		num = 0;
		if (isArray(path)) {
			len = path.length;
			for ( var index in path) {
				loadJS(path[index], callback);
			}
		} else {
			len = 1;
			loadJS(path, callback);
		}
	}

	function loadJS(path, callback) {
		var _doc = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', path);
		_doc.appendChild(script);
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
				num++;
				if (len == num && callback && typeof callback == 'function') {
					script.onload = script.onreadystatechange = null;
					callback();
				}
			}
		}
	}

	function isArray(v) {
		return toString.apply(v) === '[object Array]';
	}
	
	return {
		requireJS : requireJS
	}
	
})();