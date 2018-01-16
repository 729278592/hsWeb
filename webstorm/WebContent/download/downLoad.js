$(function(){
	//判断是否为微信浏览器
	if(isWeiXin()){
		var downHtml = 	"<nav>" +
							"<div class='tip'>" +
								"<span>请点击有上角“在浏览器中打开”进行下载</span>" + 
								"<span class='arrow'><img src='../skins/download/img/arrowup.png'></span>" +
							"</div>" +
						"</nav>";
		$(downHtml).insertBefore("#showDownInfo");
	}else{
		$.ajax({
			url : '../cashRanking/getDownWebSite.do',
			type : 'post',
			dataType : 'json',
			success : function(result){
				$("#downSite").attr("href",result.m_desc);
				//add by zhangzhen for: 开放省事儿apk下载功能
				window.location.href = result.m_desc ;
			}
		});
	}
	
});

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
