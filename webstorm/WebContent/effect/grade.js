$(function(){
	
	$.ajax({
		url : '../user/loadUserLevel.do',
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(result){
			var headHtml = "";
			var src="" ;
			if(result.curUserInfo[0].substr(0,7)=="http://"){
					src=result.curUserInfo[0];
			}else{
				src="../user/rankingDown.do?filename="+result.curUserInfo[0];
			}
			var tempHtml = "距升级还差 "+(parseInt(result.curUserInfo[3])+1)+" 影响力";
			if(parseInt(result.curUserInfo[3])<1){
				tempHtml="你超出VIP"+result.curUserInfo[6]+" "+(parseInt(result.curUserInfo[3])*-1)+" 影响力";
			}
			//得到vip等级
			var _grade = result.curUserInfo[7];
			headHtml += '<div class="tx">' +
				            
				            	'<img src="'+src+'" >' +
				           
			            '</div>' +
			            '<div class="detail lf">' +
			               '<p id="uname">'+result.curUserInfo[1]+'</p>' +
			               '<p>' +
			                   '<span><b class="icon_white"></b>'+result.curUserInfo[2]+'</span>' +
			                   '<span class="effect">'+tempHtml+'</span>' +
			               '</p>' +
			               '<p class="pr">' +
			               '<progress class="pro" value="'+result.curUserInfo[2]+'" max="'+result.curUserInfo[5]+'"></progress>' +
			               '</p>' +
			               '<p class="vip">' +
			                   '<span>VIP'+result.curUserInfo[6]+'</span>' +
			                   '<span class="up">VIP'+result.curUserInfo[7]+'</span>' +
			               '</p>' +
			            '</div>' ;
			
			$(".upgrade").html(headHtml);//加载用户个人信息
			
			
			var vipListCode = "";
			var showCurLevel = "";
			for(var i = 0;i < result.listV.length;i ++){
				
				if(result.listV[i].id == result.curUserInfo[8]){
					showCurLevel = '<span class="current_level">当前等级</span>';
				}else{
					showCurLevel = '';
				}
				
				vipListCode += '<div class="box">' +
							        '<p class="power">' +
							            '<b class="vip1">VIP'+result.listV[i].m_vip+'<br></b><span>影响力<b class="icon"><br></b>'+result.listV[i].m_minvalue+'~'+result.listV[i].m_maxvalue+'</span>' +
							            showCurLevel +
							        '</p>' +
						        	'<div class="content">' +
							            '<div class="txt">' +
							                '<p>'+result.listV[i].m_content+'</p>' +
							            '</div>' +
						            '</div>' +
						        '</div>' ;
			}
			$(".big_box").html(vipListCode);
		}
	});
	
	
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
});