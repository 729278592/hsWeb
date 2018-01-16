function showAll(){
	$.post("../mine/showall.do",function(obj){
		if(obj && obj.user){
			$("#name").html(obj.user.nickname);
			$("#sharecount").html(obj.sharecount);
			$("#mccount").html(obj.mccount);
			$("#postcount").html(obj.postcount);
			$("#points").html(obj.user.points);
			$("#cash").html("￥"+obj.user.ready_money+"&nbsp;");
			$(".yingxiangli").html(obj.effect+"&nbsp;");
			$("#vip").html(obj.vip);
			if(obj.hehuo){
				$("#hehuo").html(obj.hehuo+"&nbsp;");
			}
			if(obj.user.head_img.substr(0,7)=="http://"){
				$("#userimg").attr("src",obj.user.head_img);
			}else{
				$("#userimg").attr("src","../cashRanking/img.do?imgName="+obj.user.head_img);
			}
		}
	},'json');
	$.post("../mine/unreadMessages.do",function(obj){
		if(Number(obj)>0){
			$("#message").css("display","inline-block");
		}else{
			$("#message").css("display","none");
		}
	},'json');
}
function tonewpage(act){
	$.post("../mine/zenpage.do?act="+act,function(obj){
		if(obj && obj.url){
			window.location=obj.url;
		}
	},'json');
}
$(function(){
	showAll();
	$("#toseller").click(function(){
		$.post("../seller/userseller.do",function(obj){
			if(obj){
				if(obj.stus=="1"){
					if(obj.login=="1"){
						window.location="../seller/index.do";
					}else{
						window.location="../seller/login.do";
					}
				}else{
					if(obj.stus2=="0"){
						window.location="../seller/login.do";
					}else{
						window.location="../seller/wait.do";
					}
				}
			}
		},'json');
	});
	
});

$(function(){
	$("#zhoubian").click(function(){
		window.location="../goodml/shopmap.do";
	});
	$("#firstpage").click(function(){
		window.location="../goodml/firstpage.do";
	});
	$("#wanzhuan").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
	
	$('#cashtip').click(function(){
//		$('#showhide').show();
//		document.ontouchmove=function(){
//			return false;
//			};
		window.location.href = "../cashRanking/page.do";
	});
	$("#showhide p").click(function(){
		$('#showhide').hide();
		document.ontouchmove=function(){
			return true;
			};
	});
});	
