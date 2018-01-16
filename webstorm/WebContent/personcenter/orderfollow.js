function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
var orderId;
var goodId;
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId;
}
function showAll(){
		$.ajaxSetup({  
		    async : false  
		});
		
		//跟踪信息
		$.post("../order/logistics.do?orderId="+orderId,function(obj3){
			//alert(JSON.stringify(obj3));
			var htmlCode = "";
			if(obj3.code == 'success'){
				
				var time = new Date(obj3.objs[1]);
				var month = (time.getMonth()+1) > 9 ? (time.getMonth()+1) : "0" + (time.getMonth()+1);//月
				var days = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();//日
				var hours = time.getHours() > 9 ? time.getHours() :  "0" + time.getHours();
				var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
				var seconds = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
				
				var wlinfo = obj3.objs[0] == null ? "" : obj3.objs[0];
				
				htmlCode += "<p>"+wlinfo+"</p>";
				htmlCode += "<dd>" + time.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds + "</dd>";
			}else{
				htmlCode += "<p>"+obj3.message+"</p>";
			}
			$("#wlcontent").html(htmlCode);
		},'json');
		
		//商品头信息
		$.post("../order/onegood.do?orderId="+orderId,function(obj2){
			if(obj2){
				$("#goodimg").attr("src","../good/down.do?filename="+obj2.good.m_good_pic);
				$("#goodmsg").html(obj2.good.m_good_name+obj2.good.m_good_no+"("+obj2.color+")");
				$("#goodprice").html("￥"+obj2.price);
				$("#fan").html(obj2.good.m_good_buyBack);
				$("#yun").html(obj2.good.m_freight);
				goodId=obj2.good.m_good_id;
			}
		},'json');
		
		//订单信息
		$.post("../order/order.do?orderId="+orderId,function(obj){
			if(obj){
				var time = new Date(obj.order.m_create_date);
				var month = (time.getMonth()+1) > 9 ? (time.getMonth()+1) : "0" + (time.getMonth()+1);//月
				var days = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();//日
				var hours = time.getHours() > 9 ? time.getHours() :  "0" + time.getHours();
				var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
				var seconds = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
				
				$("#createdate").html(time.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds);
				
				$("#ordernum").html(obj.order.m_order_num);
				$("#addr_get").html(obj.order.m_address);
				$("#zonge").html(obj.order.m_total_cash);
				$("#shipay").html(obj.order.m_total_cash);
				var phone=obj.order.m_phone;
				var newPhone="";
				for(i=0;i<phone.length;i++){
					if(i>=3 && i<=6){
						newPhone+="*";
					}else{
						newPhone+=phone.charAt(i);
					}
					
				}
				$("#name").html(obj.order.m_name+" "+newPhone);
				if(obj.order.m_invoice=="1"){
					$("#fapiaotype").html("电子发票");
				}else if(obj.order.m_invoice=="2"){
					$("#fapiaotype").html("个人发票");
				}else{
					$("#fapiaotype").html("单位发票");
				}
				if(obj.order.m_compay_title!=null){
					$("#taitou").html(obj.order.m_compay_title);
				}
				var stu=parseFloat(obj.order.m_statu);
				if(stu<6){//非退订
					if(stu>=1){//已下单
						$("#t1").css("color","#03BED4");
						$("#quan1").attr("src","../skins/personcenter/img/yuan2.png");
					}
					if(stu>=1.1){//已付款（备货）
						$("#t2").css("color","#03BED4");
						$("#quan2").attr("src","../skins/personcenter/img/yuan2.png");
						$("#xian2").attr("src","../skins/personcenter/img/line2_03.png");
						$("#t3").css("color","#03BED4");
						$("#quan3").attr("src","../skins/personcenter/img/yuan2.png");
						$("#xian3").attr("src","../skins/personcenter/img/line2_03.png");
					}
					if(stu>=2){//已出库
						$("#t4").css("color","#03BED4");
						$("#quan4").attr("src","../skins/personcenter/img/yuan2.png");
						$("#xian4").attr("src","../skins/personcenter/img/line2_03.png");
					}
					if(stu>=3){//已完成
						$("#t5").css("color","#03BED4");
						$("#quan5").attr("src","../skins/personcenter/img/yuan2.png");
						$("#xian5").attr("src","../skins/personcenter/img/line2_03.png");
					}
				}
			}
		},'json');
}
$(function(){
	orderId=GetQueryString("od");
	showAll();
	$("#goodimg").click(function(){
		showgood(goodId);
	});
	
	//返回全部订单页面
	$("#backPage").click(function(){
		history.go(-1);
		return false;
	});
	
});