var reg = /^[1-9]{1}\d*$/;
var imgArr=new Array();
var imgid=0;
var tflag=0;
var orderStatus ;
$(function() {
	loadData();
	// 减
	$("#reduce").click(function() {
		reduce();
	});
	// 加
	$("#add").click(function() {
		add();
	});
	// 输入事件
	$("#count").bind('keyup', function() {
		var i = $("#count").val();
		if (i.match(reg) != null) {
			if (i < parseInt($("#showCount").val())) {
				$("#count").val(i);
			} else {
				$("#count").val($("#showCount").val());
			}
		} else {
			$("#count").val(1);
		}
	});

	// 切换样式
	$('.sales_type ul li').click(
			function() {
				$(this).addClass('current').siblings('.current').removeClass(
						'current');

				if (this.id == "refund") {
					$("#txt").text("在申请退货审核通过后7天内系统将货款原路返还。");

				} else {
					$("#txt").text("12332343");
				}
			});
	
	// 保存
	$('.sub').click(function() {
		if(tflag==0){
		  save();
		}else{
			/*$('#showhide').css("display", "block");
	     	$('#know').click(function() {
			$('#showhide').css("display", "none");
			
	     	});*/
			Message.showNotify("订单无法重复提交!",3000);
		}
	});
	//预览图片
	$("#camera").click(function(){
		$.each($("input[name='files']"),function(){
			if($(this).val()==""){
			   delImg1($(this).attr("id").substring(7));
			}
		});
		if($("input[name='files']").size()<6){
		var file_str="<input type=\"file\" name=\"files\" capture=\"camera\" accept=\"image/*\" id=\"camera_"+imgid+"\" style=\"display:none;\" onchange=\"preImg('camera_"+imgid+"','pic_"+imgid+"')\" />";
		var img_str="<img  class=\"file_img\" src=\"\" id=\"pic_"+imgid+"\" onclick=\"delImg("+imgid+")\" style=\"height: auto;margin-left: 1rem;width:25%;\" />";
		$("#showImg").append(file_str);	
		$("#camera_"+imgid).click();
		}else{
			Message.showNotify("最多只能上传6张图片!",3000);
		}
	});
	
	/*$("#camera_"+imgid).change(function(){
		preImg("camera_"+imgid,"pic_"+imgid);
	});*/
});

function loadData() {
	var str = "";
	id = location.search.substring(4);
	$.ajax({
		async : true,
		url : "../orderService/applyData.do",
		type : "post",
		dataType : "json",
		data : {
			id : id
		},
		success : function(d) {

			str += "<li class=\"share_box\">" + "<div class=\"share_top\">"
					+ "<div class=\"share_img\">"
					+ "<img src=\"../good/down.do?filename=" + d.oie.m_good_pic
					+ "\" alt=\"\">" + "</div>"
					+ "<div class=\"share_content\">" + "<p>"
					+ d.oie.m_good_name + "&nbsp;" + d.oie.m_good_no
					+ "&nbsp;(" + d.oie.m_color + ")</p>"
					+ "<span class=\"price\">￥" + d.oie.m_good_price
					+ "</span>" + "</div>" + "</div>" + "</li>";

			str += "<input type=\"hidden\" id=\"showCount\" value=\""
					+ d.oie.m_count + "\"/>";
			$("#goodInfo").append(str);
			$("#orderid").val(d.oie.m_id);
			$("#goodid").val(d.oie.m_good_id);
			orderStatus = d.oie.m_statu;
		}
	});
}

function save() {
	var flag=true;
    var arry=new Array();
    var temp="";
   
	if($(".current").length==0){
		flag=false;
		Message.showNotify("请选择售后类型!",3000);
	}
	
	if($.trim($("#desc").val())==""){
		Message.showNotify("请输入问题描述!",3000);
		flag=false;
		return ;
	}
	if($.trim($("#desc").val()).length>125){
		Message.showNotify("描述不能大于125个字!",3000);
		flag=false;
		var t = $("#desc").val();
		$("#desc").val(t.substring(0,125));
		return ;
	}else{
		var str= utf16toEntities($.trim($("#desc").val()));
		if(str.length>255){
			Message.showNotify("表情太多啦!",3000);
			flag=false;
			return;
		}else{
			$("#desc").val(str);
		}
	}
	 $.each($("input[name='files']"),function(){
			if($(this).val()==""){
			   delImg1($(this).attr("id").substring(7));
			}
	 });
	 
	 $.each($("input[name='files']"),function(da){
			arry.push($(this).attr("id"));
	 });
	//收货之前不上传图片	
	 if(arry.length==0&&(parseInt(orderStatus)>=3)){
			flag=false;
			Message.showNotify("请上传商品图片!",3000);
			flag=false;
			return;
	 }
	
	if(flag){
		tflag=1;
		if(parseInt(orderStatus)<3){
			$.ajaxFileUpload({
				 url:"../orderService/upload.do",  
				 async : false,
				 type:'post',  
				 fileElementId:arry,        
				 data:{},
				 dataType:'jsonp', 
				 success:function(data){ 
					 	data=data.replace(/<\/?.+?>/g,"").replace(/ /g,"");//去掉html标记
					 
					    //data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
						//data = data.replace('</PRE>', '');
						//data = data.replace('<pre>', '');
						//data = data.replace('</pre>', '');
					 	
						data = $.parseJSON(data);
							var temptype=1;
							if($(".current").attr("id")=="refund"){
								 temptype=1;
							}else{
								 temptype=2;
							}
							$.ajax({
								async : false,
								url : "../orderService/saveApply.do",
								type : "post",
								dataType : "json",
								data : {
									"os.m_order_id":$("#orderid").val(),
									"os.m_good_id":$("#goodid").val(),
									"os.m_count":$("#count").val(),
									"os.m_desc":$("#desc").val(),
									"os.m_type":temptype,
									"os.m_img":"",
									"os.m_statu":0,
									"os.m_result":0,
									"os.m_del":0,
									"maxcount":$("#showCount").val(),
								},
								success : function(d) {
									Message.showNotify("提交成功,请耐心等待并保持电话畅通!",3000);
									location.href="../orderService/page.do";
						            //$('#showhide').css("display", "block");
							     	$('#know').click(function() {
									$('#showhide').css("display", "none");
									location.href="../orderService/page.do";
								   });
								}
							});
				 },
				 error:function(response){
					 Message.showNotify("加载出错,请刷新页面!",3000);
				 }
		  	});
		}else{
			//文件上传
			$.ajaxFileUpload({
				 url:"../orderService/upload.do",   
				 type:'post',  
				 fileElementId:arry, 
				 async : false,
				 data:{},
				 dataType:'jsonp', 
				 success:function(data){
					 	data=data.replace(/<\/?.+?>/g,"").replace(/ /g,"");//去掉html标记
					 	
					    //data = data.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;\">', '');
						//data = data.replace('</PRE>', '');
						//data = data.replace('<pre>', '');
						//data = data.replace('</pre>', '');
					 	
						data = $.parseJSON(data);
						if(data.msg=="suc"){
							var temptype=1;
							if($(".current").attr("id")=="refund"){
								 temptype=1;
							}else{
								 temptype=2;
							}
							
							$.each(data.filesFileName,function(key,val){
								temp+=","+val;
							});
							temp=temp.substring(1);
							$.ajax({
								async : false,
								url : "../orderService/saveApply.do",
								type : "post",
								dataType : "json",
								data : {
									"os.m_order_id":$("#orderid").val(),
									"os.m_good_id":$("#goodid").val(),
									"os.m_count":$("#count").val(),
									"os.m_desc":$("#desc").val(),
									"os.m_type":temptype,
									"os.m_img":temp,
									"os.m_statu":0,
									"os.m_result":0,
									"os.m_del":0,
									"maxcount":$("#showCount").val(),
								},
								success : function(d) {
									Message.showNotify("提交成功,请耐心等待并保持电话畅通!",3000);
									location.href="../orderService/page.do";
						            //$('#showhide').css("display", "block");
							     	$('#know').click(function() {
									$('#showhide').css("display", "none");
									location.href="../orderService/page.do";
								   });
								}
							});
						}else if(data.msg=="1"){
							tflag=0;
							Message.showNotify("图片上传过大,请上传不要大于3MB的图片!",3000);
							return;
						}else{
							Message.showNotify("图片上传失败!",3000);
							return;
						}
				 },
				 error:function(response){
					 Message.showNotify("图片上传失败!",3000);
				 }
		  	});
		}
	}
}

function add() {
	var i = $("#count").val();
	if (i.match(reg) != null) {
		if (i < parseInt($("#showCount").val())) {
			$("#count").val(parseInt(i) + 1);
		}
	} else {
		$("#count").val(1);
	}
}

function reduce() {
	var i = $("#count").val();
	if (i == "1") {
		$("#count").val("1");
		return;
	}
	if (i.match(reg) != null) {
		$("#count").val(parseInt(i) - 1);
	} else {
		$("#count").val("1");
	}
}

function preImg(sourceId, targetId){
	 if (typeof FileReader === 'undefined') {    
	        Message.showNotify("Your browser does not support FileReader...",3000);
	        return;    
	    }    
	    var reader = new FileReader();    
	    var img_str="<img  class=\"file_img\" src=\"\" id=\"pic_"+imgid+"\" onclick=\"delImg("+imgid+")\" style=\"height: auto;margin-left: 1rem;width:25%;\" />";
	    $("#showImg").append(img_str);	
	    reader.onload = function(e) {    
	        var img = document.getElementById(targetId);    
	        img.src = this.result;    
	    };    
	    reader.readAsDataURL(document.getElementById(sourceId).files[0]);
        imgid++;
		
}

function delImg(id){
	
	Message.showConfirm("确定删除此图片?","确认","取消",function(){
	 	$("#pic_"+id).remove();
		$("#camera_"+id).remove();
	});
	
	/*if(confirm("确定删除此图片!")){
		$("#pic_"+id).remove();
		$("#camera_"+id).remove();
	}*/
}

function delImg1(id){
	$("#pic_"+id).remove();
	$("#camera_"+id).remove();
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