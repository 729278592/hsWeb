//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
$(document).ready(function(){  
    var range = 50;             //距下边界长度/单位px  
    var elemt = 500;           //插入元素高度/单位px  
    var totalheight = 0;   
    $(window).scroll(function(){  
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)  
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
	$.post("../mine/message.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		maxnum=obj.pageSum;
		num=pageNow;
		if(obj && obj.msglist){
			$.each(obj.msglist,function(i,o){
				$(".content").append($("<div class='tips'><div class='tips_l'><img src='../skins/personcenter/img/icon_tip.png'></div><div class='tips_r'><p>"+o.m_msg_date.replace(o.m_msg_date[10],"  ")+"</p><div class='words'><img src='../skins/personcenter/img/xbg.png'><p>"+o.m_msg_text+"</p></div></div></div>"));
				//进入这个页面加载完数据后就改变信息表中的未读字段为已读
				$.post("../mine/updateMessage.do?msgId="+o.m_msg_id,function(obj){
				},'json');
				/* 2016-07-05,由于业务逻辑变化,超链接信息通过cms后台来管理配置
				 * $(".content").append($("<div class='tips'><div class='tips_l'><img src='../skins/personcenter/img/icon_tip.png'></div><div class='tips_r'><p>"+o.m_msg_date.replace(o.m_msg_date[10],"  ")+"</p><div class='words'><img src='../skins/personcenter/img/xbg.png'><p>"+o.m_msg_text+"<a href='' id='goto"+o.m_msg_id+"'></a></p></div></div></div>"));
				 * if(o.m_msg_type=="zen"){
					$.post("../mine/zenpage.do?act=2",function(data){
						if(data && data.url){
							$("#goto"+o.m_msg_id).html("点击进入").attr("href",data.url);
						}
					},'json');
				}*/
			});
		}else{
			if(pageNow==1){
				$(".content").append($("<img src='../skins/imgs/none.png' style='width:50%;margin-top:30%;margin-left:20%;'/>"));
			}
		}
	},'json');
}
$(function(){
	showAll(1);
});