function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


var uid;
//经纬度
var latNum = 0;
var lngNum = 0;

$(function(){
	
	$.post("http://" + hs_url + "/mxj/goodml/getUidFromOperator.do",function(obj){
		uid = obj;
	});
	
	//begin更多商品排序
	
	var indexFlag = GetQueryString("indexFlag");
	var backShowFlag = GetQueryString("backShowFlag");
	
	//end  更多商品排序
	
	
	var ljgmFlag = "";//该变量用于判断线下线上颜色值

	var goodsId = GetQueryString("goodsId");//商品主键
	var affterColor = GetQueryString("gc");//选择之后的颜色
	var affterNum = GetQueryString("gn");//选择之后的商品数量
	
	//获取得地址
	var shopName = GetQueryString("shopName");
	var proName = GetQueryString("proName");
	var cityName = GetQueryString("cityName");
	
	if(shopName != null && shopName != "null"){
		
		shopName = decodeURI(shopName);
		proName = decodeURI(proName);
		cityName = decodeURI(cityName);
		$.ajax({
			url : '../goodml/queryShopMsg.do',
			data : {"proName":proName,"cityName":cityName,"areaName":shopName,"goodsId":goodsId},
			type :'POST',
			dataType : 'json',
			async : false, 
			success : function(result){
				
				//有货
				if(result.code == 'success'){
					$(".address").text(result.message);
				}else{
					$(".address").text(result.message);
					$(".time").text(result.objs);
					
					ljgmFlag = "change";
					
				}
				
//				$(".address").text(result.message);
//				$(".time").text(result.objs);
			}
		});
		
	}else{
		proName = "北京市";
		cityName = "北京市";
		shopName = "海淀区";
		$.ajax({
			url : '../goodml/queryShopMsg.do',
			data : {"proName":proName,"cityName":cityName,"areaName":shopName,"goodsId":goodsId},
			type :'POST',
			dataType : 'json',
			async : false, 
			success : function(result){
				//有货
				if(result.code == 'success'){
					$(".address").text(result.message);
				}else{
					$(".address").text(result.message);
					$(".time").text(result.objs);
					
					ljgmFlag = "change";
					
				}
				
			}
		});
		
	}
	
	
	var bq = "";//公共使用标签
	var specFlag = true;//规格参数标签判断
	var bzFlag = true;//包装售后标签判断
	var sHtml = '';//服务项定义为全局
	
	 //页面加载完成后执行
	 $(".server-rt .icon-chevron-thin-down").click(function(){
		
		 var flagText = $(".server-rt a span");
		 if(flagText.attr("class") == "icon-chevron-thin-down"){
			 flagText.attr("class","icon-chevron-thin-up");
			 $(".servermsg2").css("display","none");
			 $(".replay-server").css("margin-top","0px");
			 $("#descMore").show();
		 }else{
			 flagText.attr("class","icon-chevron-thin-down");
			 $("#descMore").hide();
			 $(".servermsg2").html(sHtml).css("display","block");
		 }
		 $(".replay-server").slideToggle();
	 });
	
	 
		
	 $ ('.tab-content').children ('div:gt(0)').hide();
     $ ('.tab_tittle ul li').click (function (){
         $(this).addClass('current').siblings('.current').removeClass('current');
         $('div .tab-content').children ('div:eq(' + $ (this).index () + ')').show().siblings('div').hide();

         
         //判断只加载一次
         if($(this).index () == 1 && specFlag){
        	 specFlag = false;
        	 $.ajax({
        		url :'../goodml/loadSpecParam.do',
        		data : {"goodsId":goodsId,"selType":"00"},
        		dataType : 'json',
        		type : 'post',
        		success :function(result){
    				var specHtml = '';
        			var temp=true;
        			for(var i = 0;i < result.length;i ++){
        				if(temp){
        					specHtml += '<p class="con_txt" style="color:#000;">'+result[i][1]+'</p><ul>';		        
        					temp = false;
        				 }
        					specHtml += '<li>' +
						            		'<span>'+result[i][2]+'</span>' +
						            		'<div>'+result[i][3]+'</div>' +
				            		    '</li>';

        					if (i >= 0 && i <= result.length - 1) {
        						
        						if(result.length > (i+1)){
        							if(result[i][0] != result[i+1][0]){
            							specHtml += "</ul>";
            							temp= true;
            						}
        						}else{
        							specHtml += "</ul>";
        							temp= true;
        						}
        						
        					}
        			}
        			$("#spec").html(specHtml);
        		}
        	 });
         };
         if($(this).index() == 2 && bzFlag){
        	 bzFlag = false;
        	 
        	 $.ajax({
         		url :'../goodml/loadSpecParam.do',
         		data : {"goodsId":goodsId,"selType":"01"},
         		dataType : 'json',
         		type : 'post',
         		success :function(result){
     				var bzHtml = '';
     				
     				for(var i = 0;i < result.length;i ++){
     					bzHtml += '<div class="service">' +
	     		    				'<h3>'+result[i][2]+'</h3>' +
	     		    				'<div>'+result[i][3]+'</div>' +
	     		    			  '</div>';
     				}
     				$("#bz").html(bzHtml);
         		}
         	 });
        	 
         }
         
     });
	 $("#showHide").click(function(){
         var type = $(this).children("span");

         if(type.attr("class") != "icon-chevron-thin-down"){
        	 
           $('.bottom_box').css("display","none");
           type.attr("class","icon-chevron-thin-down");
           $("#content1").html(bq);
           
         }else{
             type.attr("class","icon-chevron-thin-up");
             $('.bottom_box').css("display","block");
             $('.bottom_box .midll-div ul li a').css({"margin-left":"0px"});
             var txt=$("<p>可享受以下促销</p>");
             $("#content1>a").remove();
             $("#content1").html(txt);
             $('p').css({"color":"#505050","font-size":"1.4em","padding-left":"3%","line-height":"2rem"});
         }

       });
	$.ajax({
		url : '../goodml/loadGoodsInfo.do?uid='+uid,
		type : 'POST',
		data : {"goodsId":goodsId,"type":"good"},
		dataType : 'json',
		async : false,
		success : function(result){
			
			var showUserSelInfo = result.gcDefault+"1件";
			
			if(affterColor != null && affterNum != null){
				affterColor = decodeURI(affterColor);//解码
				showUserSelInfo = affterColor + affterNum + "件";
			}
			
			$("#gcNum").text(showUserSelInfo);//已选行
			
			//--------------------------begin往表单赋值----------------------
			$("#gdColor").val(affterColor != null ? affterColor : result.gcDefault);//商品颜色
			$("#gdNum").val(affterNum != null ? affterNum : "1");//商品数量
			$("#gsId").val(goodsId);//商品主键
			//--------------------------end往表单赋值----------------------
			
			var headImg = '';
			var imgLists = result.gameGood[5].split(",");
			
			for(var hi = 0;hi < imgLists.length;hi ++){
				//顶上图片
				headImg += '<li class="swiper-slide"><a href="javascript:void(0);"><img src="../good/down.do?filename='+imgLists[hi]+'"></a></li>';
			}
			
			
			$("#headImg").html(headImg);
			
			
			//商品名称
			$("#headTitle").text(result.gameGood[1]);
			//商品描述

			var msgDesc = '';
			
			if(result.gameGood[8] != null && result.gameGood[8].length > 55){
				msgDesc = result.gameGood[8].substring(0,55)+"...";
			}else{
				msgDesc = result.gameGood[8];
			}
			
			$("#describe").text(msgDesc);
			if($("#describe").html()==null || $("#describe").html()==""){
				$("#describe").css("padding","0px");
			}
			$("#describe").click(function(){
				$("#describe").text(" "+result.gameGood[8]);
			});
			//商品新价格
			$("#newPrice").append(result.gameGood[2]);
			//商品旧价格
			var oldPrice = result.gameGood[7];
			if(oldPrice != null && oldPrice != ""){
				$("#oldPrice").text("￥"+oldPrice);
			};
			
			
			//标签--根据状态来判断
			if(result.gameGood[6] == "线上" || result.gameGood[6] == "都有"){
				bq += '<a href="javascript:void(0);">' +
					 	'<div class="play">购买返现'+result.gameGood[3]+'元</div>' +
					 '</a>' +
					 '<a href="javascript:void(0);">' +
					 	'<div class="ring">推荐最高奖励'+result.gameGood[4]+'元</div>' + 
					 '</a>' ;
			}
			
			if(result.gameGood[6] == "线下" || result.gameGood[6] == "都有"){
				bq += '<a href="javascript:void(0);">' +
					 	'<div class="play">到店试玩</div>' +
					 '</a>' +
					 '<a href="javascript:void(0);">' +
					 	'<div class="ring">返积分</div>' + 
					 '</a>' ;
			}
			
			$("#content1").html(bq);
			
			//标签说明
			var bqHelp = "";
			if(result.gameGood[6] == "线上"){
				bqHelp += '<div class="midll-div midll_bottom midll_border">'+
							'<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="play">购买返现'+result.gameGood[3]+'元</div>' +
					        	'</a>' +
					        	'<span>没文字描述</span>' +
					        '</li>' +
					        '<li class="midll-rt">' +
					        	'<a href="javascript:void(0);" id="showHide">' +
					        		'<span class="icon-chevron-thin-right"></span>' +
					        	'</a>' +
					        '</li>' +
					      '</ul>' +
					      '</div>' +
					      '<div class="midll-div midll_bottom">' +
					      '<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="ring" style="margin-left:0px;">推荐最高奖励'+result.gameGood[4]+'元</div>' +
					        	'</a>' +
					       		'<span>没文字描述</span>' +
					        '</li>' +
					        '<li class="midll-rt"><a href="javascript:void(0);" id="showHide"><span class="icon-chevron-thin-right"></span></a></li>' +
					      '</ul>' +
					    '</div>' ;
			}else if(result.gameGood[6] == "线下"){
				bqHelp += '<div class="midll-div midll_bottom midll_border">'+
							'<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="play">到店试玩</div>' +
					        	'</a>' +
					        	'<span>可获得附近的门店预约真机试玩</span>' +
					        '</li>' +
					      '</ul>' +
					      '</div>' +
					      '<div class="midll-div midll_bottom">' +
					      '<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="ring">返积分</div>' +
					        	'</a>' +
					       		'<span>购买此产品可获得'+result.gameGood[10]+'积分</span>' +
					        '</li>' +
					      '</ul>' +
					    '</div>' ;
			}else{
				bqHelp += '<div class="midll-div midll_bottom midll_border">'+
							'<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="play">到店试玩</div>' +
					        	'</a>' +
					        	'<span>可获得附近的门店预约真机试玩</span>' +
					        '</li>' +
					      '</ul>' +
					      '</div>' +
					      '<div class="midll-div midll_bottom">' +
					      '<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="ring">返积分</div>' +
					        	'</a>' +
					       		'<span>购买此产品可获得'+result.gameGood[10]+'积分</span>' +
					        '</li>' +
					      '</ul>' +
					    '</div>' +
					    
					    '<div class="midll-div midll_bottom midll_border">'+
							'<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="play">到店试玩</div>' +
					        	'</a>' +
					        	'<span>可获得附近的门店预约真机试玩</span>' +
					        '</li>' +
					      '</ul>' +
					      '</div>' +
					      '<div class="midll-div midll_bottom">' +
					      '<ul>' +
					        '<li class="midll-cr">' +
					        	'<a href="javascript:void(0);">' +
					        		'<div class="ring">返积分</div>' +
					        	'</a>' +
					       		'<span>购买此产品可获得'+result.gameGood[10]+'积分</span>' +
					        '</li>' +
					      '</ul>' +
					    '</div>' ;
			}
			$("#downContent").html(bqHelp);
			
			//商品售后服务项
			var sdHtml = '';
			for(var i = 0;i < result.listCs.length;i ++){
				sHtml += '<img src="../good/serviceDown.do?filename='+result.listCs[i].m_logo+'">&nbsp;'+result.listCs[i].m_title+"&nbsp;&nbsp;&nbsp;";
				
				sdHtml += '<li><img src="../good/serviceDown.do?filename='+result.listCs[i].m_logo+'">'+result.listCs[i].m_title+'</li>' +
	            '<p>'+result.listCs[i].m_desc+'</p>';
			}
			
			$(".servermsg2").html(sHtml);
			$("#descMore").html(sdHtml);
			
			//评论内容
			var postHtml = "";
			
			var sliderArray = new Array(result.postObjs.length);
			for(var i = 0;i < result.postObjs.length;i ++){
			
				var postImgHmle = "";
				
				sliderArray[i] = 'slider' + i;
				
				if(result.postObjs[i][6] != null && result.postObjs[i][6] != ""){
					postImgHmle +='<li style="display:block"><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][6]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][6]+'"></a></li>';
				}
				if(result.postObjs[i][7] != null && result.postObjs[i][7] != ""){
					postImgHmle += '<li><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][7]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][7]+'"></a></li>';
				}
				
				if(result.postObjs[i][8] != null && result.postObjs[i][8] != ""){
					postImgHmle += '<li><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][8]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][8]+'"></a></li>';
				}
				
				if(result.postObjs[i][9] != null && result.postObjs[i][9] != ""){
					postImgHmle += '<li id="more_'+i+'" class="list4 ig"><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][9]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][9]+'"></a></li>';
				}
				
				if(result.postObjs[i][10] != null && result.postObjs[i][10] != ""){
					postImgHmle += '<li><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][10]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][10]+'"></a></li>';
				}
				
				if(result.postObjs[i][11] != null && result.postObjs[i][11] != ""){
					postImgHmle += '<li><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][11]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][11]+'"></a></li>';
				}
				var src="";
				if(result.postObjs[i][0].substr(0,7)=="http://"){
					src=result.postObjs[i][0];
				}else{
					src="../user/down.do?filename="+result.postObjs[i][0];
				}
				postHtml += '<div class="list1">' +
		          				'<div class="number1">' +
		          					'<div class="profile_images">' +
		          						'<img src="'+src+'" width="95%">'+
		          					'</div>' +
		          					'<div class="uname">' + 
						            '<p>'+result.postObjs[i][1]+'</p>' +
						            '<span>VIP'+result.postObjs[i][2]+'</span>' +
						          '</div>' + 
						          '</div>' +
						          '<div class="number2">' +
						            '<p>'+result.postObjs[i][3]+'</p>' +
						          '</div>' +
						          
						          '<div class="img_shows">'+'<div class="wrapper">'+
						          '<div class="block">'+
						          	'<ul class="thumns" id="slider'+i+'" style="width:100%">' +
						          		postImgHmle +
						          	'</ul>' +
						          	'</div>' +
						          	'<div id="inline-content" style="display:none;">'+
						          		'<div style="background:#fff; width:100%; height:100%; float:left; padding:10px;"></div>'+
						          	'</div>' +
						          '</div>' +
						          '</div>' +
						          '<div class="number3">' +
						            '<span>颜色：'+result.postObjs[i][4]+'</span>' +
						            '<span class="date">'+result.postObjs[i][5]+'</span>' +
						          '</div>' +
						     '</div>';
				
			}
			
			$(".evaluatelist").html(postHtml);
			
			//评论图片
			var imgList = $(".list1");
			for(var imgj = 0;imgj < imgList.length;imgj ++){
				
				var imgli = $("#slider"+imgj+" li").length;
				
				if(imgli > 4){
					
					
					$("#more_"+imgj).append('<div class="mask"></div><p class="listp">更多图片</p>');
					
					for(var imgi = 4;imgi < imgli;imgi ++){
						
						$("#slider"+imgj+" li")[imgi].hidden = true;
						
					}
					
					$('.listp').click(function(){
						$(this).parent().siblings().css("display","block");
						$(this).parent().removeClass("ig");
						$(this).parent().children("div").remove();
						$(this).parent().children("p").remove();
						
					});
				}
				
			}
			
			//好评率
			var hpl = "";
			    hpl += '<li class="appraise">评价</li>' + 
		               '<li class="rate">好评率'+result.postCount[0]+'%</li>' +
		               '<li class="people">'+result.postCount[1]+'人评价</li>' +
		               '<li class="topdiv-rt">' +
		               		'<a href="../goodml/goToGoodsPost.do?goodsId='+goodsId+'"><span class="icon-chevron-thin-right"></span></a>' +
		               '</li>';
			    
			$(".topdiv ul").html(hpl);
			
			//商品介绍
			var imgListH = result.listil;
			var imgHtml = "";
			for(var i = 0;i < imgListH.length;i ++){
				if(imgListH[i].m_image_type == 'commodity'){
					imgHtml += '<li><img src="../good/goodsDetailsDown.do?filename='+imgListH[i].m_image_name+'" width="99%"></li>';
				}
			}
			$("#imgList").html(imgHtml);
			
			//是否显示已收藏的标志
			/*if(result.collFlag){
				$('#sc a img').attr("src","../skins/goodmainline/img/wujiaoxing.png");
				
			}
			*/
			if(result.gameGood[6] == "线下"){
				if(ljgmFlag == "change"){
					$(".floor ul").append('<li class="play-foot" id="ddsw"><a href="javascript:void(0);">到店试玩</a></li><li class="buy-foot-change" id="ljgm"><a href="javascript:void(0);">立即购买</a></li>');
				}else{
					$(".floor ul").append('<li class="play-foot" id="ddsw"><a href="javascript:void(0);">到店试玩</a></li><li class="buy-foot" id="ljgm"><a href="javascript:void(0);">立即购买</a></li>');
				}
			}else{
				if(ljgmFlag == "change"){
					$(".floor ul").append('<li class="buy-foot-no-change" id="ljgm"><a href="javascript:void(0);">立即购买</a></li>');
				}else{
					$(".floor ul").append('<li class="buy-foot-no" id="ljgm"><a href="javascript:void(0);">立即购买</a></li>');
				}
			}
			
			loadSwiper();
			
			//加载数据分享数据
			loadWxShare();
			
		}
	});
	
	
	
	
	//门店入口类型
	var shopNo = GetQueryString("shopNo");
	
	var data = "";
	//等于null,则非门店入口
	if(shopNo == null){
		data = {"shopNo":0,"latNum":latNum,"lngNum":lngNum};
	}else{
		data = {"shopNo":shopNo};
	}
	
	//加载专属销售代表begin
	//2016.09.08后面添加得调整功能
	$.ajax({
		
		url : '../goodml/showSeller.do',
		type : 'post',
		data : data,
		dataType : 'json',
		async : false,
		success : function(result){
			
			if(result.code == 'success'){
				
				loadSellerInfo(result);
				
			}else if(result.code == 'fail'){
				
				//非门店入口,如无专属销售代表就走这个方法
				mypoint();
				
			}else{
				//默认销售代表都不存在就不显示该信息和样式
				$(".salesman").hide();
			}
		}
	});
	
	//加载专属销售代表end
	
	
	
	
	//返回上一页
	$("#backPage").click(function(){
//		window.location.href = GetQueryString("goToUrl")+"&openId="+GetQueryString("openId");
		if(indexFlag == null){
			window.history.go(-1);
			return false;
		}else{
			if(indexFlag == 0){
				window.location.href = "../goodml/goodsofall.do?indexFlag="+indexFlag+"&backShowFlag="+backShowFlag;
			}else{
				window.location.href = "../goodml/goodsofall.do?indexFlag="+indexFlag;
			}
		}
	});
	
	//选择颜色
	$("#selColor").click(function(){
		//modify by zhangzhen:去掉无用的get参数
		var url = "../goodml/goToSelectColor.do?goodsId="+goodsId+"&uid="+ uid;
		if(affterColor != null && affterNum != null){
			url += "&gc="+encodeURI(encodeURI(affterColor))+"&gn="+affterNum ;
		}
		
		url += "&proName="+encodeURI(encodeURI(proName))+"&cityName="+encodeURI(encodeURI(cityName))+"&shopName="+encodeURI(encodeURI(shopName));
		
//		url  += "&goToUrl="+GetQueryString("goToUrl");
		
		window.location.href = url; 
	});
	
	//选择地址
	$("#selAdd").click(function(){
		//modify by zhangzhen:去掉无用的get参数
		var goToAddUrl = "../seller/proCityArea.do?goodsId="+goodsId+"&uid="+uid;
		
		if(affterColor != null && affterColor != "null"){
			goToAddUrl += "&affterColor="+encodeURI(encodeURI(affterColor));
		}
		
		if(affterNum != null && affterNum != "null"){
			goToAddUrl += "&gn="+affterNum;
		}
		
		window.location.href = goToAddUrl;
	});
	
	//收藏
	$("#sc").click(function(){
		$.ajax({
			url :'../shoucang/addGoodsColl.do',
			data :{"id":goodsId,"type":"good"},
			async : false,
			type : 'POST',
			dataType :'json',
			success : function(result){
				if(result.message == 'success'){
					//收藏
					$('#sc a img').attr("src","../skins/personcenter/img/star1orange.png");
					$('#sc a h3').text('已收藏');
				}else{
					$('#sc a img').attr("src","../skins/personcenter/img/star2null.png");
					$('#sc a h3').text('收藏');
				}
			}
		});
	});
		
	//返回顶部
	$("#backtoTop").click(function(){
		$('body,html').animate({scrollTop:0},500);
        return false;
	});
	

	//点击DIV进行隐藏
	$("#uscan").click(function(){
		showHieDiv();
	});

	function showHieDiv(){
		var divStatus = document.getElementById("showScan");
		
		if(divStatus.style.display == "none"){
			divStatus.style.display = "block";
		}else{
			divStatus.style.display = "none";
		}
	}
	
	//显示二维码之后在点击进行关闭
	$("#showScan").click(function(){
		showHieDiv();
	});
	
	//立即购买
	$("#ljgm").click(function(){
		$.ajax({
			url : '../goodml/queryShopMsg.do',
			data : {"proName":proName,"cityName":cityName,"areaName":shopName,"goodsId":goodsId},
			type : 'post',
			dataType : 'json',
			async : false,
			success : function(result){
				if(result.code == 'success'){
					//跳转结算页面
					var gdColor = $("#gdColor").val();//商品颜色
					var gdNum = $("#gdNum").val();//商品数量
					var gsId = $("#gsId").val();//商品主键
					window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(gdColor))+"&goodsNum="+gdNum+"&goodsId="+gsId;
//					var buyUrl = encodeURIComponent("http://"+hs_url+"/mxj/account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(gdColor))+"&goodsNum="+gdNum+"&goodsId="+gsId);
					//alert(buyUrl);
//					var redrectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + hs_appId + "&redirect_uri="+buyUrl+"&response_type=code&scope=snsapi_base#wechat_redirect";
					//alert(redrectUrl);
//					window.location.href = redrectUrl;
					
				}else{
					alert(result.objs);
				}
			}
		});
	});
	
	//到店试玩
	$("#ddsw").click(function(){
		window.location.href = "../goodml/shopmapno.do?gd="+goodsId;
	});
	
	//显示分享
	/*$("#showDownInfo").click(function(){
		var divobjs = document.getElementById("showDownInfo");
		
		if(divobjs.style.display == "none"){
			
			divobjs.style.display = "block";
		}else{
			divobjs.style.display = "none";
		}
	});*/
	//加载云朵数据和事件
	/*$.ajax({
		url : '../effect/getCloud.do',
		type : 'POST',
		dataType : 'json',
		async : false,
		success :function(obj){
			$("#showDownInfo").html(obj);
			$('#shandow').click(function(){
				$('#showDownInfo').hide();
				document.ontouchmove=function(){
					return true;
					};
			});
		}
	});
	$("#showDownInfo_message").html("");
	$("#showDownInfo_remark").html("");
	$("#nowDown").html("");
	$.post("../effect/getParameter.do?type=9",function(obj) {
		var html="";
		$.each(obj.splist,function(i, o) {
			if(o.m_value<100){
				html+=o.m_desc+"<br>";
			}
			if(o.m_value==901){
				$("#showDownInfo_remark").html(o.m_desc);
			}
			if(o.m_value==902){
				$("#nowDown").html(o.m_desc);
			}
			$("#showDownInfo_message").html(html);
		});
	});*/
	/*$("#fx").click(function(){
		$('#showDownInfo').css("display","block");
		document.ontouchmove=function(){
			return false;
			};
	});*/
	
	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});

	
});

var timeOut ;
function mypoint(){
		
	var geolocation = new BMap.Geolocation();  
	geolocation.getCurrentPosition(function(r){ 
		lngNum = r.point.lng;
		latNum = r.point.lat;
	});
	
	//一直循环获取当前用户所有位置得经纬度
	if(lngNum == 0 && latNum == 0){
		timeOut = setTimeout("mypoint()",1000);
	}else{
		
		clearTimeout(timeOut);
		
		//根据经纬度查询销售代表
		$.ajax({
			url : '../goodml/latLon.do',
			data : {"latNum":latNum,"lngNum":lngNum},
			type : 'post',
			dataType : 'json',
			async : false,
			success : function(result){
				
				if(result.code == 'success'){
					
					loadSellerInfo(result);
					
				}else{
					
					$(".salesman").hide();
					
				}
				
			}
		});
		
	};
	
}


function loadSellerInfo(result){
	
	var fnntHtml = '';
	//销售代表评分
	var fraction = parseInt(result.objs.m_seller_fraction);
	var fractionHtml = '';
	
	for(var i = 0;i < fraction;i ++){
		fractionHtml += '<img src="../skins/personcenter/img/star1orange.png" class="seller_star">';
	}
	
	fractionHtml += '<span style="color: orange; position: relative; bottom: 0.2em; left: 0.2em;">'+fraction+'</span>';
	
	fnntHtml += '<div class="seller_img">' +
					'<a href="javascript:void(0)">' + 
						'<img src="../seller/down.do?filename='+result.objs.m_seller_pic+'" class="sellerimg">' +
					'</a>' +
				'</div>' +

				'<div class="seller_msg_des">' +
					'<div class="typlr">' +
						'<span>'+result.objs.m_seller_name+'</span>' + 
						'<span style="display: inline-block;" class="grade">'+result.objs.m_seller_grade+'</span>' +
					'</div>' +
					'<div class="typlm" id="star0">' +
						fractionHtml + 
						/*'<img src="../skins/personcenter/img/star1orange.png" class="seller_star">' + 
						'<img src="../skins/personcenter/img/star1orange.png" class="seller_star">' + 
						'<img src="../skins/personcenter/img/star1orange.png" class="seller_star">' + 
						'<img src="../skins/personcenter/img/star1orange.png" class="seller_star">' + 
						'<img src="../skins/personcenter/img/star1orange.png" class="seller_star">' + 
						'<span style="color: orange; position: relative; bottom: 0.2em; left: 0.2em;">5</span>' +*/
					'</div>' +
					'<div class="hert">' +
						'<span>产品体验专员</span>' +
					'</div>' +
				'</div>' +

				'<div class="seller_act">' +
					'<div class="seller_sign">' +
						'<a href="tel:'+result.objs.m_seller_phone+'">' + 
							'<img src="../skins/personcenter/img/sales_phone.png" class="sign">' +
						'</a>' +
						'<a href="sms:'+result.objs.m_seller_phone+'">' + 
							'<img src="../skins/personcenter/img/sales_messages.png" class="sign">' +
						'</a>' +
					'</div>' +
				'</div>' ;
	
	$(".seller_msg").html(fnntHtml);
	
}



//分享
function loadWxShare(){
	
	//加载微信分享数据
	$.ajax({
		url : '../weixin/key.do',
		data :{"nowurl":window.location.href},
		type : 'POST',
		dataType : 'json',
		async : false,
		success :function(result){
			
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: hs_appId, // 必填，公众号的唯一标识
			    timestamp: result.timestamp, // 必填，生成签名的时间戳
			    nonceStr: result.nonceStr, // 必填，生成签名的随机串
			    signature: result.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline']  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			
			//config执行失败执行
			wx.error(function(res){
//				alert("code="+res);
			});
		}
	});
	
	
	wx.ready(function(){

		
		var gt = $("#headTitle").text();//分享标题
		var gd = $("#describe").text();//分享描述
		var gi = GetQueryString("goodsId");//商品ID
		
		var fxUrl = share_url + "/secondbk2.html?fId=" + uid + "&t=p_" + gi + "&showUrl=http://"+hs_url+"/mxj/goodml/goToShareGoodsImg.do?goodsId="+gi;

		//分享给朋友
		wx.onMenuShareAppMessage({
		    title: gt, // 分享标题
		    desc: gd, // 分享描述
		    link: fxUrl, // 分享链接
		    imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg',//分享图标
		    success: function (res) {
		    	$.post("../share/add.do?type=" + share_type_good + "&id="+gi,function(obj){
		    		if(obj.message == 'success'){
		    			Message.showNotify("分享成功!",3000);
		    		}else{
		    			Message.showNotify("分享失败!",3000);
		    		}
		    	},'json');
		    }
		});
		
		//分享给朋友圈
		 wx.onMenuShareTimeline({
		      title: gt,
		      link: fxUrl,
		      imgUrl: 'http://'+hs_url+'/mxj/skins/share/img/share.jpg',//分享图标
		      success: function (res) {
		    	  $.post("../share/add.do?type=" + share_type_good + "&id="+gi,function(obj){
		    			if(obj.message == 'success'){
		    				Message.showNotify("分享成功!",3000);
		    			}else{
		    				Message.showNotify("分享失败!",3000);
		    			}
		    		},'json');
		      }
		 });
		
	});
	
}

function loadSwiper(){
	var mySwiper = new Swiper ('.swiper-container', {
		loop: true,
	    // 如果需要分页器
	    pagination: '.swiper-pagination',
	    onTouchEnd : function(swiper, even) {
		}
	  });
}

//venobox
$(document).ready(function(){
	$('.venobox').venobox({
		numeratio: true,
		border: '20px'
	});
	$('.venoboxvid').venobox({
		bgcolor: '#000'
	});
	$('.venoboxframe').venobox({
		border: '6px'
	});
	$('.venoboxinline').venobox({
		framewidth: '300px',
		frameheight: '250px',
		border: '6px',
		bgcolor: '#f46f00'
	});
	$('.venoboxajax').venobox({
		border: '30px;',
		frameheight: '220px'
	});
});
//venobox
