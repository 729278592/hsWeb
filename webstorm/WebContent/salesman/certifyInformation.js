var scs;
var shopNo;
var imgnum=0;
var act=1;
var bianji =false;//是否处于编辑状态 
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function getshop(){
	$.post("../shop/oneshop.do?shopNo="+shopNo,function(obj2){
		if(obj2 && obj2.shop){
			$("#shopname").html(obj2.shop.m_shopName);
			$("#shopbian").val(obj2.shop.m_shopBian);
		}
		$.post("../seller/getshare.do",function(obj){
			if(obj && obj.seller){
				$("#name").val(obj.seller.m_seller_name);
				$("#idno").val(obj.seller.m_seller_idNo);
				$("#phone").val(obj.seller.m_seller_phone);
				$("#yanzhengma").val(obj.yan);
				$("#touxiang").val(obj.seller.m_seller_pic);
				$("#shenfen").val(obj.seller.m_seller_idPic);
				$("#gongpai").val(obj.seller.m_seller_workcardPic);
				$("#shopbian").val(obj.seller.m_seller_shopBian);
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
	    		$("#userimg").attr("src",this.result);
	    	}else if(imgnum==2){
	    		$("#idimg").attr("src",this.result);
	    	}else{
	    		$("#workimg").attr("src",this.result);
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

var s=0;
function daojishi(){
	$("#leftnum").html(s);
	if(s>0){
		s--;
	}else{
		$("#timeshow").hide();
		$(".sub").show();
		return;
	}
	setTimeout("daojishi()", 1000);
}
function showAll(){
	$.post("../seller/sellerchecking.do",function(obj){
			scs=obj.scs;						
			$("#name").val(obj.seller.m_seller_name);
			$("#idno").val(obj.seller.m_seller_idNo);
			$("#phone").val(obj.seller.m_seller_phone);
			$("#shopname").html(obj.shop.m_shopName);
			$("#shopbian").val(obj.shop.m_shopBian);
			$("#userimg").attr("src","../seller/smallDown.do?filename="+obj.seller.m_seller_pic);
			$("#idimg").attr("src","../seller/smallDown.do?filename="+obj.seller.m_seller_idPic);
			$("#workimg").attr("src","../seller/smallDown.do?filename="+obj.seller.m_seller_workcardPic);
			$("#touxiang").val(obj.seller.m_seller_pic);
			$("#shenfen").val(obj.seller.m_seller_idPic);
			$("#gongpai").val(obj.seller.m_seller_workcardPic)
			if(shopNo!=null){
				bianji = true;
				$(".intext").removeAttr("readonly");
				$("#bon").hide();
				$("#tijiao").show();
				$(".code").show();
				$("#tochooseshop").click(function(){
					var name=$("#name").val();
			    	var idno=$("#idno").val();
			    	var phone=$("#phone").val();
			    	var shopBian=$("#shopbian").val();
			    	var yan=$("#yanzhengma").val();
			    	var tou=$("#touxiang").val();
			    	var shen=$("#shenfen").val();
			    	var gong=$("#gongpai").val();
			    	$.ajax({
						url : "../seller/share.do",
						type : "post",
						data :{"seller.m_seller_name":name,"seller.m_seller_idNo":idno,"seller.m_seller_phone":phone,"act":'1',"yan":yan,"seller.m_seller_pic":tou,"seller.m_seller_idPic":shen,"seller.m_seller_workcardPic":gong,"seller.m_seller_shopBian":shopBian},
						dataType : "json",
						success : function(data) {
							window.location="../seller/chooseshop.do?act=2";
						},error :function(){
							Message.showNotify("发生未知错误!",3000);
						}
					});
				});
				getshop();
			}
	},'json');
}
function gook(){
	var name=$("#name").val();
	var idno=$("#idno").val();
	var phone=$("#phone").val();
	var shopBian=$("#shopbian").val();
	var userimg=$("#touxiang").val();
	var idimg=$("#shenfen").val();
	var workimg=$("#gongpai").val();
	$.ajax({
		url : "../seller/recheck.do",
		type : "post",
		async : false,
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
}
$(function(){
	shopNo=GetQueryString("sd");
	
	showAll();
	
	$("#bon").click(function(){
		if(scs==0){
			//可编辑状态
			bianji = true;
			$(".intext").removeAttr("readonly");
			$("#bon").hide();
			$("#tijiao").show();
			$(".code").show();
			$("#tochooseshop").click(function(){
				var name=$("#name").val();
		    	var idno=$("#idno").val();
		    	var phone=$("#phone").val();
		    	var shopBian=$("#shopbian").val();
		    	var yan=$("#yanzhengma").val();
		    	var tou=$("#touxiang").val();
		    	var shen=$("#shenfen").val();
		    	var gong=$("#gongpai").val();
		    	$.ajax({
					url : "../seller/share.do",
					type : "post",
					data :{"seller.m_seller_name":name,"seller.m_seller_idNo":idno,"seller.m_seller_phone":phone,"act":'1',"yan":yan,"seller.m_seller_pic":tou,"seller.m_seller_idPic":shen,"seller.m_seller_workcardPic":gong,"seller.m_seller_shopBian":shopBian},
					dataType : "json",
					success : function(data) {
						window.location="../seller/chooseshop.do?act=2";
					},error :function(){
						Message.showNotify("发生未知错误!",3000);
					}
				});
			});
		}else{
			Message.showNotify("您目前的信息正在审核,请耐心等待!",3000);
		}
	});
	$("#tijiao").click(function(){
		$.ajaxSetup({  
		    async : false  
		});  
		var regex_phone=/^[0-9]{11}$/;
		var regex_idNo=/^[0-9,a-z,A-Z]{18}$/;
		var yan=$.trim($("#yanzhengma").val());
		var flag=false;
		if(yan.length==0){
			Message.showNotify("请输入验证码!",2000);
			flag= false;
		}else{
			var phone=$.trim($("#phone").val());
			var url="../seller/checkyan.do?phone="+phone+"&yan="+yan;
			$.get(url,function(data){
				var d=eval("("+data.data+")");
				if(d.code=="0"){
					flag= true;
				}else{
					Message.showNotify("验证码错误!",2000);
					flag= false;
				}
			},'json').error(function() { Message.showNotify("获取失败!",3000); });
		}
		if($.trim($("#name").val())==""){
			Message.showNotify("姓名不可为空!",3000);
			flag= false;
		}
		if(!regex_idNo.test($.trim($("#idno").val()))){
			Message.showNotify("身份证输入有误!",3000);
			flag= false;
		}
		if(!regex_phone.test($.trim($("#phone").val()))){
			Message.showNotify("手机号码输入有误!",3000);
			flag= false;
		}
		if($.trim($("#flag").val())=="0"){
			Message.showNotify("手机未验证!",3000);
			flag= false;
		}
		if($.trim($("#shopbian").val())==""){
			Message.showNotify("请选择门店!",3000);
			flag= false;
		}
		if(flag){
			showdiv();
			var arrays=new Array();
			arrays[0]="files1";
			arrays[1]="files2";
			arrays[2]="files3";
			var f="";
			if($.trim($("#files1").val())!="" && $.trim($("#files1").val())!=null){
				f+=1;
			}else{
				f+=0;
			}
			if($.trim($("#files2").val())!="" && $.trim($("#files2").val())!=null){
				f+=1;
			}else{
				f+=0;
			}
			if($.trim($("#files3").val())!="" && $.trim($("#files3").val())!=null){
				f+=1;
			}else{
				f+=0;
			}
			if(f!="000"){
				$.ajaxFileUpload({
					 url:"../seller/upload2.do",   
					 type:'post',  
					 async : false,
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
		 			    	
		 			    		if(f=="100"){
		 			    			$("#touxiang").val(data.img1);
		 			    		}else if(f=="010"){
		 			    			$("#shenfen").val(data.img1);
		 			    		}else if(f=="001"){
		 			    			$("#gongpai").val(data.img1);
		 			    		}else if(f=="110"){
		 			    			$("#touxiang").val(data.img1);
		 			    			$("#shenfen").val(data.img2);
		 			    		}else if(f=="101"){
		 			    			$("#touxiang").val(data.img1);
		 			    			$("#gongpai").val(data.img2);
		 			    		}else if(f=="011"){
		 			    			$("#shenfen").val(data.img1);
		 			    			$("#gongpai").val(data.img2);
		 			    		}else{
		 			    			$("#touxiang").val(data.img1);
			 			    		$("#shenfen").val(data.img2);
		 			    			$("#gongpai").val(data.img3);
		 			    		}
		 			   
		 			    	gook();
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
			
			}else{
				gook();
			}			
			
		}
		
	});
	$("#userimg").click(function(){
		//处于编辑状态才可以打开文件选择
		if(bianji){
			imgnum=1;
			$("#files1").click();
		}
	});
	$("#idimg").click(function(){
		//处于编辑状态才可以打开文件选择
		if(bianji){
			imgnum=2;
			$("#files2").click();
		}
	});
	$("#workimg").click(function(){
		//处于编辑状态才可以打开文件选择
		if(bianji){
			imgnum=3;
			$("#files3").click();
		}
	});
	$(".pic").change(function(){
		checkimg(this);
	});
	
	$(".sub").click(function(){
		var phone=$.trim($("#phone").val());
		var regex=/^[0-9]{11}$/;
		if(!regex.test(phone)){
			Message.showNotify("请输入正确的手机号码!",3000);
		}else{
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