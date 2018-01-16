var regex=/^[0-9]{11}$/;
var msgFlag = true;
//add by zhangzhen
var needMerge = false;//是否需要合并账户
var PHONE_CHECK_CODE_SUCCESS = 0;          //未使用
var PHONE_CHECK_CODE_ERROR_NORMAL_USED = 1;   //被省事儿用户(手机)使用
var PHONE_CHECK_CODE_ERROR_WEIXIN_USED = 2;   //被省事儿用户(微信APP授权)使用
var PHONE_CHECK_CODE_ERROR_QQ_USED = 3;   //被省事儿用户（QQ）使用
var PHONE_CHECK_CODE_ERROR_SINAWEIBO_USED = 4;   //被省事儿用户（新浪微博）使用
var PHONE_CHECK_CODE_ERROR_WEIXIN_MP_USED = 5;   //被公众号用户使用
var PHONE_CHECK_CODE_ERROR_MERGE_TWO_SSR_USER = 99;   //不能合并俩个省事儿用户

function start(){
	$.post("../mine/user.do",function(obj){
		if(obj && obj.user){
			if(obj.user.mobile!=null && obj.user.mobile!=""){
				$("#phone").val(obj.user.mobile);
			}else{
				$("#msg").html("手机号码");
				$("#tijiao").val("绑定");
			}
		}
		$(".ch_phone").show();
	},'json');
}
var s=0;
function daojishi(){
	$("#leftnum").html(s);
	if(s>0){
		s--;
	}else{
		$("#timeshow").hide();
		$(".sub").show();
		msgFlag = true;
		return;
	}
	setTimeout("daojishi()", 1000);
}

function showLoading(){ 
	//$('#loading_img').html('<img src="../skins/effect/img/loading.gif" height="50%">'); 
	$("#showDiv").html("执行中，请稍后...");
	showmsg();
} 

function mergeOnSuccess(obj){
	
	hidemsg();
	
	if(obj){
		if(obj.code != "0"){
			$("#showDiv").html("系统忙，请稍后再试");
			showmsg();
			return;
		}
		alert("用户合并完毕，请重新登录，谢谢！");
		
		if(isWeiXin()){
			// WeixinJSBridge.call('closeWindow');
			WeixinJSBridge.invoke('closeWindow',{},function(res){
			    // alert(res.err_msg);
			});
		}
		else
		{
			window.close();
		}
	}
}

function mergeOnError() {
	$("#showDiv").html("系统忙，请稍后再试");
	showmsg();
	return;
}

$(function(){
	$(".ch_phone").hide();
	start();
	$("#showDiv").click(function(){
		hidemsg();
	});
	$("#bg").click(function(){
		hidemsg();
	});
	$("#tijiao").click(function(){
		var phone=$.trim($("#phone").val());
		if(!regex.test(phone)){
			$("#showDiv").html("请输正确的入手机号码");
			showmsg();
			return;
		}
		var pattern = /^[0-9a-zA-Z]*$/g ;
		var yan=$.trim($("#yanzhengma").val());
		if (pattern.test(yan)==false){
			$("#showDiv").html("验证码只能是数字和字母组成");
			showmsg();
		   return ;
		 }
		if(yan.length==0){
			$("#showDiv").html("请输入验证码");
			showmsg();
			return;
		}else{
			var phone=$.trim($("#phone").val());
			var	url="../seller/checkyan.do?phone="+phone+"&yan="+yan;
			$.get(url,function(data){
				var d=eval("("+data.data+")");
				if(d){
					if(d.code=="0"){
						
						//modify by zhangzhen: 
						if( needMerge ){
							var mergeUrl = "../userData/merge.do?mobile="+phone;
							
							$.ajax({ 
								type:"GET", 
								url:mergeUrl, 
								data:"name=wuxiaoyong", 
								beforeSend:showLoading,//执行ajax前执行loading函数.直到success 
								success:mergeOnSuccess, //成功时执行Response函数 
								error:mergeOnError
								});
						
//							$.get(mergeUrl,function(obj){
//								if(obj){
//									if(obj.code != "0"){
//										$("#showDiv").html("系统忙，请稍后再试");
//										showmsg();
//										return;
//									}
//									alert("用户合并完毕，请重新登录，谢谢！");
//									
//									if(isWeiXin()){
//										//WeixinJSBridge.call('closeWindow');
//										WeixinJSBridge.invoke('closeWindow',{},function(res){
//										    //alert(res.err_msg);
//										});
//									}
//									else
//									{
//										window.close();
//									}
//								}
//							},'json').error(function() {
//								$("#showDiv").html("系统忙，请稍后再试");
//								showmsg();
//								return;
//							});
//							//end get
						}
						//修改用户的手机号码
						else {
							$.post("../user/change.do?act=4&user.mobile="+phone,function(){
								window.location="../person/personInformation.do";
							});
						}

					}else{
						$("#showDiv").html("验证码错误");
						showmsg();
						return;
					}
				}else{
					$("#showDiv").html("发送失败");
					showmsg();
				}
				
			},'json').error(function() { 
				$("#showDiv").html("获取验证码失败");
				showmsg();
				return;
			});
		}
		
		
	});
	$(".sub").click(function(){
		
		needMerge = false;
		
		var phone=$.trim($("#phone").val());
		if(!regex.test(phone)){
			$("#showDiv").html("请输正确的入手机号码");
			showmsg();
			return;
		}else{
			$.post("../user/checkphone.do?phone="+phone,function(obj){
				//modify by zhangzhen start:
				//如果被省事儿用户使用，则合并用户--以省事儿用户为准
				if( PHONE_CHECK_CODE_SUCCESS < obj.msg && obj.msg < PHONE_CHECK_CODE_ERROR_WEIXIN_MP_USED){
					var userOption = confirm("您好！此手机号码已被省事儿账号绑定，继续此操作，系统会自动将两个账号的积分进行累加合并，硕粉大赚家账号合并之前的兑换记录将无法查看，\n\n您确定要继续使用此手机号码绑定吗？");
					if( !userOption )
					{
						return;
					}
					//需要合并用户
					needMerge = true;
				}
				//如果被其它关注公众号的用户绑定，这事不能合并，提示更换手机号码
				else if( obj.msg == PHONE_CHECK_CODE_ERROR_WEIXIN_MP_USED  || obj.msg == PHONE_CHECK_CODE_ERROR_MERGE_TWO_SSR_USER){
					$("#showDiv").html("该手机号码已经被第三方用户绑定，\n请使用其它手机号码!");
					showmsg();
					return;
				}
				//modify by zhangzhen end
				
				//if(obj.msg != 0){
				//	$("#showDiv").html("该手机号码已经注册");
				//	showmsg();
				//}
				//else{
				//	getVerifyCode(msgFlag)	
				//}

				getVerifyCode(msgFlag);
			},'json');
		}	
	});
	
});

function getVerifyCode(msgFlag) {
	if (msgFlag) {
		msgFlag = false;
		
		var phone=$.trim($("#phone").val());
		var url = "../seller/getyan.do?phone=" + phone;
		$.get(url, function(data) {
			var d = eval("(" + data.data + ")");
			if (d) {
				if (d.code == "0") {
					$(".sub").hide();
					$("#timeshow").show();
					s = 60;
					daojishi();
				} else {
					$("#showDiv").html("发送失败");
					showmsg();
					msgFlag = true;
				}
			} else {
				$("#showDiv").html("发送失败");
				showmsg();
				msgFlag = true;
			}
		}, 'json').error(function() {
			$("#showDiv").html("获取验证码失败");
			showmsg();
			msgFlag = true;
		});
	}
}

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

function showmsg(){
	$("#showDiv").show();
	$("#bg").show();
}
function hidemsg(){
	$("#showDiv").hide();
	$("#bg").hide();
}