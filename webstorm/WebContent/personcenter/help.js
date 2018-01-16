function showAll(){
	$("#quelist").empty();
	$.post("../help/show.do",function(obj){
		if(obj && obj.list){
			$.each(obj.list,function(i,o){
				$("#quelist").append($("<li><a href='../person/answer.do?qd="+o.m_que_id+"'>"+o.m_que_title+"</a></li>"));
			});
		}
	},'json');
}

function check(){
	var regex=/^[0-9]{11}$/;
	if($.trim($("#neirong").val()).length==0){
		Message.showNotify("问题内容不可为空!",3000);
		return false;
	}else{
		var str= utf16toEntities($.trim($("#neirong").val()));
		if(str.length>255){
			Message.showNotify("字数不可以超过255个字!",3000);
			return false;
		}else{
			$("#neirong").val(str);
		}
	}
	if(!regex.test($.trim($("#phone").val()))){
		Message.showNotify("请输入正确的手机号码!",3000);
		return false;
	}
	return true;
}
$(function(){
	$("#tijiao").bind('click',function(){
		if(check()){
			alert("谢谢你的反馈,我们会及时处理,谢谢你!");
			$("form")[0].submit();
		}
	});
	showAll();
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
});

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