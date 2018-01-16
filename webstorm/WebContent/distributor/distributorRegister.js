
//发送验证码标志位
var sendFlag = true;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
 
//校验数据是否正确
function check(){
	var regex_phone=/^[0-9]{11}$/;
	var regex_idNo=/^[0-9,a-z,A-Z]{18}$/;
	$.ajaxSetup({  
	    async : false  
	});  

		var yan=$.trim($("#verifyCode").val());
		if(yan.length==0){
			Message.showNotify("请输入验证码!",3000);
			return false;
		}else{
			var phone=$.trim($("#phone").val());
			var	url="../distributor/checkVerifyCode.do?enterpriseAdmin.mobile="+phone+"&enterpriseAdmin.verifyCode="+yan;
			var flag=false;
			$.get(url,function(data){
				var d=eval("("+data.data+")");
				if(d.code=="0"){
					flag=true;
				}else{
					Message.showNotify("验证码错误!",3000);
					flage= false;
				}
			},'json').error(function() { Message.showNotify("获取失败!",3000); });
			if(!flag){
				return false;
			}
		}
		if($.trim($("#name").val())==""){
			Message.showNotify("姓名不可为空!",3000);
			return false;
		}
	 
		if(!regex_phone.test($.trim($("#phone").val()))){
			Message.showNotify("手机号码输入有误!",3000);
			return false;
		}
		if($.trim($("#flag").val())=="0"){
			Message.showNotify("手机未验证!",3000);
			return false;
		}
	return true;
}

//验证码倒计时
var s=0;
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

$(function(){
 
	$(".back").click(function(){
    	history.go(-1);
    	return false;
    });
	
	//获取手机验证码
	$(".sub").click(function(){
		var phone=$.trim($("#phone").val());
		var regex=/^[0-9]{11}$/;
		if(!regex.test(phone)){
			Message.showNotify("请输入正确的手机号码!",3000);
		}else{
			//防止重复点击
			if(sendFlag){
				sendFlag = false;
				
				//检查电话号码是否存在
				$.post("../distributor/checkPhone.do?enterpriseAdmin.mobile="+phone,function(objs){
					if(objs.msg == 0){
						
						$.ajax({
							url : "../distributor/getVerifyCode.do",
							type : "post",
							data :{"enterpriseAdmin.mobile":phone},
							dataType : "json",
							success : function(data) {
								var d=eval("("+data.data+")");
								if(d.code=="0"){
									$(".sub").hide();
									$("#timeshow").show();
									s=60;
									daojishi();
								}else{
									Message.showNotify("发送失败!",3000);
								}
							},error :function(){
								Message.showNotify("获取失败!",3000);
							}
						});
						
					}else{
						Message.showNotify("该手机号已经被注册!",3000);
					}
				},'json');
			}
			sendFlag = true;
		}
	});
	 
	//提交注册信息
	$("#tijiao").click(function(){
		if(check()){
			showdiv();
 
			var name =$("#name").val();  
			//过滤Emoji
			name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,"");
			var phone=$("#phone").val(); 
			var verifyCode = $("#verifyCode").val(); 
 
			//新增促销员
			$.ajax({
				url : "../distributor/add.do",
				type : "post",
				data :{"enterpriseAdmin.name":name,"enterpriseAdmin.mobile":phone},
				dataType : "json",
				success : function(data) {
					closediv();
					window.location="../distributor/wait.do";
				},error :function(){
					closediv();
					Message.showNotify("提交失败!",3000);
				}
			}); 
		}
	});
});
function showdiv(){
	$("#bg").show();
	$("#show1").show();
}
function closediv(){
	$("#bg").hide();
	$("#show1").hide();
}