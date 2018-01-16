
$(function() {

	load();

	$("#return1").click(function(){
		history.go(-1);
		return false;
	});
});

function load() {
	var id=window.location.search.substring(15);
	var str="";
	$.ajax({
		async : false,
		url : "../afterSaleHelp/cload.do",
		type : "post",
		dataType : "json",
		data : {id:id},
		success : function(data) {
		    str=data.fdesc.m_desc;
			$("#desc").append(str);
		}
	});
}
