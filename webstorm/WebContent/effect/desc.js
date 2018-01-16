
$(function() {

	load();
	var type= "${type}";
	if(type=="6"){
		$('body,html').animate({scrollTop:500},500);
	}
	window.location.href="#"+window.location.search.substring(6);
	$("#return1").click(function(){
		history.go(-1);
		return false;
	});
});

function load() {
	$.ajax({
		async : false,
		url : "../effect/descData.do",
		type : "post",
		dataType : "json",
		success : function(data) {
			var str="";
			var list=data.list;
			for(var i=list.length-1;i>=0;i--){
			 str=str+"<div class=\"content\"><span id="+list[i].id+" class=\"title\"><img src=\"../effect/down.do?imgName="+list[i].desc_img+"\"/>"+list[i].index_name+"</span><br/><div>"
		         +list[i].second_memo+"</div></div>";  
			}
			$("#desc").append(str);	
		}
	});
	
}
