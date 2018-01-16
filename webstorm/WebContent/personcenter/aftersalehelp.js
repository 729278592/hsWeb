/*分页*/

$(function(){
	loadData();	
});

function loadData(){
	var str = "";
	var flag=true;
	$.ajax({
				async : false,
				url : "../afterSaleHelp/fload.do",
				type : "post",
				dataType : "json",
				data : {},
				success : function(d) {
					if(d.flist.length>0){
						$.each(d.flist,function(){
							flag=true;
							if($(this)[0].m_type==0){
								flag=false;
							}

							str+="<li><a href=\"../afterSaleHelp/cpage.do?flag="+flag+"&id="+$(this)[0].m_id+"\">"+$(this)[0].m_title+"</a></li>";
						});
					}
					
					$("#aftersaledesc").empty();
					$("#aftersaledesc").append(str);
				}
			});
}

