//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            
var pageSize=5;             
var num = 1;  				
$(document).ready(function(){  
    var range = 50;             
    var elemt = 500;         
    var totalheight = 0;   
   /* var main = $("#content");   */
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
	$(".product").empty();
	$.post("../seller/sellrecord.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		maxnum=obj.pageSum;
		num=pageNow;
		
		if(obj && obj.records){
			$.each(obj.records,function(i,o){
				$.post("../good/goodIsBack.do?goodId="+o.m_gsab_good_id+"&goodsSeq="+o.m_gsab_goodxulie,function(obj2){
					if(obj2 && obj2.good){
						//等于0是为未返现就不能显示
						if(obj2.orderInfo.m_back_statu == 0){
							$("section").append($("<div class='tab-content'><div class='share_box'><div class='share_top'><div class='share_img'><img alt='' src='../good/down.do?filename="+obj2.good.m_good_pic+"'></div><div class='share_content'><p>"+obj2.good.m_good_name+obj2.good.m_good_no+"</p><span>商品序列号&nbsp;&nbsp;:</span><span>"+o.m_gsab_goodxulie+"</span></div></div></div><div class='time'><ul><li class='shenq'>购买时间&nbsp;&nbsp;:</li><li class='tokiwa' style=''>"+o.m_gsab_createDate+"</li></ul></div></div"));
						}else{
							$("section").append($("<div class='tab-content'><div class='share_box'><div class='share_top'><div class='share_img'><img alt='' src='../good/down.do?filename="+obj2.good.m_good_pic+"'></div><div class='share_content'><p>"+obj2.good.m_good_name+obj2.good.m_good_no+"</p><span>商品序列号&nbsp;&nbsp;:</span><span>"+o.m_gsab_goodxulie+"</span></div></div></div><div class='time'><ul><li class='shenq'>购买时间&nbsp;&nbsp;:</li><li class='tokiwa' style=''>"+o.m_gsab_createDate+"</li><li class='ward'>奖励积分+"+o.m_gsab_points+"</li></ul></div></div"));
						}
					}
				},'json');
			});
		}else{
			if(pageNow==1){
				$(".product").append($("<img src='../skins/imgs/none.png' style='width:40%;margin-top:30%;margin-left:30%;'/>"));
			}
		}
	},'json');
}
$(function(){
	showAll(1);
});