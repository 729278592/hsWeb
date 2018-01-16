//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            
var pageSize=5;             
var num = 1;  				
$(document).ready(function(){  
    var range = 50;             
    var elemt = 500;         
    var totalheight = 0;   
    $(window).scroll(function(){  
        var srollPos = $(window).scrollTop();
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {   
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
	$("section").empty();
	$.post("../seller/myposts.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		maxnum=obj.pageSum;
		num=pageNow;
		if(obj && obj.posts){
			$.each(obj.posts,function(i,o){
				$.post("../seller/usermsg.do?uid="+o.m_mp_user_id+"&gid="+o.m_mp_goodId,function(obj2){
					if(obj2 && obj2.user && obj2.good){
						$("section").append($("<div  class='evaluate'><div class='evaluatelist'><div class='list1'><div class='number1'><div class='profile_images'><img src='../skins/salesman/images/icon_user_gray.png' id='touxiang'/></div><div class='uname'><p id='selname"+o.m_mp_id+"'></p><span>VIP"+obj2.vip+"</span></div><div class='fenr' id='fen"+o.m_mp_id+"'></div></div><div class='number2'><p>"+o.m_mp_text+"</p></div><div class='pictures'><div class='wrapper'><div class='block'><ul class='thumbs' id='pic"+o.m_mp_id+"'></ul></div></div></div><div class='number3'><span>商品："+obj2.good.m_good_name+obj2.good.m_good_no+"</span><span class='date'>"+o.m_mp_postdate.substr(0,10)+"</span></div></div></div></div>"));
						if(o.m_mp_poster=="0"){
							if(obj2.user.nickname.length==0){
								$("#selname"+o.m_mp_id).html("赚客");
							}else if(obj2.user.nickname.length==1){
								$("#selname"+o.m_mp_id).html(obj2.user.nickname[0]+"****");
							}else{
								$("#selname"+o.m_mp_id).html(obj2.user.nickname[0]+"****"+obj2.user.nickname[obj2.user.nickname.length-1]);
							}
						}else{
							if(obj2.user.nickname.length==0){
								$("#selname"+o.m_mp_id).html("赚客");
							}else{
								$("#selname"+o.m_mp_id).html(obj2.user.nickname);
							}
						}
						if(obj2.user.head_img.substr(0,7)=="http://"){
							$("#touxiang").attr("src",obj2.user.head_img);
						}else{
							$("#touxiang").attr("src","../cashRanking/img.do?imgName="+obj2.user.head_img);
						}
						for(j=1;j<=o.m_mp_fraction;j++){
							$("#fen"+o.m_mp_id).append($("<img src='../skins/personcenter/img/star_orange.png' class='goodstar'/>"));
						}
						if(o.m_mp_pic1!="" && o.m_mp_pic1!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic1+"'><img src='../post/down.do?filename="+o.m_mp_pic1+"'></a></li>"));
						}
						if(o.m_mp_pic2!="" && o.m_mp_pic2!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic2+"'><img src='../post/down.do?filename="+o.m_mp_pic2+"'></a></li>"));
						}
						if(o.m_mp_pic3!="" && o.m_mp_pic3!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic3+"'><img src='../post/down.do?filename="+o.m_mp_pic3+"'></a></li>"));
						}
						if(o.m_mp_pic4!="" && o.m_mp_pic4!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic4+"'><img src='../post/down.do?filename="+o.m_mp_pic4+"'></a></li>"));
						}
						if(o.m_mp_pic5!="" && o.m_mp_pic5!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic5+"'><img src='../post/down.do?filename="+o.m_mp_pic5+"'></a></li>"));
						}
						if(o.m_mp_pic6!="" && o.m_mp_pic6!=null){
							$("#pic"+o.m_mp_id).append($("<li><a class='venobox' data-gall='gall1' title='' href='../post/down.do?filename="+o.m_mp_pic6+"'><img src='../post/down.do?filename="+o.m_mp_pic6+"'></a></li>"));
						}
					}	
				},'json');
				
			});
		}else{
			if(pageNow==1){
				$("section").append($("<img src='../skins/imgs/none.png' style='width:40%;margin-top:30%;margin-left:30%;'/>"));
			}
		}
	},'json');
}
$(function(){
	showAll(1);
});