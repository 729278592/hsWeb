/*分页*/
var pagesimple = {};
$(function(){
	loadData();
	$("#backtoTop").hide();
	$(window).scroll(function() {
	
		var srollPos = $(window).scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)

		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());
	    var range=50;
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		
		if (($(document).height() - range) <= totalheight) {
			if(pagesimple.maxCount>pagesimple.start){				
				pagesimple.start = pagesimple.start+pagesimple.rownum;
				loadData();
			}
			
		}
		
	});	
});

function loadData(){
	var str = "";
	$.ajax({
				async : false,
				url : "../orderService/loadData.do",
				type : "post",
				dataType : "json",
				data : {
					   "pagesimple.start":pagesimple.start,
					   "pagesimple.rownum":pagesimple.rownum,
					   "pagesimple.maxCount":pagesimple.maxCount
					   },
				success : function(d) {
					pagesimple=d.plist.page;
					var list=d.plist.list;
					if(list.length>0){
					for(var i=0;i<list.length;i++){
						str+="<div class=\"olderId\">"
					         +"<ul>"
						     +"<li class=\"older\">订单号&nbsp;:</li>"
						     +"<li class=\"number\">"+list[i].m_order_num+"</li>"
						     +"<li class=\"suction\"><a href=\"#\">共<span>&nbsp;"+list[i].m_count+"&nbsp;</span>件</a> </li>"  
					         +"</ul>"
				             +"</div>"
						     +"<div class=\"clear\"></div>"
						     +"<div class=\"tab-content\">"
					         +"<div class=\"share_box\">"
					     	 +"<div class=\"share_top\">"
							 +"<div class=\"share_img\" id=\""+list[i].m_id+"\"><img class=\"share_img\" src=\"../good/down.do?filename="+list[i].m_good_pic+"\"/></div>"//"
							 +"<div class=\"share_content\">"
							 +"<p>"+list[i].m_good_name+"&nbsp;"+list[i].m_good_no+"("+list[i].m_color+")</p>"
							 +"<p class=\"price\">￥"+list[i].m_good_price+"</p>"
							 +"</div>"
						     +"</div>"
					         +"</div>"
					         +"<div class=\"time\">"
						     +"<ul>"
							 +"<li class=\"shenq\">下单时间&nbsp;:</li>"
							 +"<li class=\"tokiwa\">"+list[i].m_create_date.substring(0,10)+"</li>"
							 +"<li class=\"buttom\">";
							 if(list[i].m_statu!="6"&&list[i].m_statu!="5"){
								str+="<a href=\"../orderService/applyPage.do?id="+list[i].m_id+"\"><span>申请售后</span></a>";
							 }else{
								 str+="<a href=\"../orderService/progressqueryPage.do?id="+list[i].m_id+"\"><span>进度跟踪</span></a>";
							 }
	       
							 str+="</li>"
						     +"</ul>"
						     +"</div>"
                             +"</div>";
							 
							 
					}
					}else if(pagesimple.start==0){
						 str="<img src=\"../skins/imgs/none.png\" style=\"width: 40%;margin-top: 30%;margin-left: 30%;margin-bottom:30%;\" >";
					}
					
					$(".product").append(str);
					$("#backtoTop").show();
				}
			});
	
	
}