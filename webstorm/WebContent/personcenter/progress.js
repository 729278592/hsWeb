
var flag=0;// 0申请,1审核,2处理，3完成
var orderid="";
var imgname="";
$(function() {
	//给进度条添加颜色
	$("#process").css("background","#ff620d");
	loadData();
	
	$('#cservice').click(function() {
		$('#showhide').css("display", "block");
	});
	
	$('#not').click(function() {
		$('#showhide').css("display", "none");
	});
	
	$('#sure').click(function() {
		del();
		$('#showhide').css("display", "none");
	});
});

$(document).ready(function() {
	$('.venobox').venobox({
		numeratio : true,
		border : '20px'
	});
	$('.venoboxvid').venobox({
		bgcolor : '#000'
	});
	$('.venoboxframe').venobox({
		border : '6px'
	});
	$('.venoboxinline').venobox({
		framewidth : '300px',
		frameheight : '250px',
		border : '6px',
		bgcolor : '#f46f00'
	});
	$('.venoboxajax').venobox({
		border : '30px;',
		frameheight : '220px'
	});
});

function loadData() {
	var id=location.search.substring(4);
	var str="";
	$.ajax({
		async : false,
		url : "../orderService/progressData.do",
		type : "post",
		dataType : "json",
		data : {
			   id:id,
			   },
		success : function(data) {
			 
			/*商品信息*/
			str="<div class=\"share_img\">"
			   +"<img alt=\"\" src=\"../good/down.do?filename="+data.ose.m_good_pic+"\">"
			   +"</div>"
			   +"<div class=\"share_content\">"
		       +"<p>"+data.ose.m_good_name+"&nbsp;"+data.ose.m_good_no+"("+data.ose.m_color+")</p>"
		       +"<p class=\"price\">￥"+data.ose.m_good_price+"</p></div>";
			
		    $(".share_top").append(str);
			/*问题描述*/
			$(".tokiwa").html(data.ose.m_desc);
			
			str="<p>您的申请已提交给系统，审核通过后会联系您，请耐心等待并保持电话畅通。</p>"
			   +"<p>"+data.ose.format+"</p>";  
			 $(".message").append(str);   

			/*图片*/
			 imgname=data.ose.m_img;
			var arr=data.ose.m_img.split(",");
			str="";
            $.each(arr,function(k,v){
            	str+="<li><a  class=\"venobox\" data-gall=\"gall1\"  title=\""+data.ose.m_good_name+"&nbsp;"+data.ose.m_good_no+"\" href=\"../orderService/down.do?filename="+v+"\">"
            	    +"<img src=\"../orderService/smallDown.do?filename="+v+"\"style='    margin-bottom: 10px;'></a></li>";
			    
            });
         
            $(".thumbs").append(str);
            
            stepBar.init("stepBar", {
        		step : data.ose.m_statu + 1,
        		change : true,
        		animation : false
        	});
            
            flag=data.ose.m_statu;

		}
			   	   
	});

}

$("#backPage").click(function(){
	window.history.go(-1);
	return false;
});

function del(){
	var vflag=true;
	var id=location.search.substring(4);
	var temp=0;
	if(flag==0){
		temp=0;
	}else if(flag==1){
		Message.showNotify("审核中的服务单无法取消!",3000);
		vflag=false;
	}else if(flag==2){
		Message.showNotify("处理中的服务单无法取消!",3000);
		vflag=false;
	}else if(flag==3){
		temp=1;
	}
	
	if(vflag){
		$.ajax({
			async : false,
			url : "../orderService/del.do",
			type : "post",
			dataType : "json",
			data : {
				   id:id,
				   delType:temp,
				   imgname:imgname,
				   },
			success : function(data) {
			   
				if(data.msg=="fal"){
					Message.showNotify("服务单取消失败!",3000);
				}else{
					$("#warning").empty();
					$("#warning").html("服务单取消成功！");
					$('#showhideSure').css("display", "block");
					location.href="../orderService/progressqueryPage.do";
				}
				
			}
				   	   
		});
		
	}
	
}
