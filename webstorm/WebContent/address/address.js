function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function(){
	
	$("#goodsId").val(GetQueryString("goodsId"));
	
	var goodsNum = GetQueryString("gsn");//商品数量
	var goodsColor = decodeURI(GetQueryString("gsc"));//商品颜色
	
	//加载数据
	$.ajax({
		url : '../address/loadAddress.do',
		type : 'POST',
		dataType : 'JSON',
		async : false,
		success : function(result){
			var htmlCode = "";
			for(var i = 0;i < result.length;i ++){
				
				var activeHtml = "";
				if(result[i].m_default == 0){
					activeHtml = '<i class="sh-ico active2" ></i>';
					$("#mdeId").val(result[i].m_id);//把地址默认ID放到HTML页面中去
				}else{
					activeHtml = '<i class="sh-ico"></i>';
				}
				
				htmlCode += '<li class="bor" id="'+result[i].m_id+'">' +
					        	'<div class="sh-box">' +
					        		activeHtml + 
					            	'<div class="sh-boxo">' +
					                	'<div style=" float:left; width:66%;">' +
					                		'<span class="sh-boxotext" style="width:80px;">'+result[i].m_user_name+'</span>' +
					                        '<span class="sh-boxotexto" style="line-height:12px;">收货地址：'+result[i].m_province + result[i].m_city + result[i].m_county + result[i].m_address+'</span>' +
					                    '</div>' +
					                    '<div style="overflow:hidden;">' +
					                    	'<span class="sh-boxt">'+result[i].m_phone+'</span>' +
					                        '<i class="sh-boxotexto-ico sh-boxotexto-ico-o"></i>' +
					                    '</div>' +
					                '</div>' +
					            '</div>' +
				            '</li>';
			}
			
			$("#addressList").html(htmlCode);
			
		}
	});
	
	//新增
	$("#newAdd").click(function(){
		var goodsId = $("#goodsId").val();
		window.location.href = "../address/goToSaveAddress.do?showDefault=yes&goodsId="+goodsId+"&gsc="+encodeURI(encodeURI(goodsColor))+"&gsn="+goodsNum;
	});
	
	//选择
	$(".bor").click(function(){
		$(".bor .sh-box .sh-ico").removeClass("active2");
		$(this).children().children(".sh-ico").addClass("active2");
		//把选择的ID赋值到页面去
		var addId = $(this).attr("id");
		$("#mdeId").val(addId);
	});
	
	//删除
	$(".sh-boxotexto-ico-o").click(function(){
		if(confirm("确认删除该地址吗?")){
			$(this).parent().parent().parent().parent().remove();
			var addId = $(this).parent().parent().parent().parent().attr("id");
			$.ajax({
				url : '../address/delAddress.do',
				data : {"addId":addId},
				type : 'POST',
				dataType : 'json'
			});
		}
	});
	
	//完成-并更新字段
	$("#complete").click(function(){
		var mid = $("#mdeId").val();
		
		$.ajax({
			url : '../address/completeAddress.do',
			data : {"addId":mid,"defStatus":"0"},
			type : 'POST',
			dataType : 'JSON',
			success : function(result){
				var goodsId = $("#goodsId").val();
				window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(goodsColor))+"&goodsNum="+goodsNum+"&goodsId="+goodsId;
			}
		});
	});
	
	//返回
	$("#backPage").click(function(){
		var goodsId = $("#goodsId").val();
		window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(goodsColor))+"&goodsNum="+goodsNum+"&goodsId="+goodsId;
	});
	
});