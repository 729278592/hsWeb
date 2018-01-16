/*分页*/
var pagesimple = {};
Zepto(function($) {
	
	$('#backtoTop').tap(function() {
		backtoTop();
	});

	$(window).scroll(function() {

		var srollPos = $(window).scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)
		if(srollPos > 0){
			$("#backtoTop").css("display","block");
		}else{
			$("#backtoTop").css("display","none");
		}
		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());
		var range = 50;
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

		if (($(document).height() - range) <= totalheight) {
			if (pagesimple.maxCount > pagesimple.start) {
				pagesimple.start = pagesimple.start + pagesimple.rownum;
				loadData(false);
			}

		}

	});
	
	loadData(false);
});

function loadData(flag) {
	var str = "";
	$.ajax({
		type : "post",
		async :true,
		url : "../orderService/progressqueryData.do",
		data : {
			"pagesimple.start" : pagesimple.start,
			"pagesimple.rownum" : pagesimple.rownum,
			"pagesimple.maxCount" : pagesimple.maxCount
		},
		dataType : "json",
		success : function(d) {
			pagesimple = d.plist.page;
			var list = d.plist.list;
            if(list.length>0){
			$.each(list, function(k,v) {
				str+=" <div class=\"olderId\">"
				    +"<ul><li class=\"older\">服务单号&nbsp:</li>"
				    +"<li class=\"number\">"+v.m_num+"</li>"
				    +"<li class=\"suction\"><a>";
				    
				  if(v.m_result=="0"){
					  str+="审批中"; 
				  }else if(v.m_result=="1"){
					  str+="审批通过";
				  }else if(v.m_result=="2"){
					  str+="审批不通过";
				  }
				    
				 str+="</a> </li> </ul> </div>"
				     +"<div class=\"clear\"></div>"
				     +"<div class=\"tab-content\"> <div  class=\"share_box\"> <div class=\"share_top\"> <div  class=\"share_img\">"
				     +"<img alt=\"\" src=\"../good/down.do?filename="+v.m_good_pic+"\"/>"
				     +"</div><div class=\"share_content\">"
				     +"<p>"+v.m_good_name+"&nbsp;"+v.m_good_no+"("+v.m_color+")</p>"
				     +"<p class=\"price\">￥"+v.m_good_price+"</p></div></div></div>"
				     +" <div  class=\"time\"><ul><li class=\"shenq\">申请时间&nbsp;:</li>"
				     +"<li class=\"tokiwa\">"+v.format+"</li>"
				     +"<li class=\"buttom\">" 
				     +"<a  href=\"../orderService/speedOfProgressDetalPage.do?id="+v.m_id+"\"><span>进度查询</span>"
				     +" </a></li> </ul> </div>  </div>";	
				   
			});
			
            }else if(d.plist.page==0){
            	
            	 str="<img src=\"../skins/imgs/none.png\" style=\"width: 50%;margin-top: 30%;margin-left: 25%;\" >";
            }

		  if(flag){
			  $(".product").empty();
		  }
		  $(".product").append(str);

		}
	});

}

function backtoTop() {
	var time = 50;
	var fastspeed = 0.8;
	var x1 = 0, y1 = 0, x2 = 0, y2 = 0, x3 = 0, y3 = 0, x, y;
	x1 = window.scrollX;
	y1 = window.scrollY;
	if (document.documentElement) {
		x2 = document.documentElement.scrollLeft;
		y2 = document.documentElement.scrollTop;
	}
	if (document.body) {
		x3 = document.body.scrollLeft;
		y3 = document.body.scrollTop;
	}
	x = Math.max(x1, Math.max(x2, x3));
	y = Math.max(y1, Math.max(y2, y3));
	if (x > 0 || y > 0) {
		var speed = 1 + fastspeed;
		window.scrollTo(x / speed, y / speed);
		setTimeout(function() {
			backtoTop();
		}, time);
	}
}