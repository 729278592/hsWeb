$(function(){
	$.post("../seller/user.do",function(obj){
		if(obj && obj.username){
			$("#name").html(obj.username);
		}
	},'json');
	$("#backtocenter").click(function(){
		window.location="../person/personcenter.do";
	});
});