/**
 * 个人结算
 */
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


$(function(){
	$.ajax({
		url : '../account/queryOrder.do',
		type : 'POST',
		data : {"goodsId":GetQueryString("goodsId")},
		dataType : 'JSON',
		async : false,
		success : function(result){

			var addCodeHtml = "";//地址信息
			var goodsCodeHtml = "";//商品信息
			
			//存在默认地址
			if(result.listA != null && result.listA != ""){
				
				$("#addressId").val(result.listA[0].m_id);//地址ID
				
				addCodeHtml = '<li style="width: 90%; height: 7rem; float: left;">' +
							    '<ul style="width: 100%; height: 5rem; margin-top: 1em; margin-left: 1em;">' +
								    '<li style="width: 100%; height: 2rem; float: left;">'+
										'<p style="font-size: 1.5em; color: #1a2026; font-family: 微软雅黑; font-weight: normal; line-hight: 5rem; text-aline: center; margin-left: 0.2em;">' +
											'<span>'+result.listA[0].m_user_name+'</span>' +
											'&nbsp;&nbsp;&nbsp;&nbsp;' +
											'<span>'+result.listA[0].m_phone+'</span>' +
										'</p>' +
									'</li>' +
									'<li style="width: 100%; height: 2rem; float: left;">' +
										'<p style="font-size: 1.5em; color: #1a2026; font-family: 微软雅黑; font-weight: normal; line-hight: 5rem; text-aline: center; margin-left: 0.2em;">'+result.listA[0].m_address+'</p>' +
									'</li>' +
								'</ul>' +
							  '</li>' +
								 '<img src="../skins/closeaccount/img/icon_arrow_right.png" style="width:16px;margin-top: 3rem;">' +
							  '</li>';
			}else{
				addCodeHtml = '<li style="width: 90%; height: 7rem; float: left;"></li>' +
							  '<li style="width: 10%; height: 7rem; float: left; text-aline: right; line-height: 7rem;">' +
								 '<img src="../skins/closeaccount/img/icon_arrow_right.png">' +
							  '</li>';
			}
			
			//是否存在商品信息
			if(result.goodsList != "" && result.goodsList.length >= 1){
				
				$("#goodsId").val(result.goodsList[0][0]);//商品ID
				
				goodsCodeHtml = '<li style="width: 30%; height: 8rem; float: left;">' +
									'<nav style="width: 90%; height: 80%;">' +
										'<img style="width: 100%; height: 100%; margin-left: 1em; margin-top: 0.8em;" alt="produceimage" src="../account/accountDown.do?fileName='+result.goodsList[0][2]+'">' +
									'</nav>' +
								'</li>' +
								'<li style="width: 60%; height: 8rem; float: left; margin-left: 2em;">' +
									'<p style="font-size: 1.1em; color: #1a2026; font-family: 微软雅黑; font-weight: normal; line-hight: 8rem; margin-top: 0.8em; margin-left: 1em;">' +
										result.goodsList[0][1] +
										'</br>' +
										'<a style="color: #ff0000; font-weight: 500;">￥'+result.goodsList[0][3]+'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
										'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;×1' +
									'</p>' +
								'</li>' ;
				
				$("#syjg").text("￥"+result.goodsList[0][3]);//商品价格
				$("#gmfx").text("￥"+result.goodsList[0][4]);//购买返现
				$("#xf").text("+￥"+result.goodsList[0][5]);//运费
				$("#yfje").text(result.goodsList[0][3]);//应付金额
				
				//运费小于等于零,则显示免运费三个字
				if(parseFloat(result.goodsList[0][5]) <= 0){
					$("#mxf").text("免运费");//免运费显示
				}
				
			}
			
			$("#addList").html(addCodeHtml);
			$("#goodsContent").html(goodsCodeHtml);
			
		}
	});
	
	//全局变量
	var clickFlag = true;
	
	//提交订单
	$("#subOrder").click(function(){
		
		var addressId = $("#addressId").val();//地址ID
		var goodsId = $("#goodsId").val();//商品ID
		var buyNum = $("#buyNum").val();//购买数量
		var fapiao = $("#fapiao").val();//发票抬头内容
		
		if(addressId == null || addressId == ""){
			alert("请选择默认地址!");
			return null;
		}
		
		if(goodsId == null || goodsId == ""){
			alert("请选择要购买的商品!");
			return null;
		}
		
		
		//暂时默认购买数量为1
		var data = {"addressId":addressId,"goodsId":goodsId,"buyNum":buyNum,"invoice":fapiao};
		
		//防止重复点击
		if(clickFlag){
			clickFlag = false;
			$.ajax({
				url : '../order/addToOrder.do',
				data : data,
				type : 'POST',
				dataType : 'JSON',
				success : function(result){
					if(result.backPageInfo){
						alert("购买成功!");
					}else{
						clickFlag = true;
					}
				}
			});
		}
		
	});
	
	//绑定点击事件
	$("#addList").click(function(){
		var aId = $("#addressId").val();
		//根据地址ID来判断是显示地址列表还是新增地址
		
		var goodsId = $("#goodsId").val();
		if(aId != null && aId != ""){
			window.location.href = "../address/goToAddressPage.do?goodsId="+goodsId;
		}else{
			window.location.href = "../address/goToSaveAddress.do?showDefault=no&goodsId="+goodsId;
		}
		
	});
	
	
	
});
