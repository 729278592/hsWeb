function showmsg(){
	$.post("../mine/user.do",function(obj){
		if(obj && obj.user){
			if(obj.user.device_model!=null && obj.user.device_model!=""){
				$("#xinghao").val(obj.user.device_model);
			}
		}
	},'json');
}
$(function(){
	showmsg();
	$("#tijiao").click(function(){
		var xinghao=$("#xinghao").val();
		if($.trim(xinghao)==""){
			Message.showNotify("型号不可为空!",3000);
		}else{
			xinghao=encodeURI(encodeURI(xinghao));
			$.post("../user/change.do?act=5&user.device_model="+xinghao,function(){
				window.location="../person/personInformation.do";
			});
		}
	});
});