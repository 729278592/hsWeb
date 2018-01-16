$(function(){
	$.post("../distributor/getUserInfo.do",function(obj){
		if(obj && obj.data){
			$("#name").html(obj.data.name);
		}
	},'json');
	$("#backtocenter").click(function(){
		window.location="../person/personcenter.do";
	});
});