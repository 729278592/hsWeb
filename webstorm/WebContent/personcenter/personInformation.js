function showAll(){
	$.post("../mine/user.do",function(obj){
		if(obj && obj.user){
			if(obj.user.head_img!=null && obj.user.head_img!=""){
				if(obj.user.head_img.substr(0,7)=="http://"){
					$("#userimg img").attr("src",obj.user.head_img);
				}else{
					$("#userimg img").attr("src","../cashRanking/img.do?imgName="+obj.user.head_img);
				}
			}
			if(obj.user.nickname!=null && obj.user.nickname!=""){
				$("#nickname").html(obj.user.nickname);
			}else{
				$("#nickname").html("赚客");
			}
			if(obj.user.gender==1){
				$("#gender").html("男");
				$("#boy").attr("checked","checked");
			}else if(obj.user.gender==2){
				$("#gender").html("女");
				$("#girl").attr("checked","checked");
			}
			if(obj.user.device_model!=null && obj.user.device_model!=""){
				$("#phonetype").html(obj.user.device_model);
			}
			if(obj.user.mobile!=null && obj.user.mobile!=""){
				$("#phone").html(obj.user.mobile);
			}else{
				$("#phone").html("您还未绑定手机");
			}
			
		}
	},'json');
}
//图片格式验证
function checkFormat(th){
	var filePath=th.value;
	var i = filePath.lastIndexOf('.');
	var len = filePath.length;
	var str = filePath.substring(len,i+1);
	var extName = "JPG,GIF,PNG,JPEG,BMP";
	if(extName.indexOf(str.toUpperCase()) < 0){
		th.remove();
		Message.showNotify("请选择正确的图片文件!",3000);
		
	}else{
		$.ajaxFileUpload({
			 url:"../user/upload.do",   
			 type:'post',  
			 fileElementId:'img_head',          
			 data:null,
			 dataType:'jsonp', 
			 success:function(data){
	  			data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
				data = data.replace('</PRE>', '');
				data = data.replace('<pre>', '');
				data = data.replace('</pre>', '');
				
				data = $.parseJSON(data);
 			    
 			    /*if(data.msg!="上传失败"){
 			    	location.reload();
 			    }*/
				
				if(data.msg == "0"){
					alert("上传失败!");
			    	location.reload();
			    }
				
				if(data.msg == "1"){
					Message.showNotify("上传图片过大,请选择小于1M的图片!",3000);
			    }
				
				if(data.msg == "2"){
					location.reload();
			    }
 			    
			 },
			 error:function(response){
				 alert("图片上传失败!");
				 callBackFun();
			 }
	  	});
	}
}

$(function(){
	showAll();
	$("#sex").click(function(){
		$(".bg").show();
		$(".sex").show();
	});

	$(".sex ul li,.bg").click(function(){
		$(".bg").hide();
		$(".sex").hide();
	});
	$(".xingbie").click(function(){
		var sex=this.value;
		$.post("../user/change.do?act=3&user.gender="+this.value,function(){
			if(sex=="1"){
				$("#gender").html("男");
			}else if(sex=="2"){
				$("#gender").html("女");
			}
		});
	});
	$("#userimg").click(function(){
		 window.location.href="../user/changeImg.do"; 
	});
	$("#img_head").change(function(){
		checkFormat(this);
	});
});