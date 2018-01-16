var map = new BMap.Map("container");
map.centerAndZoom("中国", 5);
map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
var optss = {offset: new BMap.Size(10, 250)};
//var optsx = {offset: new BMap.Size(10, 100)}  
map.addControl(new BMap.NavigationControl(optss));
//var top_left_control = new BMap.ScaleControl(optsx);// 左上角，添加比例尺
//map.addControl(top_left_control);
//map.addControl(new BMap.NavigationControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));  //添加默认缩放平移控件
//map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
//map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
var localSearch = new BMap.LocalSearch(map);
localSearch.enableAutoViewport(); //允许自动调节窗体大小
var shopNo;
var goodId;
var lng1;
var lat1;
var cityName;
var maps={};
var arrays=new Array();
var index=0;
var maps2={};
var fenshu;
var dataSum=0;
var shopp=0;
var isShow =false; //用于判断信息框弹出是否显示  百度自带 isOpen()会在还未打开的时候执行所以不好用于判断
function showgood(goodId){
	window.location="../goodml/goToGoodsDetails.do?goodsId="+goodId;
}
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function mypoint(){
	var geolocation = new BMap.Geolocation();  
	geolocation.getCurrentPosition(function(r){ 
		lng1=r.point.lng;
		lat1=r.point.lat;
		$.post("../baidu/city.do?lng="+lng1+"&lat="+lat1,function(obj){
			cityName=obj.city;
		},'json');
	});
}
function showmyplace(){
	var point2=new BMap.Point(lng1, lat1);
	map.centerAndZoom(point2, 12);
	var myIcon = new BMap.Icon("../skins/imgs/me.png", new BMap.Size(22, 29), {imageOffset: new BMap.Size(0, 0)});
	var marker= new BMap.Marker(point2,{icon: myIcon});
   	map.addOverlay(marker);
}
function toShopPage(shopNo){
	var gid;
	if(goodId==null){
		gid="0";
	}else{
		gid=goodId;
	}
	window.location="../goodml/shop.do?shopNo="+shopNo+"&goodId="+gid;
}
function tonext(){
	$.ajaxSetup({  
	    async : false  
	}); 
	if(lng1==null || lat1==null || cityName==null){
		setTimeout("tonext()", 1000);
	}else{
		showmyplace();
			
	}
}
function bianhao(){
	if(dataSum==0 || arrays.length==0 || arrays.length<dataSum){
		setTimeout("bianhao()", 200);
	}else{
		arrays.sort(function(a,b){
			return a-b;
		});
		for(k=0;k<arrays.length;k++){
			var shopnum0=maps2[arrays[k]+""];
			var marker0=maps[shopnum0+""];
			var opts = {offset: new BMap.Size(3, 4)}; // 设置文本偏移量
			var s=k+1;
			if(s<10){
				s="0"+s;
			}
	 	    var label = new BMap.Label(s, opts); // 创建文本标注对象
		 	  label.setStyle({
		 	  color : "white",
		 	  fontSize : "0.6rem",
		 	  height : "0.7rem",
		 	  width:"0.8rem",
		 	  fontFamily:"微软雅黑",
		 	  backgroundColor:"#F83C43",
		      border:"0"	      
	 	  });
		 	marker0.setLabel(label);
		}
		var shopnum=maps2[arrays[0]+""];
		var marker=maps[shopnum+""];
		showtan(shopnum,marker,0);
	}
	
}
function huidiao(){
	$("img").each(function(){
		   if($(this).attr("src")=="http://api0.map.bdimg.com/images/iw_close1d3.gif"){
			   $(this).hide();
		   }
	});
	setTimeout("huidiao()", 100);
}
$(function(){
	$.ajaxSetup({  
	    async : false  
	}); 
	mypoint();
	tonext();
	/*$("#goodlist .swiper-slide").remove();*/
	shopNo=GetQueryString("shopNo");
	goodId=GetQueryString("gd");
	if(goodId!=null){
		$.post("../good/good.do?goodId="+goodId,function(objj){
			if(objj){
				$('.activity').css("padding-bottom","1em");
				$("#goodlist").append($("<div class='swiper-slide' onclick='showgood("+objj.good.m_good_id+")'><div class='good'><div class='goodleft'><div class='gamename' id='gamename_one' style='margin-top:-2%;'></div><div class='lefttime' style='margin-top:-2%;' id='left'><div class='hour' id='h'>00</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='minute' id='m'>31</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='seconds' id='s'>45</div></div><div class='goodmsg'><span class='xinghao'><strong>"+objj.good.m_good_no_short+"</strong></span><br/><span class='goodname' style='font-size:1em;'>"+objj.good.m_good_name_short+"</span><br/><span class='gooddes' style='font-size:0.8em;'>"+objj.good.m_good_des+"</span><br/><span class='goodprice' style='font-size:1em;'>￥"+objj.good.m_good_price+"</span><br/></div></div><div class='goodright'><img src='../good/down.do?filename="+objj.good.m_good_pic+"' class='goodimg' style='margin-top:-2%;'/></div></div></div>"));
				$.post("../game/name.do?gameNo="+objj.good.m_good_gameNo,function(objj2){
					if(objj2.name){
						$("#gamename_one").html(objj2.name);
						var d1=new Date().getTime();
						var d2=new Date(objj2.enddate).getTime();
						var lefttime=d2-d1;
						$("#left").hide();
					}
					else
					{
						$("#gamename_one").html(objj.good.m_good_label);
					}
				},'json');
			}
			
		},'json');
		var activity = new Swiper('.activity',{scrollbar:'.swiper-scrollbar' ,scrollbarHide:true,slidesPerView: 1.2,centeredSlides: true,paginationClickable: true, spaceBetween: 5});
	}
	if(shopNo!=null && shopNo>0){
		showShop();
	}else{
		loads();
	}
	bianhao();
	huidiao();
});
function showShop(){
	$.ajaxSetup({  
	    async : false  
	}); 
	if(shopNo!=null){
		$.post("../shop/oneshop.do?shopNo="+shopNo,function(obj){
			if(obj && obj.shop){
				dataSum=1;
				var point=new BMap.Point(obj.shop.m_shopLng, obj.shop.m_shopLat);
				juli(point,obj.shop.m_shopNo);
			}
			
		},'json');
	}
}
function loads(){
	if(shopNo==null){
		getMyCity();
	}
}
function tosellerpage(id){
	if(id!=0){
		window.location="../seller/sellerinfo.do?sd="+id;
	}
	
}
function showtan(shopnum,th,act){
	$.ajaxSetup({  
	    async : false  
	}); 
	if(shopp!=0){
		var myIcon0 = new BMap.Icon("../skins/imgs/redmap.png", new BMap.Size(22, 33), {imageOffset: new BMap.Size(0, 0)});
		var markerx=maps[shopp+""];
		markerx.setIcon(myIcon0);
		var labelx=markerx.getLabel();
		labelx.setStyle({
			backgroundColor:"#F83C43"
		});
	}
	var label=th.getLabel();
	label.setStyle({
		color : "white",
	 	  fontSize : "0.6rem",
	 	  height : "0.7rem",
	 	  width:"0.8rem",
	 	  fontFamily:"微软雅黑",
	 	  backgroundColor:"#318CE8",
	      border:"0"	  
	});
	var myIcon = new BMap.Icon("../skins/imgs/bluemap.png", new BMap.Size(22, 33), {imageOffset: new BMap.Size(0, 0)});
	th.setIcon(myIcon);
	var point=th.getPosition();
	var point2=new BMap.Point(lng1, lat1);
	var opts={
			width:228,
			height:112
	
	};
    s=(map.getDistance(point,point2)/1000).toFixed(2);
 	   $.post("../shop/oneshop.do?shopNo="+shopnum,function(obj){
			if(obj && obj.shop){
				dataSum=1;
				var	contents;
				var last = 0;
				var tempC=0;
				var tempA=1;
				for(var i =0;i<obj.shop.m_shopName.length;i++)
				{
					//当字符是汉字的时候就累计
					if(obj.shop.m_shopName.charCodeAt(i)>255){
						if(last<28){
							tempC +=1;
						}
						last += 2;
					}else{
						if(last<28){
							tempA +=1;
						}
						last +=1;
					}
				}
				if(tempC>14){
					obj.shop.m_shopName = obj.shop.m_shopName.substring(0,14)+"...";
				}else if(tempA>28){
					obj.shop.m_shopName = obj.shop.m_shopName.substring(0,28)+"...";
				}else if((tempC*2+tempA)>28){
					obj.shop.m_shopName = obj.shop.m_shopName.substring(0,28-tempC)+"...";
				}
				
				if(obj.seller){
					var sellerName = '';
					
					if(obj.seller.m_seller_name != null && obj.seller.m_seller_name != undefined){
						if(obj.seller.m_seller_name.length > 4){
							sellerName = obj.seller.m_seller_name.substring(0,4)+"...";
						}else{
							sellerName = obj.seller.m_seller_name;
						}
					}else{
						sellerName = obj.seller.m_seller_name;
					}
					
					if(obj.seller.m_seller_pic!=null){
						contents="<div class='alertdiv'><span class='leftdiv'><img class='leftimg' src='../seller/down.do?filename="+obj.seller.m_seller_pic+"' onclick='tosellerpage("+obj.seller.m_seller_id+")'/><br><span>"+sellerName+"</span></span><span class='rightdiv'><span class='stroename'>"+obj.shop.m_shopName+"</span><br/><span id='showstar"+shopnum+"'>";	
					}else{
						contents="<div class='alertdiv'><span class='leftdiv'><img class='leftimg' src='../skins/firstpage/img/body_default.png' onclick='tosellerpage("+obj.seller.m_seller_id+")'/><br><span>"+sellerName+"</span></span><span class='rightdiv'><span class='stroename'>"+obj.shop.m_shopName+"</span><br/><span id='showstar"+shopnum+"'>";	
					}
				}else{
					contents="<div class='alertdiv'><span class='leftdiv'><img class='leftimg' src='../skins/firstpage/img/body_default.png' onclick='tosellerpage(0)'/></span><span class='rightdiv'><span class='stroename'>"+obj.shop.m_shopName+"</span><br/><span id='showstar"+shopnum+"'>";	
				}
				
				fenshu=obj.shop.m_shopFraction;
		 	    for(var k=1;k<=fenshu;k++){
		 	    	contents +="<img src='../skins/goodmainline/img/wujiaoxing.png' class='star'/>";
		 	    }
				contents +="</span><br/><span class='bon' onclick='toShopPage("+shopnum+")'>到店试玩</span><br/><span class='range'>距您<span>"+s+"</span>公里</span></span><br/><br/><span class='gotoimg'></span></div>";
				
				var infoWindow = new BMap.InfoWindow(contents,opts);
				th.openInfoWindow(infoWindow);
				isShow = true;
			}
			
		},'json');
 	   if(goodId==null){
 		   if(act==1){
 			  $("#goodlist .swiper-slide").remove();
 	 		  $.post("../shop/shopgoods.do?shopNo="+shopnum,function(obj2){
 	 				if(obj2 && obj2.shopgoods){
 	 					$.each(obj2.shopgoods,function(i,o){
 	 						$('.activity').css("padding-bottom","1em");
 	 						$("#goodlist").append($("<div class='swiper-slide' onclick='showgood("+o.m_good_id+")'><div class='good'><div class='goodleft'><div class='gamename' id='gamename"+i+"' style='margin-top:-2%;'></div><div class='lefttime' style='margin-top:-2%;' id='left"+i+"'><div class='hour' id='h"+i+"'>00</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='minute' id='m"+i+"'>31</div><div class='ff' style='background-color: white;color:black;'>:</div><div class='seconds' id='s"+i+"'>45</div></div><div class='goodmsg'><span class='xinghao'><strong>"+o.m_good_no+"</strong></span><br/><span class='goodname' style='font-size:1em;'>"+o.m_good_name+"</span><br/><span class='gooddes' style='font-size:0.8em;'>"+o.m_good_des+"</span><br/><span class='goodprice' style='font-size:1em;'>￥"+o.m_good_price+"</span><br/></div></div><div class='goodright'><img src='../good/down.do?filename="+o.m_good_pic+"' class='goodimg' style='margin-top:-2%;'/></div></div></div>"));
 	 						$.post("../game/name.do?gameNo="+o.m_good_gameNo,function(obj){
 	 							if(obj.name){
 	 								$("#gamename"+i).html(obj.name);
 	 								var d1=new Date().getTime();
 	 								var d2=new Date(obj.enddate).getTime();
 	 								var lefttime=d2-d1;
 	 								$("#left"+i).hide();
 	 							}
 	 							
 	 						},'json');
 	 					});
 	 					var activity = new Swiper('.activity',{scrollbar:'.swiper-scrollbar' ,scrollbarHide:true,slidesPerView: 1.2,centeredSlides: true,paginationClickable: true, spaceBetween: 5});
 	 				}else{
 	 					$("#goodlist").append($("<div class='swiper-slide' >该门店暂无上架商品</div>"));
 	 				}
 	 			},'json');
 		   }
 		 
 	   }	
 	   shopp=shopnum;
}
function juli(point,shopnum){
	var myGeo = new BMap.Geocoder();   	 	    	  
  	 if (point) { 
  		var myIcon = new BMap.Icon("../skins/imgs/redmap.png", new BMap.Size(22, 33), {imageOffset: new BMap.Size(0, 0)});
  		var marker = new BMap.Marker(point, {icon: myIcon});
  		marker.setTitle(shopnum);
 	   	map.addOverlay(marker);
 	    var point2=new BMap.Point(lng1, lat1);
 	    s=(map.getDistance(point,point2)/1000).toFixed(2);
 	    arrays[index]=s;
 	    maps2[s+""]=shopnum;
 	    maps[shopnum+""]=marker;
 	    index++;
 	  	marker.addEventListener("click", function (){
 	  		 showtan(shopnum,this,1);
 	  	 });
   }
}

function showShops(){
	
	$.ajaxSetup({  
	    async : false  
	}); 
	if(shopNo==null){
		cityName=encodeURI(encodeURI(cityName));
		var url="../shop/cityshops.do?city="+cityName;
		if(goodId!=null){
			url+="&goodId="+goodId;
		}
		$.post(url,function(obj){
			if(obj && obj.shoplist){
				dataSum=obj.shoplist.length;
				$.each(obj.shoplist,function(i,o){
					var point=new BMap.Point(o.m_shopLng, o.m_shopLat);
					juli(point,o.m_shopNo);
				});
			}else{
				Message.showNotify("本商品在您所在的城市暂不销售",3000);
			}
		},'json');
	}
}
//根据坐标获取地址描述
function getMyCity(){
	if(cityName==null || lng1==null || lat1==null){
		setTimeout("getMyCity()", 500);
	}else{
		showShops();
	}
}
//为地图添加点击事件
map.addEventListener("click", function(){  
	$(".menu-list").hide();
	if(!isShow){
      map.closeInfoWindow();
      isShow=false;
	}
});
map.addEventListener("touchstart",function(){
	 $(".menu-list").hide();
});
