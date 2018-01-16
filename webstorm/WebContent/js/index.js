	var array=new Array();
	var index=0;
	var lng1;
	var lat1;
	var city;
	
	//附近店铺
	function mypoint(){
		var geolocation = new BMap.Geolocation();  
		geolocation.getCurrentPosition(function(r){ 
			lng1=r.point.lng;
			lat1=r.point.lat;
			$.post("../baidu/city.do?lng="+lng1+"&lat="+lat1,function(obj){
				city=obj.city;
			},'json');
		});
	}
	function GetQueryString(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	function getMyCity(){
		if(city==null || lng1==null || lat1==null){
			setTimeout("getMyCity()", 500);
		}else{
			showGoods(city);
		}
	}
var array = new Array();
var index = 0;
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
function daojishi() {
	for (var i = 0; i < array.length; i++) {
		var s = parseInt($("#s" + array[i]).html());
		var m = parseInt($("#m" + array[i]).html());
		var h = parseInt($("#h" + array[i]).html());
		if (s - 1 >= 0) {
			if (s - 1 < 10) {
				$("#s" + array[i]).html("0" + (s - 1));
			} else {
				$("#s" + array[i]).html(s - 1);
			}

		} else {
			$("#s" + array[i]).html(59);
			if (m - 1 >= 0) {
				if (m - 1 < 10) {
					$("#m" + array[i]).html("0" + (m - 1));
				} else {
					$("#m" + array[i]).html(m - 1);
				}

			} else {
				$("#m" + array[i]).html(59);
				if (h - 1 >= 0) {
					if (h - 1 < 10) {
						$("#h" + array[i]).html("0" + (h - 1));
					} else {
						$("#h" + array[i]).html(h - 1);
					}
				} else {
					$("#left" + array[i]).hide();
				}
			}
		}
	}
	setTimeout("daojishi()", 1000);
}
var zen_url;
function showall() {
	$.ajaxSetup({
		async : true
	});
	
	//查询兑吧入口URL
	$.post("../mine/zenpage.do?act=2",function(data){
		if(data && data.url){
			zen_url=data.url;
		}
	},'json');
	$.post(
			"../index/showall.do",
					function(d) {
						if (d) {
							if (d.guanggao) {
								$("#guanggao").attr(
										"src",
										"../guanggao/down.do?filename="
												+ d.guanggao.m_ad_pic);
								$("#tourl").attr("href", d.guanggao.m_ad_url);
							} else {
								$("#guanggao").attr("src",
										"../skins/firstpage/img/banner.png");
							}
							if (d.radiolist) {
								var s = "";
								$
										.each(
												d.radiolist,
												function(i, o) {
													s += o.m_radio_text
															+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
												});
								$("#radioshow").append(s);
							}
							if (d.user) {
								$(".username").html(d.user.nickname);
								$("#money").html(d.user.ready_money);
								$("#points").html(d.user.points);
								$("#yingxiangli").html(d.effect);
								$(".vip").html("VIP" + d.vip);
								if (d.user.head_img != null
										&& d.user.head_img != "") {
									if (d.user.head_img.substr(0, 7) == "http://") {
										$("#userimg").attr("src",
												d.user.head_img);
									} else {
										$("#userimg").attr(
												"src",
												"../cashRanking/img.do?imgName="
														+ d.user.head_img);
									}
								}

							}

						}
						var swiper = new Swiper('.swiper-container', {
							pagination : '.swiper-pagination',
							loop : true,
							autoplay : 5000,
							autoplayDisableOnInteraction : false,
							speed : 500,
							onSlideChangeEnd : function(swiper) {
								if (swiper.activeIndex == 1 || swiper.activeIndex == 4) {
									$(".swiper-container").css({"background-image":"url('../skins/firstpage/img/home_bg1.png')"}).css("background-size","100% 100%");
									$("#lianje").removeAttr("href");
									$("#tupian").attr("src",
											"../skins/firstpage/img/home_tixian.png");
									
									if(hs_nowtx){
										$("#tupian").attr("onclick","showHieDiv()");
									}else{
										$("#tupian").attr("onclick","cashtip()");/*"showHieDiv()"*/
									}
									if(hs_money){
										$("#tishi").html("立即提现");
									}
									else{
										$("#tishi").html("&nbsp;");
									}
									
								} else if (swiper.activeIndex == 2) {
									$(".swiper-container").css({"background-image":"url('../skins/firstpage/img/home_bg2.png')"}).css("background-size","100% 100%");
									$("#lianje").attr("href", "../effect/goToNewScan.do");
									$("#tupian").attr("src",
											"../skins/firstpage/img/home_namecard.png");
									$("#tishi").html("我的名片");
									$("#tupian").removeAttr("onclick");
								} else {
									$(".swiper-container").css({"background-image":"url('../skins/firstpage/img/home_bg3.png')"}).css("background-size","100% 100%");
									$("#lianje").attr("href", zen_url);
									$("#tupian")
											.attr("src", "../skins/firstpage/img/home_shop.png");
									$("#tishi").html("积分商城");
									$("#tupian").removeAttr("onclick");
								}
								$(".mymsg_title").fadeIn(500);
							},
							onSlideChangeStart : function(swiper) {
								$(".mymsg_title").fadeOut(500);
							}
						});
					}, 'json');
	$(".flortfoot ul").show();
}
function showRadio() {
	var s = radiolist[0] + radiolist[1] + radiolist[2] + radiolist[3]
			+ radiolist[4];

	setTimeout("showRadio()", 1000);
}
function toGameMore(th) {
	if ($.trim(th.innerText) != "" && $.trim(th.innerText) != null) {
		var namev = encodeURI(encodeURI(th.innerText));
		var typeName = "../hxz/goToHxzList.do?gameName=" + namev;
		window.location.href = typeName;
	}
}
function toGoodPage(from, goodId) {
	if (from == 0) {
		//modify by zhangzhen：屏蔽无用的参数
		window.location = "../goodml/goToGoodsDetails.do?goodsId=" + goodId;//+ "&openId=" + GetQueryString("openId");
	} else if (from == 1) {
		//	2016.06.14		window.location = "../goodml/shopmap.do?gd=" + goodId;
		window.location = "../goodml/shopmapno.do?gd=" + goodId;
	}
}
function showGoods(city) {
	$.ajaxSetup({
		async : false
	});
	$("#goodlist").empty();
	$.post("../index/indexgoods.do",
					function(d) {
						if (d.goodlist) {
							$.each(d.goodlist,function(i, o) {
												if (o.m_good_from == "线上") {
													$("#goodlist")
															.append(
																	$("<div class='swiper-slide'><div class='good' onclick='toGoodPage(0,"+o.m_good_id+")'><div class='goodleft'><a id='aid"+i+"' href='javascript:void(0);'><div class='gamename' id='gamename"
																			+ i
																			+ "'></div></a><div class='lefttime' id='left"
																			+ i
																			+ "'><div class='hour' id='h"
																			+ i
																			+ "'>00</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='minute' id='m"
																			+ i
																			+ "'>31</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='seconds' id='s"
																			+ i
																			+ "'>45</div></div><br/><div class='goodmsg'><span class='xinghao'><strong>"
																			+ o.m_good_no_short
																			+ "</strong></span><br/><span class='goodname'>"
																			+ o.m_good_name_short
																			+ "</span><br/><span class='gooddes'>"
																			+ o.m_good_des
																			+ "</span><br/><span class='goodprice'>￥"
																			+ o.m_good_price
																			+ "</span><br/><div class='space'>&nbsp</div></div></div><div class='goodright'><a href='../goodml/goodsofall.do' style='float:right;margin-right:10%;font-size:12dp;color:#7B7B7B;padding:0.75rem 0em 0.75rem 0.5em;'>更多商品<img src='../skins/personcenter/img/arr_rt1.png' style='width:10px;'></a><br/><img src='../good/down.do?filename="
																			+ o.m_good_pic
																			+ "' class='goodimg'/></div></div></div>"));

												} else {
													/*var url = '';
													if(city != null){
														var city2 = encodeURI(encodeURI(city));
														url = "../shop/cityshops.do?city=" + city2 + "&goodId=" + o.m_good_id;
													}else{
														url = "../shop/cityshops.do?goodId=" + o.m_good_id;
													}*/
													
//													$.post(url,function(obj2) {
//																		if (obj2 && obj2.shoplist) {
																		if (d.shoplist) {
																			$("#goodlist").append(
																							$("<div class='swiper-slide'><div class='good' onclick='toGoodPage(1,"+o.m_good_id+")'><div class='goodleft'><a id='aid"+i+"' href='javascript:void(0);'><div class='gamename' id='gamename"
																									+ i
																									+ "'></div></a><div class='lefttime' id='left"
																									+ i
																									+ "'><div class='hour' id='h"
																									+ i
																									+ "'>00</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='minute' id='m"
																									+ i
																									+ "'>31</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='seconds' id='s"
																									+ i
																									+ "'>45</div></div><br/><div class='goodmsg'><span class='xinghao'><strong>"
																									+ o.m_good_no_short
																									+ "</strong></span><br/><span class='goodname'>"
																									+ o.m_good_name_short
																									+ "</span><br/><span class='gooddes'>"
																									+ o.m_good_des
																									+ "</span><br/><span class='goodprice'>￥"
																									+ o.m_good_price
																									+ "</span><br/><div class='wan'>到店试玩</div><div class='goshop'><a>门店查看 &gt;</a></div></div></div><div class='goodright'><a href='../goodml/goodsofall.do' style='float:right;margin-right:10%;font-size:12dp;color:#7B7B7B;padding:0.75rem 0em 0.75rem 0.5em;'>"
																									+ ""
																									+ "更多商品 <img src='../skins/personcenter/img/arr_rt1.png' style='width:10px;'></a><br/><img src='../good/down.do?filename="
																									+ o.m_good_pic
																									+ "' class='goodimg'/></div></div></div>"));

																		} else {
																			$("#goodlist").append(
																							$("<div class='swiper-slide'><div class='good' onclick='toGoodPage(0,"+o.m_good_id+")'><div class='goodleft'><a id='aid"+i+"' href='javascript:void(0);'><div class='gamename' id='gamename"
																									+ i
																									+ "'></div><div class='lefttime' id='left"
																									+ i
																									+ "'><div class='hour' id='h"
																									+ i
																									+ "'>00</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='minute' id='m"
																									+ i
																									+ "'>31</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='seconds' id='s"
																									+ i
																									+ "'>45</div></div><br/><div class='goodmsg'><span class='xinghao'><strong>"
																									+ o.m_good_no_short
																									+ "</strong></span><br/><span class='goodname'>"
																									+ o.m_good_name_short
																									+ "</span><br/><span class='gooddes'>"
																									+ o.m_good_des
																									+ "</span><br/><span class='goodprice'>￥"
																									+ o.m_good_price
																									+ "</span><br/><div class='space'>&nbsp</div></div></div><div class='goodright'><a href='../goodml/goodsofall.do' style='float:right;margin-right:10%;font-size:12dp;color:#7B7B7B;padding:0.75rem 0em 0.75rem 0.5em;'>更多商品<img src='../skins/personcenter/img/arr_rt1.png' style='width:10px;'></a><br/><img src='../good/down.do?filename="
																									+ o.m_good_pic
																									+ "' class='goodimg'/></div></div></div>"));
																		}
//																	}, 'json');

												}
												
												if(o.m_good_gameNo != 0){

													for(var j = 0;j < d.listGame.length;j ++){
														
														if(o.m_good_id == d.listGame[j].m_game_good_id){

															$("#gamename"+ i).html(d.listGame[j].m_game_name);

															//拼接2016.06.15 begin
															//由原来的点击图片进入定位地图
															//现改成点击整个DIV进入定位地图
															//但由于里面有两个标签是独立的，所以以这种方法来完成该功能
															var namev = encodeURI(encodeURI(d.listGame[j].m_game_name));
															var typeName = "../hxz/goToHxzList.do?gameName=" + namev;
															$("#aid" + i).attr("href",typeName);
															//拼接2016.06.15 end
															
															var d1 = new Date().getTime();
															var d2 = new Date(d.listGame[j].m_game_endTime).getTime();
															var lefttime = d2 - d1;
															
															if (lefttime <= 0) {
																$("#left"+ i).hide();
															}else {
																array[index] = i;
																index++;
																var h = parseInt(lefttime / (1000 * 60 * 60) + "");
																var m = parseInt((lefttime - h * 1000 * 60 * 60) / (60 * 1000));
																var s = parseInt((lefttime - h * 1000 * 60 * 60 - m * 1000 * 60) / 1000);
																$("#h" + i).html(h);
																$("#m" + i).html(m);
																$("#s" + i).html(s);
															}
														}
													}
												} else {
													$("#left" + i).hide();
													$("#gamename" + i).html(o.m_good_label);
												}
												
												//2016.08.19优化代码-wgd
												/*$.post("../game/name.do?gameNo="+ o.m_good_gameNo,
																function(obj) {
																	if (obj.name) {
																		
																		$("#gamename"+ i).html(obj.name);

																		//拼接2016.06.15 begin
																		//由原来的点击图片进入定位地图
																		//现改成点击整个DIV进入定位地图
																		//但由于里面有两个标签是独立的，所以以这种方法来完成该功能
																		var namev = encodeURI(encodeURI(obj.name));
																		var typeName = "../hxz/goToHxzList.do?gameName=" + namev;
																		$("#aid" + i).attr("href",typeName);
																		//拼接2016.06.15 end
																		
																		
																		var d1 = new Date()
																				.getTime();
																		var d2 = new Date(
																				obj.enddate)
																				.getTime();
																		var lefttime = d2
																				- d1;
																		if (lefttime <= 0) {
																			$(
																					"#left"
																							+ i)
																					.hide();
																		} else {
																			array[index] = i;
																			index++;
																			var h = parseInt(lefttime
																					/ (1000 * 60 * 60)
																					+ "");
																			var m = parseInt((lefttime - h * 1000 * 60 * 60)
																					/ (60 * 1000));
																			var s = parseInt((lefttime
																					- h
																					* 1000
																					* 60
																					* 60 - m * 1000 * 60) / 1000);
																			$(
																					"#h"
																							+ i)
																					.html(
																							h);
																			;
																			$(
																					"#m"
																							+ i)
																					.html(
																							m);
																			$(
																					"#s"
																							+ i)
																					.html(
																							s);
																		}
																	} else {
																		$("#left"+ i).hide();
																		$("#gamename"+ i).html(o.m_good_label);
																	}

																}, 'json');*/
											});
							daojishi();

							var activity = new Swiper('.activity', {
								scrollbar : '.swiper-scrollbar',
								scrollbarHide : true,
								slidesPerView : 1.2,
								centeredSlides : true,
								paginationClickable : true,
								spaceBetween : 5
							});
						}
					}, 'json');
}
$(function() {
	//2016.06.17取消首页商品定位功能-wgd
	//mypoint();
	showall();
	//getMyCity();
	showGoods(null);
	$("#hxz").click(function() {
		var namev = encodeURI(encodeURI("好享赚"));
		//var typeName = "../hxz/goToHxzList.do?openId="+ GetQueryString("openId") + "&gameName=" + namev;
		//modify by zhangzhen: 屏蔽无用的get参数
		var typeName = "../hxz/goToHxzList.do?gameName=" + namev;
		window.location.href = typeName;
	});
	$("#mine").click(function() {
		window.location = "../personcenter/personalcenter.html";
	});
	$("#zhoubian").click(function() {
		window.location = "../goodml/shopmap.do";
	});
	$(".tomine").click(function() {
		window.location = "../goodml/mine.do";
	});
	$(".tolist").click(function() {
		if (goodId == null) {
			goodId = 0;
		}
		window.location = "../goodml/shoplist.do?goodId=" + goodId;
	});
	$("#myCard").click(function() {
		window.location.href = "../effect/goToNewScan.do";
	});
	$("#wanzhuan").click(function(){
		window.location.href = "../getZen4Weixin/getZen.do";
	});
	
	$(".mask").click(function() {
		showHieDiv();
	});
});

function showHieDiv() {
	var divStatus = document.getElementById("showScan");
	if (divStatus.style.display == "none") {
		divStatus.style.display = "block";
	} else {
		divStatus.style.display = "none";
	}
}
function cashtip(){	
		$('#showhide').show();
		document.ontouchmove=function(){
			return false;
			};
		
	$("#showhide p").click(function(){
		$('#showhide').hide();
		document.ontouchmove=function(){
			return true;
			};
	});
}