//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*下拉分页模块*/
var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
var pageSize=5;             //每次加载的数据条数
var num = 1;  				//当前页
$(document).ready(function(){  
    var range = 50;             //距下边界长度/单位px  
    var elemt = 500;           //插入元素高度/单位px  
    var totalheight = 0;   
    $(window).scroll(function(){  
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)  
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {  
        	num++;
        	if(num <= maxnum){
        		showAll(num);
        	}else{
        		num--;
        	}
        	
     
        }  
    });  
}); 
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var curUserId = null; 
function delone(id){
	
	Message.showConfirm("确认删除?","确认","取消",function(){
	 	$.post("../shoucang/del.do?id="+id,function(){
			$("#box"+id).remove();
		});
	});
	
}
function showAll(pageNow){
	$.ajaxSetup({  
	    async : false  
	});  
	num=pageNow;
	$.post("../shoucang/showmycollection.do?pageNow="+pageNow+"&pageSize="+pageSize,function(obj){
		if(obj && obj.mm){
			maxnum=obj.pageSum;
			//赋值给变量把用户ID
			curUserId = obj.curUserId;
			$.each(obj.mm,function(i,o){
				if(o.m_mc_type=="good"){
					$.post("../shoucang/good.do?muid="+o.m_mc_muid,function(obj2){
						if(obj2 && obj2.good){
							$("section").append($("<div class='share_box' id='box"+o.m_mc_id+"'><div class='share_top' onclick='showgood("+obj2.good.m_good_id+")'><div class='share_img' id='img"+o.m_mc_id+"' ></div><div class='share_content'><p>"+obj2.good.m_good_name+obj2.good.m_good_no+"<br>("+obj2.good.m_good_color+")</p><div class='zf'><span class='gift'><a>赠品</a></span><span class='fan' style='margin-left:10px;'><a>返积分</a></span></div><p class='price'>￥"+obj2.good.m_good_price+"</p></div></div><div class='share'><span  style='text-align: right;color:red;font-size:13px;' onclick='delone("+o.m_mc_id+")'>删除</span><span class='date'>"+o.m_mc_date.substr(0,10)+"</span></div></div>"));
							var url="../good/down.do?filename="+obj2.good.m_good_pic;
							$("#img"+o.m_mc_id).css({"background-image":"url("+url+")"});
						}
					},'json');
				}else if(o.m_mc_type=="shop"){
					var geolocation = new BMap.Geolocation();    
					geolocation.getCurrentPosition(function(r){ 
						var lng1=r.point.lng;
						var lat1=r.point.lat;        
					},{enableHighAccuracy: true});
					$.post("../shoucang/shop.do?muid="+o.m_mc_muid,function(obj2){
						if(obj2 && obj2.shop){
							$("section").append($("<div class='share_box' id='box"+o.m_mc_id+"'><div class='share_top share_store' onclick='showshop("+obj2.shop.m_shopNo+","+o.m_mc_id+")'><div class='share_img' id='img"+o.m_mc_id+"' ></div><div class='share_content'><p>"+obj2.shop.m_shopName+"<span id='juli"+o.m_mc_id+"'><img src='../skins/goodmainline/img/load.gif' width='10%'/>定位中</span></p><div class='star' id='star"+o.m_mc_id+"'></div><div><span class='gift'><a>"+obj2.shop.m_shopType+"</a></span></div><p class='ads'>"+obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr+"</p></div></div><div class='share'><span  style='text-align: right;color:red;font-size:13px;' onclick='delone("+o.m_mc_id+")'>删除</span><span class='date'>"+o.m_mc_date.substr(0,10)+"</span></div></div>"));
							var url="../good/shopdown.do?filename="+obj2.shop.m_shopPic;
							$("#img"+o.m_mc_id).css({"background-image":"url("+url+")"});
							for(var j=1;j<=obj2.shop.m_shopFraction;j++){
								$("#star"+o.m_mc_id).append($("<span class='icon_star'></span>"));
							}
							$("#star"+o.m_mc_id).append($("<span>"+obj2.shop.m_shopFraction+"</span>"));
							searchByStationName(obj2.shop.m_shopCity+obj2.shop.m_shopTown+obj2.shop.m_shopArea+obj2.shop.m_shopAddr,o.m_mc_id);
						}
					},'json');
				}else if(o.m_mc_type=="game"){
					
				}else if(o.m_mc_type == "share"){
					$.post("../shoucang/shareByList.do?muid="+o.m_mc_muid,function(obj2){
						
						if(obj2 != null && obj2.id != ""){
							$("section").append($("<div class='share_box' id='box"+o.m_mc_id+"'><div class='share_top' onclick='goToPage(\""+curUserId+"\",\""+ obj2.id +"\",\""+ obj2.info_url +"\");'><div class='share_img' id='img"+o.m_mc_id+"' ></div><div class='share_content'><p>"+obj2.title+obj2.description+"<br></p><div class='zf'><span class='gift'></span><span class='fan' style='margin-left:10px;'></span></div><p class='price'></p></div></div><div class='share'><span  style='text-align: right;color:red;font-size:13px;' onclick='delone("+o.m_mc_id+")'>删除</span><span class='date'>"+o.m_mc_date.substr(0,10)+"</span></div></div>"));
							$("#img"+o.m_mc_id).css({"background-image":"url("+ hs_img_baseurl + obj2.image_url +")"});
						}
						
					},'json');
					
				}
			});
		}else{
			if(pageNow==1){
				$("section").append($("<img src='../skins/imgs/none.png' id='nomsg'/style=\"width: 40%;margin-top: 10%;margin-left: 30%;padding-bottom:10%;\">"));
			}
		}
		
	},'json');
}

function goToPage(userId,shareId,nurl){
	window.location.href = "http://"+hs_url+"/mxj_weixin/auth/mpOAuth?redirectUrl=" + 
	encodeURIComponent(share_url + "/secondbkAll.html?fId=" + userId + "&t=i_" + shareId + "&showUrl=" + nurl + "&type=" + share_type_info);
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
	},{enableHighAccuracy: true})
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
	$("section div").remove();
	showAll(1);
});

$(document).ready(function(){
	
	//返回页面
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
});