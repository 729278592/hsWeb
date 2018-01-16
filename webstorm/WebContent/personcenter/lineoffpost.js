function preImg(sourceId){
	 if (typeof FileReader === 'undefined') {       
	        return;    
	    }    
	    var reader = new FileReader();    
	    
	    reader.onload = function(e) {
	    	if(flag){
	    		$(".post_showimg").append($("<img src='"+this.result+"' width='30%' onclick='changeImg("+picnum+")' id='showimg"+shownum+"'/>"));
		    	picnum++;
	    	}else{
	    		$("#showimg"+shownum).attr("src",this.result);
	    	}
	    	
	    };    
	    reader.readAsDataURL(document.getElementById(sourceId).files[0]);
}
function changeImg(num){
	flag=false;
	shownum=num;
	$("#pic"+num).click();
}
$(function(){
	$("#chooseNiming").click(function(){
		if($("#chooseNiming").attr("src")=="../skins/personcenter/img/select_no.png"){
			$("#chooseNiming").attr("src","../skins/personcenter/img/select_yes.png");
			//$("#niming").val("匿名");
		}else{
			$("#chooseNiming").attr("src","../skins/personcenter/img/select_no.png");
			//$("#niming").val("本名");
		}
	});
});
var orderId;
var picnum=1;
var buyfrom="01";
var goodId;
var shownum=1;
var flag=true;
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId;
}
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
$(function(){
	$("#neirong").keyup(function(){
		if(this.value.length-125<=0){
			$(".you").html(this.value.length);
		}else{
			this.value=this.value.substring(0, 125);
			$(".you").html(125);
		}
	});
	$("#neirong").keydown(function(){
		if(this.value.length+1-125>0){
			this.value=this.value.substring(0, 125);
		}
	});
	$("#neirong").change(function(){
		if(this.value.length+1-125>0){
			this.value=this.value.substring(0, 125);
		}
	});
	$("#adds").click(function(){
		$(".picfile").remove();
		if(picnum>6){
			Message.showNotify("最多上传6张图片!",3000);
		}else{
			flag=true;
			shownum=picnum;
			$("#pic"+shownum).click();
		}
		
	});
	
});

function showAll(){
	
	$.post("../order/good.do?orderId="+orderId,function(obj2){
		if(obj2){
			if(obj2.good){
				$(".good_img").attr("src","../good/down.do?filename="+obj2.good.m_good_pic);
				$("#gooddes").html(obj2.good.m_good_name+obj2.good.m_good_no);
				$("#goodpsrice").html("￥"+obj2.good.m_good_price);
				goodId=obj2.good.m_good_id;
			}
			if(obj2.shop){
				$("#shopurl").attr("href","../goodml/shop.do?shopNo="+obj2.shop.m_shopNo+"&goodId=0");
				$("#shopimg").attr("src","../good/shopdown.do?filename="+obj2.shop.m_shopPic);
				$("#shopname").html(obj2.shop.m_shopName);
				$("#shopaddr").html("("+obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr+")");
			}
			if(obj2.seller){
				var src="";
				if(obj2.seller.m_seller_pic.substr(0,7)=="http://"){
					src=obj2.seller.m_seller_pic;
				}else{
//					old method 2016.09.18 wgd
//					src="../cashRanking/img.do?imgName="+obj2.seller.m_seller_pic;
					src="../seller/down.do?filename="+obj2.seller.m_seller_pic;
				}
				$("#sellerimg").attr("src",src);
				$("#smsseller").attr("href","sms:"+obj2.seller.m_seller_phone);
				$("#telseller").attr("href","tel:"+obj2.seller.m_seller_phone);
				$("#sellername").html(obj2.seller.m_seller_name);
				$("#tiyancount").html(obj2.ticount);
				$(".grade").html(obj2.seller.m_seller_grade);
				$("#sellerpage").attr("href","../seller/sellerinfo.do?sd="+obj2.seller.m_seller_id);
			}
			$("#oid").val(orderId);
			$("#buyFrom").val("01");
			
		}
	},'json');
		
}
function check(){
	
	var fenNum = $("#goodfen").val();
	if(fenNum == 0 || fenNum == "0"){
		Message.showNotify("请为该商品打星级!",3000);
		return false;
	}
	
	var shopfen = $("#shopfen").val();
	if(shopfen==0||shopfen=="0"){
		Message.showNotify("请为该门店打星级!",3000);
		return false;
	}
	
	var sellerfen =$("#sellerfen").val();
	if(sellerfen==0||sellerfen=="0"){
		Message.showNotify("请为该销售代表打星级!",3000);
		return false;
	}
	
	if($.trim($("#neirong").val()).length==0){
		Message.showNotify("评论内容不可为空!",3000);
		return false;
	}else{

		var str = utf16toEntities($.trim($("#neirong").val()));
		if (str.length > 255) {
			Message.showNotify("表情太多啦!", 3000);
			return false;
		} else {
			$("#neirong").val(str);
		}

		if (confirm("确认评论?")) {
			return true;
		} else {
			return false;
		}
		
	}
}
//图片格式验证
function checkFormat(th){
	var filePath=th.value;
	var i = filePath.lastIndexOf('.');
	var len = filePath.length;
	var str = filePath.substring(len,i+1);
	var extName = "JPG,GIF,PNG,JPEG,BMP";
	if(extName.indexOf(str.toUpperCase()) < 0){
		Message.showNotify("请选择正确的图片文件!",3000);
	}else{
		preImg("pic"+shownum);
	}
	
}
function getHeight(){
	if($(".goodimg").height()>$(".goodmsg").height()){
		$(".goodmsg").height($(".goodimg").height());
	}else{
		$(".goodimg").height($(".goodmsg").height());
	}
	if($(".shopmsg_left").height()>$(".shopmsg_right").height()){
		$(".shopmsg_right").height($(".shopmsg_left").height());
	}else{
		$(".shopmsg_left").height($(".shopmsg_right").height());
	}
	setTimeout("getHeight()", 100);
}
function tijiao(){
	if(check()){
		showdiv();
		var array=new Array();
		array[0]="pic1";
		array[1]="pic2";
		array[2]="pic3";
		array[3]="pic4";
		array[4]="pic5";
		array[5]="pic6";
		
		var p1="";
    	var p2="";
    	var p3="";
    	var p4="";
    	var p5="";
    	var p6="";
    	var orderIds=$("#oid").val();
    	var buyFroms=$("#buyFrom").val();
    	var goodfens=$("#goodfen").val();
    	var shopfens=$("#shopfen").val();
    	var sellerfens=$("#sellerfen").val();
    	var neirongs=$("#neirong").val();
    	var posters="";
    	
    	var sval = $("#chooseNiming").attr("src");
    	
    	sval = sval.substring(sval.lastIndexOf("/") + 1);
    	
    	if(sval == "select_no.png"){
    		posters = "本名";
    	}else{
    		posters = "匿名";
    	}
		
		if($.trim($("#pic1").val())!="" && $.trim($("#pic1").val())!=null){
			
			$.ajaxFileUpload({
				 url:"../post/upload.do",   
				 type:'post',  
				 fileElementId:array,          
				 data:null,
				 dataType:'jsonp', 
				 success:function(data){
		  			data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
					data = data.replace('</PRE>', '');
					data = data.replace('<pre>', '');
					data = data.replace('</pre>', '');					
					data = $.parseJSON(data);
					 if(data.msg=="bigError"){
	 			    	closediv();
	 			    	Message.showNotify("图片上传过大,图片不能大于3MB!",3000);
	 			    }
//				    if(data.msg=="yes"){
				    	//获取IMG图片名称来判断是否被选中
				    	var length=data.list.length;
				    	if(length>=1){
				    		p1=data.list[0];
				    		if(length>=2){
				    			p2=data.list[1];
				    			if(length>=3){
				    				p3=data.list[2];
				    				if(length>=4){
				    					p4=data.list[3];
				    					if(length>=5){
				    						p5=data.list[4];
				    						if(length>=6){
				    							p6=data.list[5];
				    						}
				    					}
				    				}
				    			}
				    		}
				    	}
				    	$.ajax({
							url : "../post/add.do",
							type : "post",
							data :{"orderId":orderIds,"buyFrom":buyFroms,"goodfen":goodfens,"shopfen":shopfens,"sellerfen":sellerfens,"post.m_mp_text":neirongs,"poster":posters,"post.m_mp_pic1":p1,"post.m_mp_pic2":p2,"post.m_mp_pic3":p3,"post.m_mp_pic4":p4,"post.m_mp_pic5":p5,"post.m_mp_pic6":p6},
							dataType : "json",
							success : function(data) {
								closediv();
//								alert("    评论成功    ");
								Message.showNotify("    评论成功    ",3000);
								window.location="../person/orderlist.do?place=3";
							},error :function(){
								closediv();
								Message.showNotify("提交失败!",3000);
							}
						});
				    /*}else{
				    	closediv();
				    	alert('图片上传失败1');
				    }*/
				 },
				 error:function(response){
					 closediv();
					 Message.showNotify("数据出错,请重新加载!",3000);
				 }
		  	});
			
		} else {
			
			$.ajax({
				url : "../post/add.do",
				type : "post",
				data :{"orderId":orderIds,"buyFrom":buyFroms,"goodfen":goodfens,"shopfen":shopfens,"sellerfen":sellerfens,"post.m_mp_text":neirongs,"poster":posters,"post.m_mp_pic1":p1,"post.m_mp_pic2":p2,"post.m_mp_pic3":p3,"post.m_mp_pic4":p4,"post.m_mp_pic5":p5,"post.m_mp_pic6":p6},
				dataType : "json",
				success : function(data) {
					closediv();
//					alert("    评论成功    ");
					Message.showNotify("    评论成功    ",3000);
					window.location="../person/orderlist.do?place=3";
				},error :function(){
					closediv();
					Message.showNotify("提交失败!",3000);
				}
			});
		}
		
	}
	 closediv();
}
$(function(){
	orderId=GetQueryString("od");
	showAll();
	$(".good_img").click(function(){
		showgood(goodId);
	});
	$(".file").change(function(){
		checkFormat(this);
	});
	$("#bon").click(function(){
		tijiao();
	});
	$("#list-m").click(function(){
		$(".menu-list").toggle();
	});
	$("#zhoubian").click(function(){
		window.location="../goodml/shopmap.do";
	});
	$("#firstpage").click(function(){
		window.location="../goodml/firstpage.do";
	});
	$("#wanzhuan").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
	$("#mine").click(function() {
		window.location = "../goodml/mine.do";
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
/** 
 * 用于把用utf16编码的字符转换成实体字符，以供后台存储 
 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 
 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 
 */  
function utf16toEntities(str) {  
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    str = str.replace(patt, function(char){  
            var H, L, code;  
            if (char.length===2) {  
                H = char.charCodeAt(0); // 取出高位  
                L = char.charCodeAt(1); // 取出低位  
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
                return "&#" + code + ";";  
            } else {  
                return char;  
            }  
        });  
    return str;  
} 
