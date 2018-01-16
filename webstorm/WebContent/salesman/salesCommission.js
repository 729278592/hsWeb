function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
var sellerId;
function showAll(){
	$.post("../seller/allinfo.do?sellerId="+sellerId,function(obj){
		if(obj){
			if(obj.seller){
				$("#sellername").html(obj.seller.m_seller_name);
				if(obj.seller.m_seller_pic!=null && obj.seller.m_seller_pic.length>0){
					$("#headimg").attr("src","../seller/smallDown.do?filename="+obj.seller.m_seller_pic);
				}
				for(q=1;q<=obj.seller.m_seller_fraction;q++){
					$(".star").append($("<img src='../skins/personcenter/img/star1orange.png' width='5%'>"));
				}
				$("#haoping").html(obj.haoping+"%");
				$(".grade").html(obj.seller.m_seller_grade);
				$("#tel").attr("href","tel:"+obj.seller.m_seller_phone);
				$("#sms").attr("href","sms:"+obj.seller.m_seller_phone);
			}
			if(obj.shop){
				$("#shopmsg").html("<span id='st'>"+obj.shop.m_shopName+"</span><br/><span id='adds'>"+"("+obj.shop.m_shopCity+obj.shop.m_shopTown+obj.shop.m_shopArea+obj.shop.m_shopAddr+")"+"</span>");
				$("#toshop").attr("href","../goodml/shop.do?shopNo="+obj.shop.m_shopNo);
			}
			if(obj.tuijian){
				$.each(obj.tuijian,function(i,o){
					$("#goodlist").append($("<li onclick='goToGoodsPage(\""+o.m_good_id+"\");'><div class='img1'><img src='../good/down.do?filename="+o.m_good_pic+"'width='90%'></div><div class='content'><p class='con_name'>"+o.m_good_name+o.m_good_no+"</p><p><span>赠品</span><span class='back'>返积分</span></p><span class='price'>￥"+o.m_good_price+"</span></div></li>"));
				});
			}else{
				$("#goodlist").append($("<li><img src='../skins/imgs/none.png' style='width:40%;margin-top:30%;margin-left:30%;'/></li>"));
			}
		}
	},'json');
}
$(function(){
	sellerId=GetQueryString("sd");
	showAll();
});

function goToGoodsPage(goodsId){
	window.location.href = "../goodml/goToGoodsDetails.do?goodsId=" + goodsId;
}
$(document).ready(function(){
	
	//返回页面
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
});

