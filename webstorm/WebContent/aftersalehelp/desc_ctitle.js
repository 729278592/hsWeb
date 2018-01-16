
$(function() {

	load();

	$("#return1").click(function(){
		history.go(-1);
		return false;
	});
});

function load() {
	var id=window.location.search.substring(14);
	var str="";
	$.ajax({
		async : false,
		url : "../afterSaleHelp/cload.do",
		type : "post",
		dataType : "json",
		data : {id:id},
		success : function(data) {
			
			$(".head-warp").append(data.fdesc.m_title);
				if(data.clist.length>0){
					str+="<ul>"
					$.each(data.clist,function(){
						str+="<li><a href=\"../afterSaleHelp/cdetailpage.do?id="+$(this)[0].m_id+"\">"+$(this)[0].m_child_title+"</a></li>";
					});
					 str+="</ul>";
				}
			$(".product").append(str);
		}
	});
}
