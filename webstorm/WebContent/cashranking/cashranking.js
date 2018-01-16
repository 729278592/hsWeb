var pagesimple = {};
var type=1;
var topData=true;
var loaddata=true;
$(function() {
	/* 绑定点击事件 */
	$('#otherprofit').bind('click', function() {
		type=1;
		loaddata=true;
		loadData("1");
	});

	//弹出云朵跳转下载页面
	$("#nowDown").click(function(){
		window.location.href = "../cashRanking/goToDownloadPage.do";
	});
	
	$('#myprofit').bind('click', function() {
		type=0;
		loaddata=true;
		pagesimple = {};
		loadData("2", true);
	});

	$(".return1").bind('click', function() {
		history.go(-1);
		return false;
	});
	$('#add').click(function(){
		share();
	});
	
	// 点击DIV进行隐藏
	$(".func_tixian").click(function() {
//		$("#divcontent").empty();
//		$("#divcontent").html("请下载“省事儿”APP申请提现");
		if(hs_money){
			showHieDiv("showScan");
		}else{
			Message.showNotify("没有可提现得余额",3000);
		}
	});

	$("#partners").click(function(){
//		$("#divcontent").empty();
//		$("#divcontent").html("只有下载“省事儿”APP才能查看全部合伙人");
		if(hs_money){
			showHieDiv("showScan");
		}else{
			Message.showNotify("没有可提现得余额",3000);
		}
	});
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
				if ( pagesimple.maxCount> pagesimple.start) {
					pagesimple.start = pagesimple.start + pagesimple.rownum;
					loadData("2", false);
				}
		     }
			}
      }
	});
	$('.mask').click(function(){
		$("#showScan").css("display","none");
	});
	/* 初始化数据 */
	loadData("1");
});

function showHieDiv(ID) {
	var divStatus = document.getElementById(ID);
	if (divStatus.style.display == "none") {
		divStatus.style.display = "block";
	} else {
		divStatus.style.display = "none";
	}
}
function loadData(type, flag) {
	var temlist;
	var temp_class = "";
	var temp_str = "";
	$.ajax({
				async : false,
				url : "load.do",
				type : "post",
				dataType : "json",
				data : {
					"pagesimple.start" : pagesimple.start,
					"pagesimple.rownum" : pagesimple.rownum,
					"pagesimple.maxCount" : pagesimple.maxCount
				},
				beforeSend : ajaxLoading,
				timeout : 10000,
				success : function(data) {
					//console.log(data)
					//data = datas;
					$("#day_money").html(data.day_money);
					$("#week_money").html(data.week_money);
					$("#month_money").html(data.month_money);
					$("#cash").html(data.userCashRanking.cash);
//					2016.08.04冻结不要$("#cashing").append(data.userCashRanking.cashing);
					$("#cashing").html(data.userCashRanking.cash);
					if(data.userCashRanking.rank .length>4){
						$("#rank").html(data.userCashRanking.rank .substring(0,4) + "+");
					}else{
						$("#rank").html(data.userCashRanking.rank );
					}
					
					if(topData){
					/* 顶部排行榜 */
					$("#rank_cont").empty();
					temlist = data.topList;
					var tempSrc= "";
					if (temlist.length > 0) {
						
						temp_str+="<div class=\"swiper-slide\">";
						
						for ( var i = 0; i < temlist.length; i++) {										
							if (i + 1 == 1) {
								temp_class = "rank rank_cont1";
							} else if (i + 1 == 2) {
								temp_class = "rank rank_cont2";
							} else if (i + 1 == 3) {
								temp_class = "rank rank_cont3";
							} else {
								temp_class = "rank rank_cont4";
							}
							
							if(temlist[i].head_img.substr(0,7)=="http://"){
								tempSrc=temlist[i].head_img;
							}else{
								if(temlist[i].head_img==null||temlist[i].head_img ==""){
									tempSrc= "../skins/firstpage/img/body_default.png";
								}else{
									tempSrc="./img.do?imgName="+temlist[i].head_img;
								}
								
							}
							
							/*temp_str += "<div class=\"" + temp_class + "\">"
									+ "<img src=\"./img.do?imgName="
									+ temlist[i].head_img + "\">" + "<p><span>"
									+ (i + 1) + "</span>" + temlist[i].nickname
									+ "</p>" + "</div>";*/
							temp_str += "<div class=\"" + temp_class + "\">"
							+ "<img src="+tempSrc+ "\>" + "<p><span>"
							+ (i + 1) + "</span>" + temlist[i].nickname
							+ "</p>" + "</div>";
							
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
						/*temp_str = "<div style='text-align:center'>暂无数据</div>";*/
					   temp_str += '<div class="partner">' +
					   					'<div class="partner_top">目前没有合伙人，赶紧去邀请吧~</div>'+
					   					'<div class="partner_top">' +
											'<div id="add" class="getCloud">邀请好友</div>' +  
					   					'</div>' +
								   '</div>';
					}
					 $("#rank_cont").append(temp_str);
					  topData=false;
					}
					temp_str = "";
					/* 底部排行榜 */
					if (type == 1) {

						/* 合伙人帮赚 */
						$("#otherprofit").attr("class", "profit_titlepre");
						$("#myprofit").attr("class", "");

						$("#profitcount").empty();
						$("#profitcount").attr("class", "profit_cum");
						$("#profitcount").append(
								"<p class='title'>累计收益<span class='num'>￥" + data.profit_money
										+ "</span></p>");

						temlist = data.bottomList;
						$("#profit").empty();
						var tempSrc2="";
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
							for ( var j = 0; j < temlist.length; j++) {
								
								if(temlist[j].head_img.substr(0,7)=="http://"){
									tempSrc2=temlist[j].head_img;
								}else{
									if(temlist[j].head_img==null||temlist[j].head_img ==""){
										tempSrc2= "../skins/firstpage/img/body_default.png";
									}else{
										tempSrc2="./img.do?imgName="+temlist[j].head_img;
									}
									
								}
								
								temp_str += "<table class=\"profit_rank1\" border=\"0\">"
									+ "<tr>" + "<td class=\""
									+ temp_class
									+ "\"><p><span>"
									+ (j + 1)
									+ "</span></p></td>"
									+ "<td class=\"t_img\">"
									+ "<img src="
									+ tempSrc2
									+ "\>"
									+ "<div class=\"label_vip\">"
									+ "<span>VIP"
									+ temlist[j].vip.m_vip
									+ "</span>"
									+ "</div>"
									+ "</td>"
									+ "<td class=\"t_name\"><p><span class='name'>"
									+ temlist[j].nickname
									+ "</span><span class='name-num'>二级帮赚"
									+ temlist[j].next_cash
									+ "元</span></p></td>"
									+ " <td class=\"t_value\"><p><span>+￥"
									+ (temlist[j].total_cash + temlist[j].next_cash)
									+ "</span></p></td>"
									+ "</tr>"
									+ "</table>";

							}

						} else {
						temp_str="<img src=\"../skins/imgs/none.png\" style=\"width: 40%;margin-top: 10%;margin-left:30%;padding-bottom:10%;\" >";
					
							loaddata=false;
						}
					} else {
						/* 自己赚 */
						$("#otherprofit").attr("class", "");
						$("#myprofit").attr("class", "profit_titlepre");
						$("#profitcount").empty();

						if (flag) {
							$("#profit").empty();
						}
						var temp_group = "";
						/* 收益详情 */
						pagesimple = data.myprofit_detail.page;
						temlist = data.myprofit_detail.list;

						if (temlist.length > 0) {
							for ( var k = 0; k < temlist.length; k++) {
								if (temp_group != temlist[k].m_group) {
								
								temp_str += "<div class=\"profit_cum\"><p>"
										+ temlist[k].m_group + "</p></div>";
								temp_group = temlist[k].m_group;
								}
								
								temp_str += "<table class=\"profit_rank1\" border=\"0\">"
									+ "<tr>"
									+ "<td cosspan=\"2\" class=\"t_name\"><p><span class='name'>"
									+temlist[k].m_create_name+"</span><span class='name-num'>"
									+ temlist[k].format
									+ "</span></p></td>"
									+ " <td class=\"t_value\"><p><span>+￥"
									+ temlist[k].cash
									+ "</span></p></td>"
									+ "</tr>" + "</table>";
							}

						} else {
							temp_str="<img src=\"../skins/imgs/none.png\" style=\"width: 40%;margin-top: 10%;margin-left: 30%;padding-bottom:10%;\" >";
							loaddata=false;
						}

					}

					$("#profit").append(temp_str);
				},
				error : function(error) {
					console.log("加载失败!");
				}
			});

}

function ajaxLoading() {

}
function share(){
	if($("#showDownInfo")[0].style.display=="none"){
		$("#showDownInfo")[0].style.display="block";
		$("#shandow")[0].style.display="block";
		document.ontouchmove=function(){
			return false;
			};
	}else{
		$("#showDownInfo")[0].style.display="none";
		$("#shandow")[0].style.display="none";
		document.ontouchmove=function(){
			return true;
			};
	}
	
}