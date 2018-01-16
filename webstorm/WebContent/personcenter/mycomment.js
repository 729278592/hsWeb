//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
$(document).ready(function(){  
    var range = 50;             //距下边界长度/单位px  
    var elemt = 500;           //插入元素高度/单位px  
    var totalheight = 0;   
    var main = $("#content");                     //主体元素  
    $(window).scroll(function(){  
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)  
          
        //console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());  
        //console.log("页面的文档高度 ："+$(document).height());  
        //console.log('浏览器的高度：'+$(window).height());  
          
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {  
           // main.append("<div style='border:1px solid tomato;margin-top:20px;color:#ac"+(num%20)+(num%20)+";height:"+elemt+"' >hello world"+srollPos+"---"+num+"</div>");  
        	num++;
        	if(num <= maxnum){
        		showAll(num);
        	}else{
        		num--;
        	}
        	
     
        }  
    });  
}); 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function showAll(pageNow){
	$.ajaxSetup({  
	    async : false  
	}); 
	num=pageNow;
	$.post("../post/showmine.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){		
		maxnum=obj.pageSum;
		if(obj && obj.mine){
			$.each(obj.mine,function(i,o){
//				$.post("../good/good.do?goodId="+o.m_mp_muid,function(obj2){
				$.post("../good/good.do?goodId="+o.m_mp_goodId,function(obj2){
					if(obj2 && obj2.good){
						$("#postlist").append($("<li class='share_box'><div class='share_top share_pub'><div class='share_img'><img src='../good/down.do?filename="+obj2.good.m_good_pic+"' onclick='showgood("+obj2.good.m_good_id+")'></div><div class='share_content'><p>"+obj2.good.m_good_name+obj2.good.m_good_no+"</p><div class='content'><p>"+o.m_mp_text+"</p></div></div><div class='img_show'><div class='wrapper'><div class='block'><ul class='thumns' id='postimg"+o.m_mp_id+"'></ul></div></div></div></div><div class='share' id='post_footer"+o.m_mp_id+"'><span class='' id='fen"+o.m_mp_id+"'></span><span class='star' id='star"+o.m_mp_id+"'></span><span class='date'>"+o.m_mp_postdate.substr(0,10)+"</span></div></li>"));
						if(o.m_mp_pic1!=null && o.m_mp_pic1!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic1+"'><img src='../post/down.do?filename="+o.m_mp_pic1+"'></a></li>"));
						}
						if(o.m_mp_pic2!=null && o.m_mp_pic2!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic2+"'><img src='../post/down.do?filename="+o.m_mp_pic2+"'></a></li>"));
						}
						if(o.m_mp_pic3!=null && o.m_mp_pic3!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic3+"'><img src='../post/down.do?filename="+o.m_mp_pic3+"'></a></li>"));
						}
						if(o.m_mp_pic4!=null && o.m_mp_pic4!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic4+"'><img src='../post/down.do?filename="+o.m_mp_pic4+"'></a></li>"));
						}
						if(o.m_mp_pic5!=null && o.m_mp_pic5!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic5+"'><img src='../post/down.do?filename="+o.m_mp_pic5+"'></a></li>"));
						}
						if(o.m_mp_pic6!=null && o.m_mp_pic6!=""){
							$("#postimg"+o.m_mp_id).append($("<li><a class='venobox vbox-item' data-gall='gall1' href='../post/down.do?filename="+o.m_mp_pic6+"'><img src='../post/down.do?filename="+o.m_mp_pic6+"'></a></li>"));
						}
						if(o.m_mp_fraction>=4){
							$("#fen"+o.m_mp_id).html("已好评");
						}else if(o.m_mp_fraction>=2){
							$("#fen"+o.m_mp_id).html("已中评");
						}else{
							$("#fen"+o.m_mp_id).html("已差评");
						}
						for(var s=1;s<=o.m_mp_fraction;s++){
							$("#star"+o.m_mp_id).append($("<span class='icon_star'><img src='../skins/personcenter/img/star1orange.png' width='90%'></span>"));
						}
					}
					
				},'json');
				
			});
			
		}else{
			if(pageNow==1){
				$("body").append($("<img src='../skins/imgs/none.png' id='nomsg'/ style=\"width: 40%;margin-top:10rem;margin-left: 30%;padding-bottom:10%;\">"));
			}
		}
		
	},'json');
}
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId;
}
$(function(){
	$("#postlist li").remove();
	showAll(1);
});

$(document).ready(function(){
	
	//返回页面
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
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