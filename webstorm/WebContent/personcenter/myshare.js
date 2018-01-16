//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
var uid;

$.ajaxSetup({
	async : false
});

function showInfo(id,uid){
	$.post("../infos/one.do?id="+id+"&type=" + share_type_info,function(obj3){
		if(obj3 && obj3.info){
			//window.location="http://"+hs_url+"/mxj_weixin/auth/mpOAuth?redirectUrl=" + share_url + "/second.html?fId="+uid+"&t=i_"+id+"&showUrl="+obj3.info.info_url;
			if(is_weixn()){
				window.location = "http://" + hs_url + "/mxj_weixin/auth/mpOAuth?redirectUrl=" + encodeURIComponent(share_url + "/secondbkAll.html?fId=" + uid + "&t=i_" + id + "&showUrl=" + obj3.info.info_url + "&type=" + share_type_info);
			}
			else
			{
				window.location = share_url + "/secondbkAll.html?fId=" + uid + "&t=i_" + id + "&showUrl=" + obj3.info.info_url + "&type=" + share_type_info;
			}
			
		}
	},'json');
}

function showMyShares(pageNow){
	$.ajaxSetup({
		async : false
	});
	num=pageNow;

	$.post("../share/showmyshare.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		if(obj && obj.myshares){
			maxnum=obj.pageSum;
			$.each(obj.myshares,function(i,o){
				if(o.m_ms_type==share_type_good){
					$.post("../share/good.do?muid="+o.m_ms_muid,function(obj2){
						if(obj2 && obj2.good){
							var djlNum = 0;
							var djl_url = "http://"+hs_url+"/mxj_weixin/share/countShares";
							var data = JSON.stringify({"relId":obj2.good.m_good_id,"type":share_type_good,"uid":obj2.uid});
							$.ajax({
								type: "POST",
								url: djl_url,
								contentType: "application/json", //必须有
								dataType: "json", //表示返回值类型，不必须
								data:data,
								success: function (obj) {
									djlNum = obj.msg == null ? 0 : obj.msg;
								}
							});

							$("section").append($("<div class='share_box'><div class='share_top' onclick='showgood("+obj2.good.m_good_id+")'><div class='share_img' id='imggood"+o.m_ms_id+"' ></div><div class='share_content'><p>"+obj2.good.m_good_name+obj2.good.m_good_no+"<br>("+obj2.good.m_good_color+")</p><div class='zf'><span class='gift'><a>赠品</a></span><span style='margin-left:10px;'><a>返 积分</a></span></div><p class='price'>￥"+obj2.good.m_good_price+"</p></div></div><div class='share'><img src='../skins/personcenter/img/gdetails_share.png'><span>"+obj2.shareCount+"</span><img src='../skins/personcenter/img/icon_eye.png'><span>"+djlNum+"</span><span class='date'>"+o.m_ms_date.substr(0,10)+"</span></div></div>"));
							var url="../good/down.do?filename="+obj2.good.m_good_pic;
							$("#imggood"+o.m_ms_id).css({"background-image":"url("+url+")"});
						}
					},'json');
				}else if(o.m_ms_type==share_type_store){
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition(function(r){
						var lng1=r.point.lng;
						var lat1=r.point.lat;
					},{enableHighAccuracy: true});
					$.post("../share/shop.do?muid="+o.m_ms_muid,function(obj2){
						if(obj2 && obj2.shop){
							var djlNum = 0;
							var djl_url = "http://"+hs_url+"/mxj_weixin/share/countShares";
							var data = JSON.stringify({"relId":obj2.shop.m_shopNo,"type":share_type_store,"uid":uid});
							$.ajax({
								type: "POST",
								url: djl_url,
								contentType: "application/json", //必须有
								dataType: "json", //表示返回值类型，不必须
								data:data,
								success: function (obj) {
									djlNum = obj.msg == null ? 0 : obj.msg;
								}
							});

							$("section").append($("<div class='share_box'><div class='share_top share_store' onclick='showshop("+obj2.shop.m_shopNo+","+o.m_ms_id+")'><div class='share_img' id='imgshop"+o.m_ms_id+"' ></div><div class='share_content'><p>"+obj2.shop.m_shopName+"<span id='juli"+o.m_ms_id+"'><img src='../skins/goodmainline/img/load.gif' width='10%'/>定位中</span></p><div class='star' id='star"+o.m_ms_id+"'></div><div><span class='gift'><a>"+obj2.shop.m_shopType+"</a></span></div><p class='ads'>"+obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr+"</p></div></div><div class='share'><span><img src='../skins/personcenter/img/gdetails_share.png'>"+obj2.shareCount+"</span><span><img src='../skins/personcenter/img/icon_eye.png'>"+djlNum+"</span><span class='date'>"+o.m_ms_date.substr(0,10)+"</span></div></div>"));
							var url="../good/shopdown.do?filename="+obj2.shop.m_shopPic;
							$("#imgshop"+o.m_ms_id).css({"background-image":"url("+url+")"});
							for(var j=1;j<=obj2.shop.m_shopFraction;j++){
								$("#star"+o.m_ms_id).append($("<span class='icon_star'></span>"));
							}
							$("#star"+o.m_ms_id).append($("<span>"+obj2.shop.m_shopFraction+"</span>"));
							searchByStationName(obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr,o.m_ms_id);
						}
					},'json');
				}else if(o.m_ms_type==share_type_info){

					var djlNum = 0;
					var djl_url = "http://"+hs_url+"/mxj_weixin/share/countShares";
					var data = JSON.stringify({"relId":o.m_ms_muid,"type":share_type_info,"uid":uid});
					$.ajax({
						type: "POST",
						url: djl_url,
						contentType: "application/json", //必须有
						dataType: "json", //表示返回值类型，不必须
						data:data,
						success: function (obj) {
							djlNum = obj.msg == null ? 0 : obj.msg;
						}
					});

					$.post("../infos/one.do?id="+o.m_ms_muid+"&type=" + share_type_info,function(obj3){
						if(obj3 && obj3.info){
							$("section").append($("<div class=\"share_box\" onclick=\"showInfo(" + obj3.info.id + ",'" + uid +"')\"><div class='share_top share_pub'><div class='share_img'  id='bgss"+o.m_ms_id+"'><img id='imginfo"+o.m_ms_id+"' width='100%' height='100%'/></div><div class='share_content'><p>"+obj3.info.title+"</p><div class='content'><p>"+obj3.info.description+"</p></div></div></div><div class='share'><span><img alt='' src='../skins/personcenter/img/gdetails_share.png'>"+obj3.count+"</span><span><img alt='' src='../skins/personcenter/img/icon_eye.png'>"+djlNum+"</span><span class='date'>"+o.m_ms_date.substr(0,10)+"</span></div></div>"));
							$("#bgss"+o.m_ms_id).css({"background":"none"});
							$("#imginfo"+o.m_ms_id).attr("src",hs_img_baseurl+obj3.info.image_url);
						}
					},'json');
				}
			});
		}else{
			if(pageNow==1){
				$("section").append($("<img src='../skins/imgs/none.png' style=\"width: 40%;margin-top: 10%;margin-left: 30%;padding-bottom:10%;\">"));
			}
		}
	},'json');
}
//根据坐标获取地址描述
function getMyCity(){
	var myCity = new BMap.LocalCity();
	myCity.get(myFun);
}
function showshop(shopNo,i){
	window.location="../goodml/shop.do?shopNo="+shopNo+"&goodId=0";
}
function showgood(goodsId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodsId;
}
var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;
function getRad(d){
	return d*PI/180.0;
}
function getMyPoint(lng2,lat2,i){
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		var lng1=r.point.lng;
		var lat1=r.point.lat;
		var radLat1 = getRad(lat1);
		var radLat2 = getRad(lat2);

		var a = radLat1 - radLat2;
		var b = getRad(lng1) - getRad(lng2);

		var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
		s = s*EARTH_RADIUS;
		s = Math.round(s*10000)/10000.0/1000;

		$("#juli"+i).html(s.toFixed(2)+"km");//两坐标间的距离
	},{enableHighAccuracy: true});
}
function searchByStationName(keyword,i) {
	var myGeo = new BMap.Geocoder();
	myGeo.getPoint(keyword, function(point){
		if (point) {
			getMyPoint(point.lng,point.lat,i);
		}
	});  //, "重庆"
}
$(function(){
	//获取用户ID
	//备注：该URL本来请求就是我们后台代码，所以把前面得http://去掉了
	$.post("http://" + hs_url + "/mxj/goodml/getUidFromOperator.do",function(obj){
		uid = obj;
	});

	$("section div").remove();
	showMyShares(1);

	//返回页面
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});



	var range = 50;             //距下边界长度/单位px
	var elemt = 500;           //插入元素高度/单位px
	var totalheight = 0;
	var main = $("#content");                     //主体元素
	$(window).scroll(function(){
		var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)

		//console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		//console.log("页面的文档高度 ："+$(document).height());
		//console.log('浏览器的高度：'+$(window).height());

		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		if(($(document).height()-range) <= totalheight) {
			// main.append("<div style='border:1px solid tomato;margin-top:20px;color:#ac"+(num%20)+(num%20)+";height:"+elemt+"' >hello world"+srollPos+"---"+num+"</div>");
			num++;
			if(num <= maxnum){
				showMyShares(num);
			}else{
				num--;
			}
		}
	});

});