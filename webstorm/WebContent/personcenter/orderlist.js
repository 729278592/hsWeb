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
        	}
        }  
    });  
}); 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
$.ajaxSetup({  
	    async : false  
});  
var place;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function showAll(pageNow){
	//1待付款，2待收货，3已收货，4已评价,5售后，6退订 ，9订单超时
	$("#nomsg").remove();
	$("#place"+place).css("border-bottom","2px solid #389ffe");
	$("#place"+place+" a").css("color","#389ffe");
	$.post("../order/statusorders.do?orderStatus="+place+"&pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		if(obj && obj.orderlist){
			maxnum=obj.pageSum;
			$.each(obj.orderlist,function(i,o){
				var orderId=o.m_id;
				$.post("../order/onegood.do?orderId="+orderId,function(obj2){
					if(obj2 && obj2.good){
						$("#orderlist").append($("<div class='content' id='div"+o.m_id+"'><div class='olderId' ><ul><li class='older' id='title"+o.m_id+"'>订单号&nbsp;:</li><li class='number' id='num"+o.m_id+"'>"+o.m_order_num+"</li><li class='suction' id='stas"+o.m_id+"'></li></ul></div><div class='produce' onclick='xiangQing("+o.m_id+","+o.m_onlineOff+")'><div class='produce_show'><img src='../good/down.do?filename="+obj2.good.m_good_pic+"'/></div><div class='produce_detail'><P>"+obj2.good.m_good_name+obj2.good.m_good_no+"</p><p class='data'>￥"+obj2.price+"</p></div></div><div class='monthday'><ul><li class='monthday-lt'>"+o.m_create_date.substr(0,10)+"</li><li class='monthday-rt'><div class='eveb'><dd>共"+obj2.count+"件</dd><dd>应付金额</dd> <dd style='color:#e60012;'>￥"+o.m_total_cash+"</dd></div></li></ul></div><div class='input-choic' id='bon"+o.m_id+"'></div></div>"));
						if(o.m_statu=="1"){
							$("#stas"+o.m_id).html("待付款");
							$("#bon"+o.m_id).append($("<a href='#' onclick='noShow("+o.m_id+")' class='hide"+o.m_id+"'><span  class='lost' style='text-align: center;line-height: 2.4rem;font-size: 1.2em;margin-right:3%;display:inline-block;width:7rem;float:right;height:2.5rem;border-radius:35px;background: #ffffff;color:#505050;border:1px solid #868686;text-align: center;font-size: 1.2em;margin-right: 3%;'>取消订单</span></a><a href='javascript:void(0);' class='hide"+o.m_id+"' onclick='toPay("+o.m_id+","+obj2.good.m_good_id+")'><span class='paymoney' style='display:inline-block;width:7rem;float:right;height:2.5rem;border:1px solid #389ffe;background:#389ffe;border-radius:35px;color:#fff;text-align: center;line-height: 2.4rem;font-size: 1.2em;margin-right: 3%;text-align: center;font-size: 1.2em;margin-right: 3%;'>去支付</span></a>"))
						}else if(o.m_statu=="2" || o.m_statu=="1.1"){
							$("#stas"+o.m_id).html("待收货");
							if(o.m_statu=="2" ){
								$("#bon"+o.m_id).append($("<a href='javascript:qrsh("+o.m_id+");' ><span class='paymoney' style='display:inline-block;text-align:center;width:7rem;margin-bottom:1em;float:right;height:2.5rem;line-height:2.4rem;border:1px solid #389ffe;background:#389ffe;border-radius:35px;color:#fff;font-size:1.2em;margin-right:3%;'>确认收货</span></a>"));
							}else{
								$("#bon"+o.m_id).hide();
							}
						}else if(o.m_statu=="3"){
							$("#stas"+o.m_id).html("等待评价");
							$("#bon"+o.m_id).append($("<a href='#' id='post"+o.m_id+"' onclick='toPost("+o.m_id+","+o.m_onlineOff+")'><span  class='paymoney' style='text-align: center;line-height: 2.4rem;font-size: 1.2em;margin-right: 3%;display:inline-block;width:7rem;float:right;height:2.5rem;border-radius:35px;color:#fff;text-align: center;font-size: 1.2em;margin-right: 3%;'>去评价</span></a>"));
						}else if(o.m_statu=="4"){
							$("#stas"+o.m_id).html("已评价");
							$("#bon"+o.m_id).hide();
						}else if(o.m_statu=="5"){
							$("#stas"+o.m_id).html("售后");
							$("#bon"+o.m_id).hide();
						}else if(o.m_statu=="6"){
							$("#stas"+o.m_id).html("退订");
							$("#bon"+o.m_id).hide();
						}else if(o.m_statu=="9"){
							$("#stas"+o.m_id).html("订单超时");
							$("#bon"+o.m_id).hide();
						}
						if($.trim(o.m_onlineOff)=="01"){
							$("#title"+o.m_id).html("门店订单");
							$("#num"+o.m_id).css("color","white");
						}
					}
					
				},'json');
			});
		}else{
			if(pageNow==1){
				$(".viewbox").append($("<img src='../skins/imgs/none.png' id='nomsg'/style=\"width: 40%;margin-top: 10rem;margin-left: 30%;padding-bottom:10%;\">"));
			}
			
		}
	},'json');
}
function toPost(orderId,from){
	if(from>0){
		window.location="../person/offpost.do?od="+orderId;
	}else{
		window.location="../person/onpost.do?od="+orderId;
	}
}
function xiangQing(orderId,from){
	if(from>0){
		window.location="../person/shoporderfollow.do?od="+orderId;
	}else{
		window.location="../person/orderfollow.do?od="+orderId;
	}
}
function toPay(orderId,goodsId){
	
	$.ajax({
		url : '../order/pcPayOk.do',
		data : {"orderId":orderId,"goodsId":goodsId},
		type : 'POST',
		dataType : 'json',
		async : false,
		success :function(result){

			if(result.code == 'success'){
				
				 var sh_url = "http://" + hs_url + "/mxj_weixin/pay/getUnified";
				 var headInfo = "application/json";//头信息
				 var payData = JSON.stringify({"userId":result.userId,"body":result.body,"outTradeNo":result.outTradeNo,"notifyUrl":result.notifyUrl,"totalFee":result.totalFee});
				 
				 if(debug){
					 sh_url = "../order/testHsPay.do";
					 headInfo = "application/x-www-form-urlencoded; charset=UTF-8";
					 payData = {"userId":result.userId,"body":result.body,"outTradeNo":result.outTradeNo,"notifyUrl":result.notifyUrl,"totalFee":result.totalFee};
				 }
				
				 $.ajax({
					 type: "POST",
				     url: sh_url,
				     contentType: headInfo, //必须有
				     dataType: "json", //表示返回值类型，不必须
				     data:payData,
				     success: function (obj) {
				    	 
				    	 if(debug){
				    		 //TODO 正式环境不需要
				    		 obj = eval("("+obj+")");
				    	 }
				    	
			            if (obj.msg && obj.msg.packageStr) {
			                WeixinJSBridge.invoke('getBrandWCPayRequest',{
			                    "appId" : obj.msg.appId,
			                    "timeStamp" : obj.msg.timeStamp,
			                    "nonceStr" : obj.msg.nonceStr,
			                    "package" : obj.msg.packageStr,
			                    "signType" : obj.msg.signType,
			                    "paySign" : obj.msg.sign
			                },function(res) {
			                    if (res.err_msg == "get_brand_wcpay_request:ok"){
			                    	
			                    	//最后一次操作更新订单状态
			                    	//并向收益和支出表插入数据
//			                    	$.ajax({
//			                    		url : '../order/payOkUpdStatus.do',
//			                    		data : {"orderId":result.orderId,"goodsId":result.goodsId,"orderStatus":"1.1"},
//			                    		type : 'POST',
//			                    		dataType : 'json',
//			                    		async : false,
//			                    		success : function(backData){
//			                    			
//			                    			if(backData.code == "success"){
//			                    				//window.location.href = "../person/orderlist.do?place=1";
			                    				window.location.href = " ../person/orderfollow.do?od=" + result.orderId;
//			                    			}else{
//			                    				alert(backData.message);
//			                    			}
//			                    			
//			                    		}
//			                    	});
			                    	
			                    }
			                });
			            }
				     }
				 });
				
				
			}
			
			if(result.code == 'order'){
				Message.showNotify("该订单状态有误,请稍后在试!",3000);
			}
			
			if(result.code == 'goods'){
				Message.showNotify("该订单对应的商品不存在!",3000);
			}
			
		}
		
	});
}
function noShow(orderId){
	
	Message.showConfirm("确认取消该订单?","确认","取消",function(){
		$.post("../order/noshow.do?orderId="+orderId,function(){
			$("#orderlist ").empty();
			num=1;
			showAll(1);
		});
	});
	
	/*if(confirm("确认取消该订单?")){
		$.post("../order/noshow.do?orderId="+orderId,function(){
			$("#orderlist ").empty();
			num=1;
			showAll(1);
		});
	}*/
}
function changePlace(s){
	$("#orderlist ").empty();
	$("li").css("border-bottom","0px solid black");
	$("li a").css("color","#505050");
	place=s;
	num=1;
	showAll(1);
}
function qrsh(id){
	
	Message.showConfirm("确定收货吗?","确认","取消",function(){
		$.ajax({
			url : '../order/qrsh.do',
			data : {"orderId":id},
			type : 'POST',
			dataType : 'json',
			async : false,
			success : function(result){
				if(result.code == "success"){
						alert("成功");
						location.reload();
				}else{
					alert(result.message);
				}
			}
		});
	});
	
	/*if(confirm("确定收货吗？")){
		$.ajax({
			url : '../order/qrsh.do',
			data : {"orderId":id},
			type : 'POST',
			dataType : 'json',
			async : false,
			success : function(result){
				if(result.code == "success"){
						alert("成功");
						location.reload();
				}else{
					alert(result.message);
				}
			}
		});
	}*/
}
$(function(){
	place=GetQueryString("place");
	$("#orderlist ").empty();
	num=1;
	showAll(1);
});