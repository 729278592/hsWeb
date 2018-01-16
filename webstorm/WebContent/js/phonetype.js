//获取手机型号函数begin
function getPhoneType(){ 


	//正则,忽略大小写
	var pattern_phone = new RegExp("iphone","i");
	var pattern_android = new RegExp("android","i");
	var userAgent = navigator.userAgent.toLowerCase();
	var isAndroid = pattern_android.test(userAgent);
	var isIphone = pattern_phone.test(userAgent);
	var phoneType="phoneType";
	if(isAndroid){ 
		var zh_cnIndex = userAgent.indexOf("-");
		var spaceIndex = userAgent.indexOf("build",zh_cnIndex+4);
		var fullResult = userAgent.substring(zh_cnIndex,spaceIndex);
		phoneType=fullResult.split(";")[1];
	}else if(isIphone){ 
	//6   w=375    6plus w=414   5s w=320     5 w=320
		var wigth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if(wigth>400){ 
			phoneType = "iphone6 plus";
		}else if(wigth>370){ 
			phoneType = "iphone6";
		}else if(wigth>315){ 
			phoneType = "iphone5s";
		}else{ 
			phoneType = "iphone 4s";
		}
	
	
	}else{ 
		phoneType = "您的设备太先进了";
	}
	
	
	
	
	return phoneType;
}
//end
