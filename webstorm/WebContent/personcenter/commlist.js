
$(function(){
	
	$("#list-m").click(function(){
		$(".menu-list").toggle();
		/*load();*/	
	});
	
	$("#list-m").on('click touchstart',function(event){    
	    event=event||window.event;    
	    event.stopPropagation();    
	}); 
	$(document).on('click touchstart',function(event){                         
	    $(".menu-list").hide();    
	    
	});	
	$("#zhoubian").click(function(){
		//现在是跳转到订单
		window.location="../person/orderlist.do?place=8";
		//window.location="../goodml/shopmap.do";
	});
	$("#firstpage").click(function(){
		window.location="../goodml/firstpage.do";
	});
	$("#wanzhuan").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
	$("#mine").click(function() {
		window.location = "../goodml/mine.do";
	});
});	

/*function load(){
	document.addEventListener('touchstart',fn, true);	
}	
function fn(event){
	event.preventDefault();
	 $(".menu-list").hide();
	 document.removeEventListener('touchstart', fn, true);
}*/