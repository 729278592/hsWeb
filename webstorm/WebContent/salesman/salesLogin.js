var reg=/^[0-9]{11}$/;
var s=0;
var isClick =false;
var sendFlag = true;
function getYan(){
	var phone=$("#phone").val();
	if(!reg.test($.trim(phone))){
		$("#showDiv").html("请输入正确的手机号码");
		showmsg();
	}else{
		if(sendFlag){
			isClick = true;
			sendFlag = false;
			 var  url ="../seller/logins.do?phone="+phone+"&act=0";
			$.get(url,function(obj){
				var d=eval("("+obj.data+")");
				if(obj.has=="0"){
					$("#showDiv").html("您的手机号码未注册或者未通过审核");
					showmsg();
				}else{
					if(d.code=="0"){
						$(".sub").hide();
						$("#timeshow").show();
						s=60;
						daojishi();
					}else{
						$("#showDiv").html("验证码发送失败");
						showmsg();
					}
					
				}
			},'json').error(function() { alert("获取失败"); });
			
		}
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
	var	url="../seller/logins.do?phone="+phone+"&yan="+yan;
	$.get(url,function(data){
		var d=eval("("+data.data+")");
		if(d){
			if(d.code=="0"){
				$.post("../seller/changelogin.do?phone="+phone,function(){
					window.location="../seller/index.do";
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
	$.post("../seller/userseller.do",function(obj){
		if(obj){
			if(obj.stus=="0" && obj.stus2=="0"){				
				window.location="../seller/zhuce.do";		
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