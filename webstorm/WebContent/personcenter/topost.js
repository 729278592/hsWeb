var orderId;
var picnum=1;
var buyfrom;
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
$(function(){
	$("#neirong").keyup(function(){
		if(this.value.length-15<=0){
			$(".left").html(15-this.value.length);
			$(".you").html(this.value.length);
		}else{
			this.value=this.value.substring(0, 15);
			$(".left").html(0);
			$(".you").html(15);
		}
	});
	$("#neirong").keydown(function(){
		if(this.value.length+1-15>0){
			this.value=this.value.substring(0, 15);
		}
	});
	$("#neirong").change(function(){
		if(this.value.length+1-15>0){
			this.value=this.value.substring(0, 15);
		}
	});
	$(".photo_leftdiv").click(function(){
		$(".picfile").remove();
		if(picnum>3){
			Message.showNotify("最多上传3张图片!",3000);
		}else{
			$("#upPic").append($("<input class='picfile' type='file' hidden='true'  name='files' id='postpic"+picnum+"'  onchange='checkFormat(this)'/>"));
			$("#postpic"+picnum).click();
		}
		
	});
	$(".foot_right").click(function(){
		
		Message.showConfirm("确认评价?","确认","取消",function(){
			var postText=$("#neirong").val();
			var pic1=$("#pic1").val();
			var pic2=$("#pic2").val();
			var pic3=$("#pic3").val();
			var goodfen=$("#goodfen").val();
			var shopfen=$("#shopfen").val();
			var sellerfen=$("#sellerfen").val();
			var poster;
			if($("#niming").is(':checked')){
				poster="匿名";
			}else{
				poster="本名";
			}
			$.ajax({
				url : "../post/add.do",
				type : "post",
				data :{"orderId":orderId,"buyFrom":buyfrom,"post.m_mp_text":postText,"post.m_mp_pic1":pic1,"post.m_mp_pic2":pic2,"post.m_mp_pic3":pic3,"goodfen":goodfen,"shopfen":shopfen,"sellerfen":sellerfen,"poster":poster},
				dataType : "json",
				success : function(data) {
					alert(data.msg);
					window.location="../person/postlist.do";
				},error :function(){
					Message.showNotify("评论失败!",3000);
				}
			});
		});
		
		/*if(confirm("确认评价?")){
			var postText=$("#neirong").val();
			var pic1=$("#pic1").val();
			var pic2=$("#pic2").val();
			var pic3=$("#pic3").val();
			var goodfen=$("#goodfen").val();
			var shopfen=$("#shopfen").val();
			var sellerfen=$("#sellerfen").val();
			var poster;
			if($("#niming").is(':checked')){
				poster="匿名";
			}else{
				poster="本名";
			}
			$.ajax({
				url : "../post/add.do",
				type : "post",
				data :{"orderId":orderId,"buyFrom":buyfrom,"post.m_mp_text":postText,"post.m_mp_pic1":pic1,"post.m_mp_pic2":pic2,"post.m_mp_pic3":pic3,"goodfen":goodfen,"shopfen":shopfen,"sellerfen":sellerfen,"poster":poster},
				dataType : "json",
				success : function(data) {
					alert(data.msg);
					window.location="../person/postlist.do";
				},error :function(){
					Message.showNotify("评论失败!",3000);
				}
			});
		}*/
	});
});

function showAll(){
	$.post("../order/order.do?orderId="+orderId,function(obj){
		if(obj){
			if(obj.order.m_onlineOff=="00"){
				$(".shoppost").hide();
				$(".sellerpost").hide();
				buyfrom="00";
			}else{
				buyfrom="01";
			}
			$.post("../order/good.do?orderId="+orderId,function(obj2){
				if(obj2){
					$(".goodimg").attr("src","../good/down.do?filename="+obj2.good.m_good_pic);
				}
			},'json');
			
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
		alert("请选择正确的图片文件!");
		
	}else{
		$.ajaxFileUpload({
			 url:"../post/upload.do",   
			 type:'post',  
			 fileElementId:'postpic'+picnum,          
			 data:null,
			 dataType:'jsonp', 
			 success:function(data){
	  			data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
				data = data.replace('</PRE>', '');
				data = data.replace('<pre>', '');
				data = data.replace('</pre>', '');
				
				data = $.parseJSON(data);
 			    
 			    if(data.msg=="yes"){
 			    	$(".pic").append($("<img src='../post/down.do?filename="+data.msg+"' width='33%'/>"));
 			    	$("#pic"+picnum).val(data.msg);
 			    	picnum++;	
 			    }
 			    if(data.msg=="bigError"){
 			    	alert('图片上传过大，图片不能大于3MB！');
 					callBackFun();
 			    }
			 },
			 error:function(response){
				 alert('图片上传失败');
				 callBackFun();
			 }
	  	});
	

		
	}
	
}
$(function(){
	orderId=GetQueryString("od");
	showAll();
});