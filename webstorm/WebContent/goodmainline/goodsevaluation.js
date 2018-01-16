function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function(){
	
	var goodsId = GetQueryString("goodsId");//商品主键

	var fration = null;
	var postPic = null;
	var loadId = "list";


	/*下拉分页模块*/
	var maxnum = 0;            //设置加载最多次数  （此处可理解为总页数）
	var pageSize= 2;             //每次加载的数据条数
	var num = 1;  				//当前页

	var counter = 0;
	
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
        	
        	if(num <= maxnum){
        		dynamicLoadData(fration,postPic,loadId);
        		num ++ ;
        	}
        }  
    }); 
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	
    //返回
	$("#backPage").click(function(){
		window.history.go(-1);
		return false;
	});
	
	//返回顶部
	$("#backtoTop").click(function(){
		$('body,html').animate({scrollTop:0},500);  
        return false;
	});
	
	//加载评论总数头部
	$.ajax({
		url : '../goodml/loadPostCount.do',
		data : {"goodsId":goodsId,"type":"good"},
		type : 'POST',
		dataType : 'json',
		async : false,
		success : function(result){
			//显示总数
			var postCountList =  '<ul>';
				postCountList += '<li class="current"><a href="javascript:void(0);">全部<p>'+result[0]+'</p></a></li>' +
								 '<li><a href="javascript:void(0);">好评<p>'+result[1]+'</p></a></li>' +
								 '<li><a href="javascript:void(0);">中评<p>'+result[2]+'</p></a></li>' +
								 '<li><a href="javascript:void(0);">差评<p>'+result[3]+'</p></a></li>' +
								 '<li><a href="javascript:void(0);">有图<p>'+result[4]+'</p></a></li>' +
								 '</ul>' ;
			$(".tab_tittle").html(postCountList);
			
			dynamicLoadData(null,null,"list");//初始化加载全部评论下拉进行加载
			
		}
	});
	
	$ ('.tab-content').children ('div:gt(0)').hide();

    $ ('.tab_tittle ul li').click (function (){
    	$('#'+loadId).html("");
    	counter = 0;
    	
        $(this).addClass('current').siblings('.current').removeClass('current');
        $ ('div .tab-content').children ('div:eq(' + $ (this).index () + ')').show().siblings('div').hide();
        
        //全部评论
        if($(this).index() == 0){
            
            fration = null;
            postPic = null;
            loadId = "list";
            dynamicLoadData(fration,postPic,loadId);//下拉进行加载
        }
        
        //好评
        if($(this).index() == 1){
        
            fration = "4,5";
            postPic = null;
            loadId = "hp";
    		dynamicLoadData(fration,postPic,loadId);//加载
        }
        
        //中评
        if($(this).index() == 2){
            fration = "2,3";
            postPic = null;
            loadId = "zp";
    		dynamicLoadData(fration,postPic,loadId);//只能默认加载一次不是要添加多个加载行出来
        }
        
        //差评
        if($(this).index() == 3){
            fration = "1,0";
            postPic = null;
            loadId = "cp";
    		dynamicLoadData(fration,postPic,loadId);//加载
        }
        
        //有图
        if($(this).index() == 4){
        	counter = 0;
            
            fration = null;
            postPic = "yt";
            loadId = "yt";
    		dynamicLoadData(fration,postPic,loadId);//加载
        }
        
    });
    
    //动态加载每列数据
    function dynamicLoadData(fration,postPic,loadId){
    	
   	       counter = counter + 1;
   	       var pageEnd = pageSize * counter;
   	       var pageStart = pageEnd - pageSize;
   	       
           	$.ajax({
           		url : '../goodml/asyncAppendPost.do',
           		data : {"goodsId":goodsId,"type":"good","postFration":fration,"postPic":postPic,"pageStart":pageStart,"pageSize":pageSize},
           		type : 'POST',
           		dataType : 'json',
           		async : false,
           		success : function(result){
           			
           			maxnum = result.resuotCountNum;
           			
           			var postList = '';
        			for(var i = 0;i < result.postObjs.length;i ++){
        				
        				var stars = '';
        				for(var j = 0;j < parseInt(result.postObjs[i][14]);j ++){
        					stars += '<img src="../skins/personcenter/img/star1orange.png" class="goodstar"/>';
        				}
        				//灰色星星
        				var _am = 5 - parseInt(result.postObjs[i][14]);
        				for(var f =0; f<_am; f++){
        					stars += '<img src="../skins/personcenter/img/gdetails_star_gray.png" class="goodstar"/>';
        				}
        				
        				
        				var postImgHmle = "";//图片集
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
        					postImgHmle += '<li><a class="venobox vbox-item" data-gall="gall1" href="../post/down.do?filename='+result.postObjs[i][9]+'"><img src="../post/smallDown.do?filename='+result.postObjs[i][9]+'"></a></li>';
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
        					src="../user/rankingDown.do?filename="+result.postObjs[i][0];
        				}
        				postList +=	'<div  class="evaluate">' +
        	 	   					'<div class="evaluatelist">' +
        	         	   			   '<div class="list1">' +
        	         	   			   '<div class="number1">' +
        	         	   			   '<div class="profile_images"><img src="'+src+'" class="headimg"></div>' +
        	         	   			   '<div class="uname">' +
        	 		                   '<p>'+result.postObjs[i][1]+'</p>' +
        	 		                   '<span>VIP'+result.postObjs[i][2]+'</span>' +
        	 		                   '</div>' +
        	 		                     '<div class="fenr">' +
        	 		                     stars +
        	 		                     '<input hidden="true" id="goodfen" name="" value="0"/>' +
        	 		                   '</div>' +
        	 		                   '</div>' +
        	 		                   '<div class="number2">' +
        	 		                   '<p>'+result.postObjs[i][3]+'</p>' +
        	 		                   '</div>' +
        	 		                   '<div class="user-picture">' +
        	 		                   '<div class="wrapper"><div class="block">'+  
        	 		                   '<ul class="thumns">' +
        	 		                   postImgHmle +
        	 		                   '</ul>' +
        	 		                   '</div></div></div>' +
        	 		                   '<div class="number3">' +
        	 		                   '<span>颜色：'+result.postObjs[i][4]+'</span>' +
        	 		                   '<span class="date">'+result.postObjs[i][5]+'</span>' +
        	 		                   '</div>' +
        	 		                   '</div>' +
        	 		                   '</div>' +
        	 		                   '</div>' ;				
        			}
        		
        			$('#'+loadId).append(postList);
        			var loadHtml = $("#"+loadId).html();
        			
        			if(postList == '' && loadHtml == ''){
        				$("#showMsg").html('<img src="../skins/imgs/none.png" style="width: 50%;margin-top: 30%;margin-left: 25%;"/>');
        			}else{
        				$("#showMsg").html('');
        			}
	           }
	    });    
    }
});

$(document).ready(function(){	
	$('.venobox').venobox({
		numeratio : true,
		border : '20px'
	});
	$('.venoboxvid').venobox({
		bgcolor : '#000'
	});
	$('.venoboxframe').venobox({
		border : '6px'
	});
	$('.venoboxinline').venobox({
		framewidth : '300px',
		frameheight : '250px',
		border : '6px',
		bgcolor : '#f46f00'
	});
	$('.venoboxajax').venobox({
		border : '30px;',
		frameheight : '220px'
	});
	
});

