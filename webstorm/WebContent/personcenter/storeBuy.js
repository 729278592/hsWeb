var ok =false; //盘顿是否成功
$(function(){
	$("#tijiao").click(function(){
		if($.trim($("#xulie").val())==""){
			Message.showNotify("请输入产品序列号!",3000);
		}else{
			var xulie=$.trim($("#xulie").val());
			$.post("../mine/lineofforder.do?xulie="+xulie,function(obj){
//				if(obj.msg=="no"){
//					$(".bg").show();
//					$("#show3").show();
//				}else if(obj.msg=="ok"){
//					$(".bg").show();
//					$("#show1").show();
//					ok = true;
//				}else if(obj.msg == 'repeat'){
//					$(".bg").show();
//					$("#show4").show();
//				}else{
//					$(".bg").show();
//					$("#show2").show();
//				}
				
				if(obj.code==0){
					$(".bg").show();
					$("#show1").show();
				}
				else {
					$(".bg").show();
					$("#error_msg").html(obj.msg);
					$("#show_error").show();
				 }
			},'json');
		}
	});
	$(".hides").click(function(){
		if(ok){
			$("#xulie").val("");
		}
		$(".bg").hide();
		$("#show1").hide();
		$("#show2").hide();
		$("#show3").hide();
		$("#show4").hide();
	});
	$("#saomiao").click(function(){
		$.ajaxSetup({  
		    async : false  
		});  
		var timestamp;
		var sign;
		var url="../weixin/key.do?nowurl="+window.location.href;	
		var appId;
		var signature;
		var nonceStr;
		var access_token;
		$.ajax({ //请求类型，这里为POST 
			type: 'POST', 
			url: url , 
			cache:true, 
			dataType:"json",
			ContentType: "application/json",
			success: function(data){ 
			d=eval("("+data.key+")");
			timestamp=data.timestamp;
			sign=data.sign;	
			signature=data.signature;
			nonceStr=data.nonceStr;
			appId=d.msg.appId;
			//access_token=d.msg.token.access_token;	
			},
			error:function(){
				alert("获取失败");
			}
		});
		wx.config({
		    debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: appId, // 必填，公众号的唯一标识
		    timestamp:timestamp , // 必填，生成签名的时间戳
		    nonceStr: nonceStr, // 必填，生成签名的随机串
		    signature: signature,// 必填，签名，见附录1
		    jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		wx.error(function(res){
			alert(res.errMsg);
		});
		wx.ready(function(){
			wx.scanQRCode({
			    desc: 'scanQRCode desc',
			    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ['qrCode','barCode'], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
				    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				    
				    var sn = result;
				    var codeArray = result.split(',');
				    if( codeArray.length > 1 )
				    {
				    	sn = codeArray[1];
				    }
				    
				    var reg= /^\d{15}$/;
				    //如果长度为15位，并且包含英文字符
				    if (sn.length == 15  &&  reg.test(sn)) 
				    {
				    	$("#xulie").val(sn);
				    }
				    else
				    {
				    	var userOption = confirm("扫码失败，重来一次？");
				    	if( userOption == true )
				    	{
				    		$("#saomiao").click();
				    	}
				    }
			    }
			});
		});
		
	});
});