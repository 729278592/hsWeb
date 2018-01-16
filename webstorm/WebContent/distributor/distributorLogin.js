var reg=/^[0-9]{11}$/;
var s=0;
var isClick =false;
var sendFlag = true;

var PHONE_CHECK_OK = 0;
var PHONE_NOT_EXIST = 1;//未注册
var PHONE_WAIT_AUDIT = 2;//待审核
var PHONE_AUDIT_REJECT = 3;//审核未通过

function getYan(){
	var phone=$("#phone").val();
	if(!reg.test($.trim(phone))){
		$("#showDiv").html("请输入正确的手机号码");
		showmsg();
	}else{
		if(sendFlag){
			isClick = true;
			sendFlag = false;
			 var  url ="../distributor/checkLoginMobile.do?enterpriseAdmin.mobile="+phone;
			$.get(url,function(obj){ 
				if(obj.code == PHONE_NOT_EXIST){
					$("#showDiv").html("您的手机号码未注册");
					showmsg();
				}else if(obj.code == PHONE_WAIT_AUDIT){
					$("#showDiv").html("您的手机号码未审批，请耐心等待");
					showmsg();
				}else if(obj.code == PHONE_AUDIT_REJECT){
					$("#showDiv").html("您的手机号码审批未通过，请重新申请");
					showmsg();
				}else if(obj.code == PHONE_CHECK_OK){
					$(".sub").hide();
					$("#timeshow").show();
					s=60;
					daojishi();
				}else{
					$("#showDiv").html("验证码发送失败");
					showmsg();
				}
			},'json').error(function() { alert("获取失败"); });
			
		}
		sendFlag = true;
	}
}
function daojishi(){
	$("#leftnum").html(s);
	if(s>0){
		s--;
	}else{
		sendFlag = true;
		$("#timeshow").hide();
		$(".sub").show();
		return;
	}
	setTimeout("daojishi()", 1000);
}
function check(){
	if(!isClick){
		$("#showDiv").html("你还没有获取验证码");
		showmsg();
		return ;
	}
	var phone=$("#phone").val();
	var yan=$("#yan").val();	
	if($.trim(phone).length<1){
		$("#showDiv").html("手机号码不能为空");
		showmsg();
		return ;
	}
	if(!reg.test($.trim(phone))){
		$("#showDiv").html("请输入正确的手机号码");
		showmsg();
		return;
	}
	if($.trim(yan).length<1){
		$("#showDiv").html("验证码不能为空");
		showmsg();
		return ;
	}
	var pattern = /^[0-9a-zA-Z]*$/g ;
	if (pattern.test(yan)==false){
		$("#showDiv").html("验证码只能是数字和字母组成");
		showmsg();
	   return ;
	 }
	
	//检查验证码
	var	url="../distributor/checkVerifyCode.do?enterpriseAdmin.mobile="+phone+"&enterpriseAdmin.verifyCode="+yan
	$.get(url,function(data){
		var d=eval("("+data.data+")");
		if(d){
			if(d.code=="0"){
				$.post("../distributor/userLogin.do?enterpriseAdmin.mobile="+phone,function(loginResult){
					
					if(loginResult.code == PHONE_NOT_EXIST){
						$("#showDiv").html("您的手机号码未注册");
						showmsg();
					}else if(loginResult.code == PHONE_WAIT_AUDIT){
						$("#showDiv").html("您的手机号码未审批，请耐心等待");
						showmsg();
					}else if(loginResult.code == PHONE_AUDIT_REJECT){
						$("#showDiv").html("您的手机号码审批未通过，请重新申请");
						showmsg();
					}else if(loginResult.code == PHONE_CHECK_OK){
						window.location="../distributor/index.do";
					}else{
						$("#showDiv").html("手机号码状态异常");
						showmsg();
					}
				});			
			}else{
				$("#showDiv").html("验证码错误");
				showmsg();
			}
		}else{
			$("#showDiv").html("验证验证码失败");
			showmsg();
		}
	},'json').error(function() { 
		$("#showDiv").html("返回数据出错");
		showmsg();
		return;
	});
}
function showmsg(){
	$("#showDiv").show();
	$("#bg").show();
}
function hidemsg(){
	$("#showDiv").hide();
	$("#bg").hide();
}
function zhuce(){
	$.post("../distributor/checkRegistState.do",function(obj){
		if(obj){
			if(obj.stus== 1 && obj.stus2== 2){				
				window.location="../distributor/distributorRegister.do";		
			}else{
				$("#showDiv").html("您已经注册过了，请等待审核或者直接登录");
				showmsg();
			}
		}
	},'json');
}
$(function(){
	$("#yanbon1").click(function(){
		getYan();
	});
	$("#showDiv").click(function(){
		hidemsg();
	});
	$("#bg").click(function(){
		hidemsg();
	});
	$("#tijiao").click(function(){
		check();
	});
	$("#zhuce").click(function(){
		zhuce();
	});
});