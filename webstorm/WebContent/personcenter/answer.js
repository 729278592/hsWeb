function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function show(id){
	$("#mslist").empty();
	$.post("../help/showone.do?id="+id,function(obj){
		if(obj && obj.que){
			$(".title").html(obj.que.m_que_title);
			var strs=obj.que.m_que_text.split("。");
			for(i=0;i<strs.length;i++){
				$("#mslist").append($("<li>"+$.trim(strs[i])+"</li>"));
			}
		}
	},'json');
}
$(function(){
	var id=GetQueryString("qd");
	show(id);
	
	$("#backPage").click(function(){
		window.location.href = "../person/help.do";
	});
	
});