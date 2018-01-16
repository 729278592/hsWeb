var orderId;
var shopNo;
var goodId;
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId;
}
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function getHeight(){
	if($(".goodmsg_right").height()>$(".goodmsg_left").height()){
		$(".goodmsg_left").height($(".goodmsg_right").height());
	}else{
		$(".goodmsg_right").height($(".goodmsg_left").height());
	}
	if($(".seller_right").height()>$(".seller_left").height()){
		$(".seller_left").height($(".seller_right").height());
	}else{
		$(".seller_right").height($(".seller_left").height());
	}
	setTimeout("getHeight()", 100);
}
function showAll(){
	$.ajaxSetup({  
		async:false
	});     
	
	$.post("../order/order.do?orderId="+orderId,function(obj){
		
		$.post("../order/good.do?orderId="+orderId,function(obj2){
			if(obj){
				$("#buydate").html(obj.order.m_create_date);
			}
			if(obj2){
				$("#goodimg").attr("src","../good/down.do?filename="+obj2.good.m_good_pic);
				$("#gooddes").html(obj2.good.m_good_name+obj2.good.m_good_no);
				goodId=obj2.good.m_good_id;
				$("#shopname").html(obj2.shop.m_shopName);
				$("#shopaddr").html("("+obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr+")");
				$("#sellerimg").attr("src","../seller/down.do?filename="+obj2.seller.m_seller_pic);
				$("#ticount").html(obj2.ticount);
				$("#sellerpage").attr("href","../seller/sellerinfo.do?sd="+obj2.seller.m_seller_id);
				for(j=1;j<=obj2.seller.m_seller_fraction;j++){
					$(".gradestar").append($("<img src='../skins/personcenter/img/star_orange.png' class='star'/>"));
				}
				$(".foot_left").click(function(){
					window.location="../goodml/shop.do?shopNo="+obj2.shop.m_shopNo;
				});
			}
		},'json');
	},'json');
	
}
$(function(){
	orderId=GetQueryString("od");
	showAll();
	
	$(".foot_right").click(function(){
		$.ajax({
			url : '../post/isMyPost.do',
			data : {"goodsId":goodId,"orderId":orderId},
			type : 'post',
			dataType : 'json',
			success : function(result){
				if(result.code == 'success'){
					window.location="../person/offpost.do?od="+orderId;
				}else{
					alert(result.message);
				}
			}
		});
	});
	
	$("#goodimg").click(function(){
		$("#goodimg").click(function(){
			showgood(goodId);
		});
	});
});