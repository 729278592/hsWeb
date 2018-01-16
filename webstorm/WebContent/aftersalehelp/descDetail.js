
$(function() {
	load();
});

function load() {
	var str="";
	var i=0;
	var id=window.location.search.substring(4);
	$.ajax({
		async : true,
		url : "../afterSaleHelp/cdetailload.do",
		type : "post",
		dataType : "json",
		data:{id:id},
		success : function(data) {
			$("#titledesc").append(data.cdesc.m_child_desc);
			$("#returnDesc").append(data.cdesc.m_child_title);
			if(data.cdlist.length>0){
				$.each(data.cdlist,function(){
					str+="<div class=\"rules\" id=\"rules"+i+"\">"
					   +"<div class=\"rtitle\" onclick=\"clickTitle('"+i+"')\">"
					   +"<p >"+$(this)[0].m_title+"</p>"			
					   +"<img src=\"../skins/aftersalehelp/img/jian.png\" class=\"jian\">"
					   +"<img src=\"../skins/aftersalehelp/img/jia.png\" class=\"jia\">"
					   +"</div>"
					   +"<div class=\"rcontent\">"
					   +$(this)[0].m_desc
					   +"</div>"
					   +"</div>";
					   i++;
				});
				$("body").append(str);
				
			}
		}
	});
}
function clickTitle(i){

	$("#rules"+i+" .rcontent").toggle();
	$("#rules"+i+" .rtitle .jia").toggle();
}