function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


$(document).ready(function(){
	
	//返回页面
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
});		




