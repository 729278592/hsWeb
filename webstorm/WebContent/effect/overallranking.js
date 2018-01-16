$(function(){

	
	$.ajax({
		
		url : '../effect/effectOkami.do',
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(result){

			//当前用户影响力为零,则显示暂无排名
			if(result.myEffectVal == 0){
				$("#myRanking").html("暂无排名");
				$("#myRanking").css({"font-size":"25px"});
			}else{
				$("#myRanking").html(result.curRankingNum);
			}
			
			//影响力展示
			$("#myEffectId").html(result.myEffectVal);
			
			var showRanking = '';
			
			for(var i = 0;i < result.topSix.length;i ++){

				if(result.topSix[i].effect != 0){


					//算排行榜影响力百分率
					var showProHtml = '';
					var showbfl = 0;
					var bfl = 0;
					for(var j = 0;j < result.topSix.length;j ++){

						if(result.topSix[j].effect != 0){
							
							if(result.topSix[i].id != result.topSix[j].id){
								
								bfl += result.topSix[j].effect;
								
							}
						}
						
					}
					
					if(bfl != 0){
						
						showbfl = parseInt((result.topSix[i].effect / bfl) * 100);
						
						showbfl = showbfl >= 100 ? 100 : showbfl;
						
						showbfl = showbfl < 30 ? 30 : showbfl;
						
					}else{
						
						var proVal = result.topSix[i].effect * 100;
						showbfl = proVal >= 100 ? 100 : proVal;
						
					}
					
					
					//排名颜色
					var showLeColHtml = '';
					
					//第一名
					if(i == 0){
					
						showLeColHtml =	'<span style="color:#ff3131;">1</span>';
						
						showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #ff3131;">';
						
					}else if(i == 1){
						
						showLeColHtml =	'<span style="color:#f39800;">2</span>';
						
						showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #f39800;">';
						
					}else if(i == 2){
						
						showLeColHtml =	'<span style="color:#15a6ef;">3</span>';
						
						showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #15a6ef;">';
						
					}else{
						
						showLeColHtml =	'<span style="color:#868686;">'+(i + 1)+'</span>';
						
						showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #868686;">';
						
					}
					
					//获取头像信息
					var showHeadImgHtml = '';
					if(result.topSix[i].head_img.indexOf("http://") != -1 || result.topSix[i].head_img.indexOf("https://") != -1){
						showHeadImgHtml = '<img src="'+result.topSix[i].head_img+'">';
					}else{
						showHeadImgHtml = '<img src="../cashRanking/img.do?imgName='+result.topSix[i].head_img+'">';
					}
					
					//截取手机号码
					var showPhoneHtml = '';
					if(result.topSix[i].mobile != null && result.topSix[i].mobile.length == 11){
						//截取手机号码
						var newMobile = result.topSix[i].mobile.substring(0,3) + "****" + result.topSix[i].mobile.substring(7,11);
						showPhoneHtml = '<span class="phone">('+newMobile+')</span>';
					}else{
						showPhoneHtml = '<span class="phone"></span>';
					}
					
					showRanking += '<ul class="list">' +
										'<li class="grade">' +
//											'<span style="color:#ff3131;">1</span>' +
											 showLeColHtml +
										'</li>' +
										'<li class="photo">' +
//											'<img src="../cashRanking/img.do?imgName='+result.topSix[i].head_img+'">' + 
											 showHeadImgHtml + 
											'<div class="vip_box">' + 
												'<span>VIP'+result.topSix[i].level+'</span>' +
											'</div>' +
										'</li>' +
										'<li class="content">' +
											'<p><span class="uname">'+result.topSix[i].nickname+'</span>'+showPhoneHtml+'</p>' +
//											'<div class="progress" style="width:100%;background: #ff3131;">' +
											 showProHtml +
												'<span class="effectValue"><img src="../skins/effect/img/myeffect_icon_white.png" width="16px"><span>'+result.topSix[i].effect+'</span></span>' +
											'</div>' +
										'</li>' +
									'</ul>';
					
					
				}
				
			}
			$("section").html(showRanking);
			
		}
		
	});
	
	
	//跳转我得影响力
	$("#goToMyEffect").click(function(){
		window.location.href = "../effect/effect.do";
	});
	
});















