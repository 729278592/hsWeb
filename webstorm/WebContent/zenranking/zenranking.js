
var pagesimple = {};
var type = 0; // 0合伙人，1自己赚
var group="";

var maxnum = 0;//总记录数
var curPageNum = 1;//当前页数
var bpage = 1;
var pageCount = 0;//总记录数

$(function() {
	
	var range = 5;//距下边界长度/单位px  
    var elemt = 500;//插入元素高度/单位px  
    var totalheight = 0;   
	
	$(window).scroll(function(){
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)  
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) { 
        	curPageNum++;
        	if(curPageNum <= maxnum){
        		loadCumulative();
        	}
        }
    });
	
	msg();
	
	loadCumulative();
	
	//加载两次，防止无法撑满一页，导致滑动失效
	curPageNum +=1;
	loadCumulative();
	
	if(!hs_money){
		$('#queryall').html("&nbsp;");
	}

	var swiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		paginationClickable: true,
		autoplay: 3000 
	});
	/* 初始化数据 */
	
	loadTopData();
	
	loadPartner(false);
	
	/* 绑定点击事件 */
	$('#otherprofit').bind('click', function() {
		type = 0;
		loaddata=true;
		loadPartner(true);

	});

	$('#myprofit').bind('click', function() {
		loaddata=true;
		type = 1;
		pagesimple={};
		group="";
		loadMine(true);
	});

	$(".return1").bind('click', function() {
//		history.go(-1);
		window.location.href = "../goodml/mine.do";
		return false;
	});
	var loaddata = true;
	$(window).scroll(function() {
        if(loaddata){
			var srollPos = $(window).scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)
	
			// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
			// console.log("页面的文档高度 ："+$(document).height());
			// console.log('浏览器的高度：'+$(window).height());
			var range = 50;
			totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
	
			if (($(document).height() - range) <= totalheight) {
				if (type == 0) {
						loadPartner(true);
				} else if (type == 1) {
					if (10 > pagesimple.start) {
						pagesimple.start = pagesimple.start + pagesimple.rownum;
						loadMine(false);
					}else{
						
					}
				}
			}
	     }
	});
	
	var activity = new Swiper('.rank_cont', {});

	$(".mask").click(function() {
		showHieDiv("showScan");
	});
	$(".mask1").click(function() {
		showHieDiv("showUserInfo");
	});
	
	$("#queryall").click(function() {
//		$("#divcontent").empty();
		//modify by zhangzhen for: 开放省事儿apk下载功能		
		if(hs_money){
			$("#divcontent").html("请下载“省事儿”APP查看全部");
			showHieDiv("showScan");
		}else{
			Message.showNotify("功能开发中，敬请谅解！",3000);
		}
	});
	
	$("#zenshop").click(function(){
		jumpShop(2);
	});
	
	//可用
	$("#available").click(function(){
		jumpShop(2);
	});
	
	//已兑
	$("#has").click(function(){
		jumpShop(1);
	});
	
	//点击div同时也跳转
	$(".func_cash").click(function(){
		jumpShop(2);
	});
	//点击div同时也跳转
	$(".func_tixian").click(function(){
		jumpShop(1);
	});
	/*$('.rank_cont1').click(function(){
		$('.mask').show();
		$('.message_detail').show();
	});*/
	
	//对列表对象进行绑定事件 
	$(".person").click(function(){
		//change();
		showHieDiv("showUserInfo");
		$("#showUserInfo").show();
		var id = $(this).attr("id");
		//加载用户信息
		$.ajax({
			url : '../zenProfit/helpMakeZen.do',
			data : {"checkUserId":id},
			type : 'POST',
			async : true,
			dataType : 'JSON',
			success : function(result){
				var origin = result[1];
				if (origin.substring(0,7) == 'http://') {
				} else {
					origin = "../user/down.do?filename=" + origin;
				}

				var checkHtml = "";
				checkHtml+= '<div class="message_detail">' +
					             '<dl>' +
					                 '<dt>' +
					                     '<img src="'+origin+'" width="40%" height="40%" >' +
					                     /*'<span>VIP'+result[2]+'</span>' +*/
					                 '</dt>' +
					                 '<dd>' +
					                     '<p>'+result[3]+'</p>' +
					                     /*'<div>' +
					                         '<img src="../skins/effect/img/myeffect_icon_white.png" width="13rem">&nbsp;' +
					                         '<span>'+result[4]+'</span>' +
					                     '</div>' +*/
					                 '</dd>' +
					             '</dl>' +
					         '</div>' +
					         '<div class="mes">' +
					             '<p>帮赚积分:&nbsp;<span >'+result[5]+'&nbsp;枚</span></p>' +
					             '<p>二级合伙人帮赚积分:&nbsp;<span>'+result[8]+'&nbsp;枚</span></p>' +
					         '</div>' +
					         '<p  class="send" onclick="x();" id="iKnow">我知道了</p>' +
					         '<div id="addJSDiv" style="dispaly:none"><script type="text/javascript">function x(){$("#showUserInfo").hide();$("#addJSDiv").remove();}</script></div>';
				
				$(".message").html(checkHtml);
			},error:function(){
				$(".message").html("<div style='text-align:center;height:50px;line-height:50px;font-size:14px;font-weight:900;'>数据拉取失败<div>");
			}
		});
		
		
	});
	//2016.10.09  屏蔽云朵改成展示个性化二维码 
	$(".getCloud").click(function(){
		location.href="../effect/goToNewScan.do";
	});
	$("footer").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
	$("#adds").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});

});

function showHieDiv(id) {
	var divStatus = document.getElementById(id);

	if (divStatus.style.display == "none") {
		divStatus.style.display = "block";
	} else {
		divStatus.style.display = "none";
	}
}

//加载累计收益
function loadCumulative(){
	
	
	$.ajax({
		
		url : '../zenRanking/zenincome.do',
		async : true,
		data :{"cpage":curPageNum},
		type : 'post',
		dataType : 'json',
		success : function(result){
			
			var YesterDayStr = GetDateStr(-1);//昨天
			var toDayStr = GetDateStr(0);//今天
			
			var htmlCode = '';
			
			var showTime = '';
			
			var titleName = '';
			
			var timeFlag = '';//时间标记
			
			var falgNum = 1;
			
			var flagEndNUm = 0; 
			
			if(result.code == 'success'){
				//2016-10-28
				timeFlag = result.objs.detailincome[0][2];
				
				$(".count_num").html(parseFloat(result.objs.totalincome).toFixed(2));
				
				maxnum = result.objs.totalNum;//总记录数

				for(var i = 0;i < result.objs.detailincome.length;i ++){

//						if(result.objs.detailincome[i][0] == 800){
//							titleName = '签到';
//						}
//						
//						if(result.objs.detailincome[i][0] == 301){
//							titleName = '分享资讯';
//						}
//						
//						if(result.objs.detailincome[i][0] == 1204){
//							titleName = '创建微清单';
//						}
//						
//						if(result.objs.detailincome[i][0] == 1203){
//							titleName = '发展人脉';
//						}
						titleName = result.objs.detailincome[i][0];
					
						if(falgNum == 1){
						
							if(result.objs.detailincome[i][2] == toDayStr){
								showTime = '今天';
							}else if(result.objs.detailincome[i][2] == YesterDayStr){
								showTime = '昨天';
							}else{
								showTime = result.objs.detailincome[i][2];
							}
							
							var str = result.objs.detailincome[i][2].replace(/-/g,".");
							
							htmlCode += '<div class="details">' +
				 							'<p>'+showTime+'</p>' +
												'<ul class="details_msg">' +
												'<li>'+
								 					'<span class="date">'+titleName+'<span>'+str+'</span></span>' +
								 					'<span class="add_num">+'+parseFloat(result.objs.detailincome[i][1]).toFixed(2)+'</span>' +
							 					'</li>' ;
							
							falgNum = 2;
							
						}else{
							
							var str = result.objs.detailincome[i][2].replace(/-/g,".");
							
							htmlCode += '<li>'+
						 					'<span class="date">'+titleName+'<span>'+str+'</span></span>' +
						 					'<span class="add_num">+'+parseFloat(result.objs.detailincome[i][1]).toFixed(2)+'</span>' +
						 				'</li>';
							
						}
					
					//结尾
					if(++flagEndNUm == result.objs.detailincome.length){
						htmlCode += '</ul></div>';
					}else{
						
						if(timeFlag != result.objs.detailincome[i + 1][2]){
							htmlCode += '</ul>' +
								'</div>' ;
							
							falgNum = 1;
							
							timeFlag = result.objs.detailincome[i + 1][2];
						}
						
					}
				
				}
				
				$("section").append(htmlCode);
				
			}
			
		}
		
	});
	
}

function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	return y+"-"+m+"-"+d; 
} 


function loadTopData() {
	
	var temp_str="";
	$.ajax({
		async : true,
		url : "load.do",
		type : "post",
		dataType : "json",
		data : {},
		/*beforeSend : ajaxLoading,*/
		timeout : 30000,
		success : function(data) {
			/*if(data.data==null){
				return false;
			}*/
			try{
				var user_profit=$.parseJSON(data.user_profit);
				$("#day_money").empty();
				$("#day_money").append(user_profit.msg.dailyIncome);
				$("#week_money").empty();
				$("#week_money").append(user_profit.msg.weeklyIncome);
				$("#month_money").empty();
				$("#month_money").append(user_profit.msg.monthlyIncome);
				$("#cash").empty();
				$("#cash").append(user_profit.msg.available);
				$("#cashing").empty();
				$("#cashing").append(user_profit.msg.spent);
				$("#rank").empty();
				if(user_profit.msg.rank.length>4){
					$("#rank").append(user_profit.msg.rank.substring(0,4) + "+");
				}else{
					$("#rank").append(user_profit.msg.rank);
				}
				
				$("#rank_cont").empty();

				
				temp_str+="<div class=\"swiper-slide\">";
				var temlist = data.partners;
				if( typeof(temlist) != "undefined" && null != temlist ){
					if (temlist.length > 0) {
						for ( var i = 0; i < temlist.length; i++) {
							if (i + 1 == 1) {
								temp_class = "rank_cont1 person";
							} else if (i + 1 == 2) {
								temp_class = "rank_cont2 person";
							} else if (i + 1 == 3) {
								temp_class = "rank_cont3 person";
							} else {
								temp_class = "rank_cont4 person";
							}
							temp_str += "<div id="+temlist[i].userId+" class=\"" + temp_class + "\">"
									+ "<img src=\""
									+ temlist[i].headImg + "\">" + "<p><span>"
									+ (i + 1) + "</span>" + temlist[i].nickname
									+ "</p>" + "<p>"
									+ temlist[i].effect + "</p>" + "</div>";
							
							if (i > 0&&(i+1)%4 == 0  ) {
								if (i == temlist.length-1) {
									temp_str += '</div>';
								} else {
									temp_str += '</div>';
									temp_str += '<div class="swiper-slide">';
								}
		
							}else if (i % 4 != 0 && i == temlist.length-1) {
								temp_str += '</div>';
		
							}
							
						}
					} else {
						temp_str = "<div style='text-align:center'>暂无数据</div>";
						/*temp_str = '<div class="partner">' +
							'<div class="partner_top">' +
							'<img src="../skins/effect/img/add.png" id="add" class="getCloud" />' +  
							'</div>' +
		   			    '<div class="partner_foot">' +
						   '<dd class="partner_foot_top" >添加合伙人</dd>' +
						   '<dd class="partner_foot_top"></dd>' +
					    '</div> '+
					    '</div>';
						temp_str += '<div style="float:left;width:75%;text-align:center;color: #868686;padding-top: 4%;">目前没有合伙人，赶紧去邀请吧~</div>';
						temp_str += '</div>';*/
						loaddata=false;
					}
				}
				$("#rank_cont").append(temp_str);
				temp_str = "";
			}catch(e){}

		},

		error : function(error) {
//			alert(error);
//			alert("加载失败!5");
			Message.showNotify("加载失败!",1500);
		}
	});

}
/*自己赚 */
var  existA =0; //判断是否已经有了数据
function loadMine(flag) {
	var obj={};
	var arr=new Array();
	var temp_str="";
	$.ajax({
				async : true,
				url : "loadMine.do",
				type : "post",
				dataType : "json",
				data : {
					"pagesimple.start" : pagesimple.start,
					"pagesimple.rownum" : pagesimple.rownum,
					"pagesimple.maxCount" : pagesimple.maxCount
					},
				/*beforeSend : ajaxLoading,*/
				timeout : 30000,
				success : function(data) {
					pagesimple=data.pagesimple;
					
					$("#otherprofit").attr("class", "");
					$("#myprofit").attr("class", "profit_titlepre");
					$("#profitcount").empty();
					if(flag){
					  $("#profit").empty();
					}
					pagesimple=data.pagesimple;
					obj=$.parseJSON(data.uzcl);
					if(obj.code==0){
						arr=obj.msg.list;
					}
					
					for(var i=0;i<arr.length;i++){
						if(group!=arr[i].group){
						  group=arr[i].group;
						temp_str += "<div class=\"profit_cum\"><p>"+arr[i].group+"</p>	"
						          + "</div>";
						}
						temp_str += "<table class=\"profit_rank1\" border=\"0\">"
							+ "<tr>"
							+ "<td cosspan=\"2\" class=\"t_name\"><p>"
							+ arr[i].title
							+ "："
							+ arr[i].date
							+ "</p></td>"
							+ " <td class=\"t_value\"><p><span>"
							+ arr[i].points
							+ "</span></p></td>"
							+ "</tr>" + "</table>";
						
					}
					
					if(arr.length==0){
						temp_str="<img src=\"../skins/imgs/none.png\" style=\"width: 50%;margin-top: 10%;margin-left: 25%;\" >";
						loaddata=false;
					}
				
					$("#profit").append(temp_str);
				},
				error : function(error) {
//					alert("加载失败!6");
					Message.showNotify("加载失败!",3000);
				}
			});

}

function loadPartner(flag) {
	//界面修改，这里禁用了
	return;
	
	var temp_class="";
	var temp_str="";
	$.ajax({
				async : true,
				url : "loadPartner.do",
				type : "post",
				dataType : "json",
				data : {
				},
				/*beforeSend : ajaxLoading,*/
				timeout : 30000,
				success : function(data) {

					 /*合伙人帮赚 */
					$("#otherprofit").attr("class", "profit_titlepre");
					$("#myprofit").attr("class", "");

					temlist = data.partners;
					if(flag){
						$("#profit").empty();			
					}
				
					var totalGain = 0.00;
					if (temlist.length > 0) {
						if (j + 1 == 1) {
							temp_class = "t_rank1";
						} else if (j + 1 == 2) {
							temp_class = "t_rank2";
						} else if (j + 1 == 3) {
							temp_class = "t_rank3";
						} else {
							temp_class = "t_rank4";
						}
						
						var singleGain  =0.00;
						for ( var j = 0; j < temlist.length; j++) {

							singleGain = parseFloat(temlist[j].firstLevelGain) + parseFloat(temlist[j].secondLevelGain); 
							temp_str += "<table class=\"profit_rank1\" border=\"0\">"
									+ "<tr>" + "<td class=\""
									+ temp_class
									+ "\"><p><span>"
									+ (j + 1)
									+ "</span></p></td>"
									+ "<td class=\"t_img\">"
									+ "<img src=\""
									+ temlist[j].headImg
									+ "\">"
									+ "<div class=\"label_vip\">"
									+ "<span>VIP"
									+ temlist[j].vips.m_vip
									+ "</span>"
									+ "</div>"
									+ "</td>"
									+ "<td class=\"t_name\"><p><span>"
									+ temlist[j].nickname
									+ "</span><br>一级帮赚"
									+ temlist[j].firstLevelGain
									+ "枚</p></td>"
									+ " <td class=\"t_value\"><p><span>+"
									+ singleGain.toFixed(2)
									+ "</span></p></td>" + "</tr>" + "</table>";

							totalGain += singleGain;
						}

					} else {
						 temp_str="<img src=\"../skins/imgs/none.png\" style=\"width: 50%;margin-top: 10%;margin-left: 25%;\" >";
					}
					$("#profit").append(temp_str);
					
						
					$("#profitcount").empty();
					$("#profitcount").attr("class", "profit_cum");
					$("#profitcount").append(
							"<p>累计收益<span>" + totalGain.toFixed(2) + "</span></p>");
					
				},
				error : function(error) {
					//alert("加载失败!7");
					Message.showNotify("加载失败!",3000);
				}
			});

}

function jumpShop(flag){
	$.ajax({
		async : false,
		url : "../mine/zenpage.do?act="+flag,
		type : "post",
		dataType : "json",
//		data : {},
		/*beforeSend : ajaxLoading,*/
		timeout : 30000,
		success : function(data) {
			location.href = data.url;
		},
		error : function(error) {
//			alert("加载失败!8");
			Message.showNotify("加载失败!",3000);
		}
	});
}
function msg(){
	var msgcontent='';
	$.ajax({
		asyns:true,
		url:"../zenRanking/zenmsg.do",
		data : {"cpage":bpage},
		type:"post",
		dataType:"json",
		success : function(data){
			if(data.code == 'success'){
				pageCount = data.objs.count;//总记录数
				var showtime = data.objs.times;
				var mesage = "暂无数据！";
				if(data.objs.msgList != null){
					mesage = data.objs.msgList[0].m_msg_text;
				} 
				var htmlCode = '<div class="changes">'
									+'<div class="blank"></div>'
									+'<div class="left left_button" onclick="upClick();"></div>'
									+'<div class="time">'+ showtime +'</div>'
									+'<div class="left right right_button" onclick="downClick()"></div>'
									+'<div class="blank"></div>'
								+'</div>';
				htmlCode += '<div class="swiper-container jifen-content">'+
					'<div class="swiper-wrapper">'+
					'<div class="swiper-slide">'+
						'<div class="msg">'+
							'<div class="img_box"></div>'+
							'<div class="content no-more">'+ mesage+'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>';
					
			$(".share").html(htmlCode);
			}
		}
	});
}
function upClick(){
	bpage = bpage + 1;
	
	if(bpage > pageCount){
		Message.showNotify("没有上周数据!",3000);
		bpage = bpage - 1;
	}else{
		msg();
	}
	
}

function downClick(){
	bpage = bpage - 1;
	if(bpage != 0){
		msg();
	}else{
		Message.showNotify("没有下周数据!",3000);
		bpage = bpage + 1;
	}
}