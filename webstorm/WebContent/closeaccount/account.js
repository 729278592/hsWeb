function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//页面加载完成后执行
$(document).ready(function(){

	$("#compaySpan").hide();//隐藏
	
	var goodsColor = GetQueryString("goodsColor");//商品颜色
	var goodsNum = GetQueryString("goodsNum");//商品数量
	var goodsId = GetQueryString("goodsId");//商品主键
	
	var repeatFlag = true;//防重复点击,去支付
	
	goodsColor = decodeURI(goodsColor);
	
	//获取地址信息
	/*$.ajax({
		url : '../address/loadAddress.do',
		type : 'post',
		data : {"defStatus":"0"},
		async : false,
		dataType : 'json',
		success : function(result){
			var addInfoHtml = '';
			if(result != null && result.length >= 1){
				var newPhone = result[0].m_phone.substring(0,3) + "****" + result[0].m_phone.substring(7,11);
				addInfoHtml += '<li  class="ads">' +
			      				   '<p> <span>'+result[0].m_user_name+'</span>&nbsp;<span>'+newPhone+'</span></p>' +
			      				   '<p>'+result[0].m_address+'</p>' +
		      				   '</li>';
				$("#addressId").val(result[0].m_id);//赋值地址的主键
			}else{
				addInfoHtml += '<li class="left-ico"><a href="javascript:void(0);">' +
						      		'<img src="../skins/closeaccount/img/mapico.png"></a>' +
						       '</li>' +
						       '<li class="center-words"><a href="javascript:void(0);">添加收货地址</a></li>';
			}
			$(addInfoHtml).insertBefore(".right-ico");
		}
	});*/
	
	//获取地址信息
	var _address;
	function getAddress(){
		$.ajax({
			url : '../address/loadAddress.do',
			type : 'POST',
			dataType : 'JSON',
			async : false,
	       	success: function (d) {
	       		//alert('222');
	       		//d = JSON.parse(d);
	    	   //数据列表
	    	   var length = d.length;
	    	   var li='';
	    	   for(var i=0; i<length; i++){
	    		   //是否为默认地址
	    		   var j = d[i].m_default;
	    		   if(j==0){
	    			   $('#showMoreAdd').html('');
	    			   $('.center-words').attr('id','showList');
	    			   var _li = '<p><span class="user">'+d[i].m_user_name+'</span>&nbsp;<span class="phone">'+d[i].m_phone+'</span></p>'+'<p style="color: #999;" class="address">'+d[i].m_address+'</p>';
	    			   $('.center-words').html(_li);
	    			   _address=d[i];
	    		   }
	    	   }
	       	},
	       	error: function(e){
	       		console.log(e);
	       	}
		});
	}
	getAddress();
	//跳转到地址列表
	$(document).on('click','#showList',function(){
		window.location.href = '../address/addressList.html';
		
	})
	$.ajax({
		url : '../goodml/judgeGoodsOver.do',
		data : {"goodsId":goodsId},
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(result){
			var price = 0;
			if(result.m_good_price == null && "" == result.m_good_price){
				price = result.m_good_del_price;
			}else{
				price = result.m_good_price;
			}
			
			var gdHmtl = '';
			
			gdHmtl+= '<div class="share_img">' +   
			         	'<img src="../good/down.do?filename='+result.m_good_pic+'">' +
			         '</div>' +
			         '<div class="share_content">' +
			             '<p>'+result.m_good_name+'<br>('+goodsColor+')</p>' +
			             '<p class="price">￥'+price+' * '+goodsNum+'</p>' +
			         '</div>' ;
			
			$(".share_top").html(gdHmtl);
			
			var nPrice = accMul(price,goodsNum);//新价格乘以数量
			
			$("#newPrice").text("￥"+nPrice);
			
			$("#gmfx").text("￥"+result.m_good_buyBack);//购买返现
			$("#xf").text("￥"+result.m_freight);//运费
			
			nPrice = accAdd(nPrice,result.m_freight);
			
			$(".money > p").text("￥"+nPrice);
			
		}
	});

	
	
	//选择发票和送货时间 
	$(".fu-li a").click(function(){
		var type = $(this).children("span");
		
		if(type.attr("class") == "icon-chevron-thin-down"){
			type.attr("class","icon-chevron-thin-up");
			
			if(type.attr("id") == "fp"){
				$("#fpList").slideDown();
			}
			
			if(type.attr("id") == "sh"){
				$("#shList").slideDown();
			}
			
			$('section .sect3').addClass('mt');
			
		}else{
			type.attr("class","icon-chevron-thin-down");
			
			if(type.attr("id") == "fp"){
				$("#fpList").slideUp();
			}
			
			if(type.attr("id") == "sh"){
				$("#shList").slideUp();
			}
			
			$('section .sect3').removeClass('mt');
		}
		
	});
	

	//选择发票和送货时间
 $('.pull-list ul li').click(function(){
	 
    $(this).addClass('current').siblings('.current').removeClass('current');
    
    var typeName = $(this).parent().parent(".pull-list")[0].id;//获取上上级节点ID值
    
    var selText = $("#"+typeName+" li a ").eq($(this).index()).text();//用上上级节点ID值获取用户选着信息
    
    if(typeName == "fpList"){
		 $("#fpType").text(selText);
		 
		 if($(this).index() == 2){
			 $("#compaySpan").show();//显示
		 }else{
			 $("#compaySpan").hide();//隐藏
		 }
	 }else{
		 $("#shType").text(selText);
	 }
  }); 
 
 
 //去付款
 $(".paymoney").click(function(){
	 
	 if(repeatFlag){
		 repeatFlag = false;
		 
		//判断用户是否已选择收货地址
		 var addPhone = _address.m_phone;
		 var addUserName = _address.m_user_name;
		 var addDetails = _address.m_address;
		 var addPro = _address.m_province;
		 var addCity = _address.m_city;
		 var addCountry = _address.m_county;
		 
		 /*if(addPhone == null || addPhone == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }
		 
		 if(addUserName == null || addUserName == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }
		 
		 if(addDetails == null || addDetails == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }
		 
		 if(addPro == null || addPro == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }
		 
		 if(addCity == null || addCity == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }
		 
		 if(addCountry == null || addCountry == ""){
			 repeatFlag = true;
			 Message.showNotify("收货地址信息不完整!",3000);
			 return null;
		 }*/
		 if($('.sect1').find('#showList').length==0){
			 repeatFlag = true;
			 Message.showNotify("请填写收货地址!",1500);
			 return null;
		 }
		 
		 var fpTypes = $("#fpList .current").attr("data-value");//用户最终选择的发票类型
		 
		 var shTypes = $("#shList .current").attr("data-value");//用户最终选择的送货时间
		 
		 var compayTitle = '';
		 
		 //如果发票类型等于2
		 //就去获取用户填写的发票抬头内容
		 if(fpTypes == 3){
			 if($("#compayTitle").val()==null||$("#compayTitle").val()==""){
				 repeatFlag = true;
				 Message.showNotify("发票抬头不能为空!",3000);
				 return null;
			 }else if($("#compayTitle").val().length>125){
				 repeatFlag = true;
				 Message.showNotify("发票抬头内容不能超过125个字!",3000);
				 return null;
			 }else{
				 compayTitle = $("#compayTitle").val();
			 }
		 }
		 
		 //商品ID,颜色颜色,商品数量,发票类型,送货时间 段,发票抬头内容,收货人,手机号码,收货地址
//		 var data = {"goodsId":goodsId,"goodsColor":goodsColor,"buyNum":goodsNum,"invoice":fpTypes,"shTypes":shTypes,"compayTitle":compayTitle,"shrName":"张三丰","shrmobile":"18375787272","shAdd":"重庆市渝北区水星科技大厦星光二路"};
		 var data = {"goodsId":goodsId,"goodsColor":goodsColor,"buyNum":goodsNum,"invoice":fpTypes,"shTypes":shTypes,"compayTitle":compayTitle,"addPhone":addPhone,"addUserName":addUserName,"addDetails":addDetails,"addCountry":addCountry,"addPro":addPro,"addCity":addCity};
//		 var data = {"goodsId":goodsId,"goodsColor":goodsColor,"buyNum":goodsNum,"invoice":fpTypes,"shTypes":shTypes,"compayTitle":compayTitle,"addPhone":"18375787272","addUserName":"李四","addDetails":"ddd地","addCountry":"ABC地","addPro":"重庆市","addCity":"重庆市"};

		//可以进行购买
		//alert(JSON.stringify(data));
		$.ajax({
			url : '../order/addToOrder.do',
			async: false,
			data : data,
			type : 'POST',
			dataType : 'json',
			success : function(result){
				//等于
				if(result.msg == "2"){ 
					 if (result.msg && result.msg.packageStr) {
			                WeixinJSBridge.invoke('getBrandWCPayRequest',{
			                    "appId" : result.msg.appId,
			                    "timeStamp" : result.msg.timeStamp,
			                    "nonceStr" : result.msg.nonceStr,
			                    "package" : result.msg.packageStr,
			                    "signType" : result.msg.signType,
			                    "paySign" : result.msg.sign
			                },function(res) {
			                	//支付成功跳转到我的订单页面
			                    if (res.err_msg == "get_brand_wcpay_request:ok"){
			                    	window.location.href = " ../person/orderfollow.do?od=" + result.orderId;
			                    }else{
			                    	//取消支付去全部订单页面
			                    	if(res.err_msg == "get_brand_wcpay_request:cancel"){
			                    		window.location.href = "../person/orderlist.do?place=8";
			                    	}
			                    }
			                });
			            }
				}
				if(result.msg == "4"){
					Message.showNotify("创建订单成功，请稍后付款!",3000);
				}
				if(result.msg == "1"){
					Message.showNotify("支付成功!",3000);
				}
				
				if(result.msg == "0"){
					Message.showNotify("该商品已过期!",3000);
				}
				
				if(result.msg == "3"){
//					alert("已超限购数量!");
					Message.showNotify("商品数量不足!",3000);
				}
			}
		});
	 }
 });
 
 //加法
 function accAdd(arg1, arg2) {
	    var r1, r2, m, c;
	    try {
	        r1 = arg1.toString().split(".")[1].length;
	    }
	    catch (e) {
	        r1 = 0;
	    }
	    try {
	        r2 = arg2.toString().split(".")[1].length;
	    }
	    catch (e) {
	        r2 = 0;
	    }
	    c = Math.abs(r1 - r2);
	    m = Math.pow(10, Math.max(r1, r2));
	    if (c > 0) {
	        var cm = Math.pow(10, c);
	        if (r1 > r2) {
	            arg1 = Number(arg1.toString().replace(".", ""));
	            arg2 = Number(arg2.toString().replace(".", "")) * cm;
	        } else {
	            arg1 = Number(arg1.toString().replace(".", "")) * cm;
	            arg2 = Number(arg2.toString().replace(".", ""));
	        }
	    } else {
	        arg1 = Number(arg1.toString().replace(".", ""));
	        arg2 = Number(arg2.toString().replace(".", ""));
	    }
	    return (arg1 + arg2) / m;
	}
 

 //乘法
 function accMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
 
 
 //选择更多地址
 $("#showMoreAdd").click(function(){
	 	var aId = $("#addressId").val();
		//根据地址ID来判断是显示地址列表还是新增地址
	 	var gsc = encodeURI(encodeURI(goodsColor));
		if(aId != null && aId != ""){
			window.location.href = "../address/goToAddressPage.do?goodsId="+goodsId+"&gsc="+gsc+"&gsn="+goodsNum;
		}else{
			window.location.href = "../address/goToSaveAddress.do?showDefault=yes&goodsId="+goodsId+"&gsc="+gsc+"&gsn="+goodsNum;
		}
 });
 
 //选择更多地址
 /*
	wx.ready(function() {
		openAddr();
	});

	$.ajax({
		url : '../weixin/key.do',
		data :{"nowurl":window.location.href},
		type : 'POST',
		dataType : 'json',
		async : false,
		success :function(data){
			wx.config({
				debug: false,
				appId: hs_appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: ['checkJsApi', 'openAddress']
			});
		}
	}); */
	/*
	 $("#showMoreAdd").click(function(){
		 openAddr();
	 });*/
	//返回页面
		$("#backPage").click(function(){
			window.history.go(-1);
			return false;
		});

});


function openAddr(){
	wx.openAddress({
         success: function (res) {
             // 用户成功拉出地址
             //console.log("获取地址成功");
             if(res.errMsg == 'openAddress:ok'){
             	$(".ads").remove();
             	$(".left-ico").remove();
             	$(".center-words").remove();
             	
             	var newPhone = res.telNumber.substring(0,3) + "****" + res.telNumber.substring(7,11);
   				var addInfoHtml = "<li class='ads'><p><span>"+res.userName+"</span>&nbsp;<span>"+newPhone+"</span></p><p>"+res.provinceName+res.cityName+res.countryName+res.detailInfo+"</p></li>";
   				
   				$("#addPro").val(res.provinceName);//省份
   				$("#addCity").val(res.cityName);//城市
   				$("#addCountry").val(res.countryName);//县/区
   				$("#addDetails").val(res.detailInfo);//收货详细地址
   				$("#addUserName").val(res.userName);//收货人姓名
   				$("#addPhone").val(res.telNumber);//收货人手机号
   				$(addInfoHtml).insertBefore(".right-ico");
             }
         },error: function(err){
        	 alert(err);
         }
	 });
}




