function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function(){
	
	var goodsId = GetQueryString("goodsId");//商品主键
	
	$.ajax({
		url : '../goodml/shareGoodsLoadImg.do',
		type : 'POST',
		data : {"goodsId":goodsId},
		dataType : 'json',
		async : false,
		success : function(result){
			//商品介绍
			var imgListH = result.listil;
			var imgHtml = "";
			for(var i = 0;i < imgListH.length;i ++){
				if(imgListH[i].m_image_type == 'commodity'){
					imgHtml += '<li><img src="../good/goodsDetailsDown.do?filename='+imgListH[i].m_image_name+'" width="99%"></li>';
				}
			}
			$("#imgList").html(imgHtml);
		}
	});
});
