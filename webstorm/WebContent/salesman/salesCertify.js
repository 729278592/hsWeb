var shopNo;
var imgnum=0;
var act=1;
var sendFlag = true;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function getshop(){
	$.post("../shop/oneshop.do?shopNo="+shopNo,function(obj2){
		if(obj2 && obj2.shop){
			$("#shopName").html(obj2.shop.m_shopName);
			$("#shopBian").val(obj2.shop.m_shopBian);
		}
		$.post("../seller/getshare.do",function(obj){
			if(obj && obj.seller){
				$("#name").val(obj.seller.m_seller_name);
				$("#idno").val(obj.seller.m_seller_idNo);
				$("#phone").val(obj.seller.m_seller_phone);
				$("#yanzhengma").val(obj.yan);
			}
		},'json');
		
	},'json');
}
function preImg(sourceId){
	 if (typeof FileReader === 'undefined') {       
	        return;    
	    }    
	    var reader = new FileReader();    
	    
	    reader.onload = function(e) {
	    	if(imgnum==1){
	    		$("#userimgs").attr("src",this.result);
	    	}else if(imgnum==2){
	    		$("#idimgs").attr("src",this.result);
	    	}else{
	    		$("#workimgs").attr("src",this.result);
	    	}
	    };    
	    reader.readAsDataURL(document.getElementById(sourceId).files[0]);
}

function checkimg(th){
	var filePath=th.value;
	var i = filePath.lastIndexOf('.');
	var len = filePath.length;
	var str = filePath.substring(len,i+1);
	var extName = "JPG,GIF,PNG,JPEG,BMP";
	if(extName.indexOf(str.toUpperCase()) < 0){
		Message.showNotify("请选择正确的图片文件!",3000);
	}else{
		preImg("files"+imgnum);
	}
}

function check(){
	var regex_phone=/^[0-9]{11}$/;
	var regex_idNo=/^[0-9,a-z,A-Z]{18}$/;
	$.ajaxSetup({  
	    async : false  
	});  
	if(act==1){
		var yan=$.trim($("#yanzhengma").val());
		if(yan.length==0){
			Message.showNotify("请输入验证码!",3000);
			return false;
		}else{
			var phone=$.trim($("#phone").val());
			var	url="../seller/checkyan.do?phone="+phone+"&yan="+yan;
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
		if(!regex_idNo.test($.trim($("#idno").val()))){
			Message.showNotify("身份证输入有误!",3000);
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
		if($.trim($("#shopBian").val())==""){
			Message.showNotify("请选择门店!",3000);
			return false;
		}
		if($.trim($("#files1").val())==""){
			Message.showNotify("请上传您的半身照!",3000);
			return false;
		}
		if($.trim($("#files2").val())==""){
			Message.showNotify("请上传您的身份证正面照片!",3000);
			return false;
		}
		if($.trim($("#files3").val())==""){
			Message.showNotify("请上传您的工号牌!",3000);
			return false;
		}
		
	}
	return true;
}
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
	shopNo=GetQueryString("sd");
	if(shopNo!=null){
		getshop();
	}
	$("#tochooseshop").click(function(){
		var name=$("#name").val();
    	var idno=$("#idno").val();
    	var phone=$("#phone").val();
    	var shopBian=$("#shopBian").val();
    	var yan=$("#yanzhengma").val();
    	$.ajax({
			url : "../seller/share.do",
			type : "post",
			data :{"seller.m_seller_name":name,"seller.m_seller_idNo":idno,"seller.m_seller_phone":phone,"act":'1',"yan":yan},
			dataType : "json",
			success : function(data) {
				window.location="../seller/chooseshop.do?act=1";
			},error :function(){
				Message.showNotify("发生未知错误!",3000);
			}
		});
	});
	$("#userimgs").click(function(){
		imgnum=1;
		$("#files1").click();
	});
	$("#idimgs").click(function(){
		imgnum=2;
		$("#files2").click();
	});
	$("#workimgs").click(function(){
		imgnum=3;
		$("#files3").click();
	});
	$(".pic").change(function(){
		checkimg(this);
	});
	$(".back").click(function(){
    	history.go(-1);
    	return false;
    });
	$(".sub").click(function(){
		var phone=$.trim($("#phone").val());
		var regex=/^[0-9]{11}$/;
		if(!regex.test(phone)){
			Message.showNotify("请输入正确的手机号码!",3000);
		}else{
			//防止重复点击
			if(sendFlag){
				sendFlag = false;
				$.post("../seller/checkPhone.do?phone="+phone,function(objs){
					if(objs.msg=="1"){
						var url ="../seller/getyan.do?phone="+phone;
							$.get(url,function(data){
								var d=eval("("+data.data+")");
								if(d.code=="0"){
									$(".sub").hide();
									$("#timeshow").show();
									s=60;
									daojishi();
								}else{
									Message.showNotify("发送失败!",3000);
								}
							},'json').error(function() { Message.showNotify("获取失败!",3000); });
					}else{
						Message.showNotify("该手机号已经被注册!",3000);
					}
				},'json');
				
			}
		}
	});
	$("#tijiao").click(function(){
		if(check()){
			showdiv();
			var arrays=new Array();
			arrays[0]="files1";
			arrays[1]="files2";
			arrays[2]="files3";
			$.ajaxFileUpload({
				 url:"../seller/upload.do",   
				 type:'post',  
				 fileElementId:arrays,          
				 data:null,
				 dataType:'jsonp', 
				 success:function(data){
		  			data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
					data = data.replace('</PRE>', '');
					data = data.replace('<pre>', '');
					data = data.replace('</pre>', '');					
					data = $.parseJSON(data);	 			    
	 			    if(data.msg=="yes"){
	 			    	var name=$("#name").val();
	 			    	//过滤Emoji
	 			    	name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,"");
	 			    	var idno=$("#idno").val();
	 			    	var phone=$("#phone").val();
	 			    	var shopBian=$("#shopBian").val();
	 			    	var userimg=data.img1;
	 			    	var idimg=data.img2;
	 			    	var workimg=data.img3;
	 			    	$.ajax({
	 						url : "../seller/addseller.do",
	 						type : "post",
	 						data :{"sc.m_seller_name":name,"sc.m_seller_idNo":idno,"sc.m_seller_phone":phone,"sc.m_seller_shopBian":shopBian,"sc.m_seller_pic":userimg,"sc.m_seller_idPic":idimg,"sc.m_seller_workcardPic":workimg},
	 						dataType : "json",
	 						success : function(data) {
	 							closediv();
	 							window.location="../seller/wait.do";
	 						},error :function(){
	 							closediv();
	 							Message.showNotify("提交失败!",3000);
	 						}
	 					});
	 			    }else if(data.msg=="bigError"){
	 			    	 closediv();
						 Message.showNotify("上传的图片过大,图片大小不能超过3M!",3000);
						 callBackFun();
	 			    }else{
	 			    	closediv();
	 			    	Message.showNotify("图片上传失败1",3000);
	 			    }
				 },
				 error:function(response){
					 closediv();
					 Message.showNotify("图片上传失败2",3000);
					 callBackFun();
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