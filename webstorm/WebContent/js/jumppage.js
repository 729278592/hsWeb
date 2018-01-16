$(function(){
	$("#hxz").click(function(){
		//演示
		var namev = encodeURI(encodeURI("好享赚"));
		var typeName = "../hxz/goToHxzList.do?gameName="+namev;
		window.location.href = typeName;
	});
	$("#mine").click(function(){
		window.location="../goodml/mine.do";
	});
	$("#firstpage").click(function(){
		window.location="../goodml/firstpage.do";
	});
  	
  	$(".back").click(function(){
    	history.go(-1);
    	return false;
    });
  	$(".icon-arrow_back").click(function(){
    	history.go(-1);
    	return false;
    });	
  	$(".tomine").click(function(){
  		window.location="../goodml/mine.do";
  	});
  	$(".tolist").click(function(){
  		if(goodId==null){
  			goodId=0;
  		}
  		window.location="../goodml/shoplist.do?goodId="+goodId;
  	});
  	//2016.06.14-wgd 无底部菜单栏
  	$(".tolistno").click(function(){
  		if(goodId==null){
  			goodId=0;
  		}
  		window.location="../goodml/shoplistno.do?goodId="+goodId;
  	});
  	$("#myCard").click(function(){
  		window.location.href = "../effect/goToNewScan.do";
  	});
  	$("#wanzhuan").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
});	
