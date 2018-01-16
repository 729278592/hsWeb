function showmsg(){
	$.post("../mine/user.do",function(obj){
		if(obj && obj.user){
			if(obj.user.nickname!=null && obj.user.nickname!=""){
				$("#name").val(obj.user.nickname);
			}else{
				$("#name").val("赚客");
			}
		}
	},'json');
}
$(function(){
	showmsg();
	$("#tijiao").click(function(){
		var name=$("#name").val();
		if($.trim(name)==""){
			Message.showNotify("昵称不可为空!",3000);
		}else if($.trim(name).length>32){
			Message.showNotify("昵称过长了哦,最多32个字!",3000);
			return;
		}else{
			
			//过滤Emoji
		   // name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,"");
			var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");  
		      if(pat.test(name)==true) {   
		    	  Message.showNotify("昵称中含有非法字符",3000);
		      } else{
		    	  name=encodeURI(encodeURI(name));
					$.post("../user/change.do?act=2&user.nickname="+name,function(text,status){
						if(status == 'success'){
							alert('保存成功');
						}
						window.location="../person/personInformation.do";
					});
		      }
			
		}
	});
});