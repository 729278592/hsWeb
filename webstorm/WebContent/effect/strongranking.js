
var rankingIndex = 0;//名次顺序
var upPull = 1;//上拉
var downPull = 1;//下拉
var pageCount = 0;//总页数
var curUserRanking = 0;//当前用户排名
var maxEffectVal = 0;//影响力最大值
var pageTopVal = 0;//该值为负数
var maxEffectFlag = true;
var clickFlag = 1;//1为未点击名次,2为已点击名次

$(function(){
	
	//初始化
	$.ajax({
		url : '../effect/effectOkami.do',
		type : 'post',
		data : {"pageSize":"6"},
		dataType : 'json',
		async : false,
		success : function(result){
			
			//总页数
			pageCount = result.pageCount;
			
			//当前用户影响力为零,则显示暂无排名
			if(result.myEffectVal == 0){
				$(".number").html("暂无排名");
				$(".number").css({"font-size":"25px"});
			}else{
				$(".number").html(result.curRankingNum);
				curUserRanking = result.curRankingNum;
			}
			
			//影响力展示
			$("#myEffectId").html(result.myEffectVal);
			
			var showPageHtml = unifiedLoadMethod(result);
			
			//第一次获取数据,只是为了要最大影响力值
			maxEffectFlag = false;
			
			$("#thelist").html(showPageHtml);
			
		}
	
	});
	
	
	//直接拉取我得排名数据
	$(".myRanking").click(function(){
		
		//如排名为0则无需请求后台
		if(curUserRanking != 0){
		
			$.ajax({
				url : '../effect/pullRanking.do',
				data : {"curRanking":curUserRanking,"pageSize":"6"},
				type :'post',
				dataType : 'json',
				async : false,
				success : function(result){
					
					//当前页数
					downPull = result.curPageNum;
					upPull = result.curPageNum;
					
					//序号
					rankingIndex = result.rankingIndex;
					
					var showPageHtml = unifiedLoadMethod(result);
					
					$("#thelist").html(showPageHtml);
					
					clickFlag = 2;//已点击名次查看数据赋值为2
					
				}
			});
		
			myScroll.scrollTo(0, pageTopVal);
			
		}
	});
	
	
	$("#backtoTop").click(function(){
		myScroll.scrollTo(0, pageTopVal);
	});
	
	//跳转我得影响力
	$("#goToMyEffect").click(function(){
		window.location.href = "../effect/effect.do";
	});
	
	//判断是否为销售代表
	$("#ifSeller").click(function(){
		$.ajax({
			url : '../effect/ifCurUserSeller.do',
			type : 'POST',
			dataType : 'json',
			success : function(result){
				if(result.code == 'success'){
					window.location.href = "../effect/goToSellerRanking.do";
				}else{
					Message.showNotify("你不是销售代表无法查看!",3000);
				}
			}
		});
	});
	
});

//统一加载数据
function unifiedLoadMethod(result){
	
	var showPageHtml = '';
	
	for(var i = 0;i < result.topSix.length;i ++){
		
		if(i == 0 && maxEffectFlag){
			//得到最大影响力值
			maxEffectVal = result.topSix[i].effect;
		}
		
		//算排行榜影响力百分率
		var showProHtml = '';
		var showbfl = 0;
		
		
		if(maxEffectVal != 0){
			
			showbfl = parseInt((result.topSix[i].effect / maxEffectVal) * 100);
			
		}
		
		//最小宽度(公式：影响力个数 * 7像素 + 勋章宽度14像素+额外13像素)
		var minWidth = (result.topSix[i].effect.toString().length * 7) + 14 + 13;
		
//		showbfl = showbfl < 20 ? 20 : showbfl;
		
		//头像
		var showHeadImgHtml = '';
		if(result.topSix[i].head_img != null && result.topSix[i].head_img != undefined){
			if(result.topSix[i].head_img.indexOf("http://") != -1 || result.topSix[i].head_img.indexOf("https://") != -1){
				showHeadImgHtml = '<img src="'+result.topSix[i].head_img+'">';
			}else{
				showHeadImgHtml = '<img src="../cashRanking/img.do?imgName='+result.topSix[i].head_img+'">';
			}
		}else{
			showHeadImgHtml = '<img src="../skins/firstpage/img/body_default.png">';//默认头像
		}
		
		//截取手机号码
		var showPhoneHtml = '';
		if(result.topSix[i].mobile != null && result.topSix[i].mobile.length == 11){
			//截取手机号码
			var newMobile = result.topSix[i].mobile.substring(0,3) + "****" + result.topSix[i].mobile.substring(7,11);
			showPhoneHtml = '('+newMobile+')';
		}
		
		rankingIndex = rankingIndex + 1;//序号全局
		
		//序号
		var showIndexHtml = '';
		if(rankingIndex == 1){
			showIndexHtml = '<span style="color: #ff3131;">'+rankingIndex+'</span>';
			showProHtml = '<div class="progress" style="width:100%;background: #ff3131;">';
		}else if(rankingIndex  == 2){
			showIndexHtml = '<span style="color: #f39800;">'+rankingIndex+'</span>';
			showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #f39800;min-width:'+minWidth+'px;">';
		}else if(rankingIndex  == 3){
			showIndexHtml = '<span style="color: #15a6ef;">'+rankingIndex+'</span>';
			showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #15a6ef;min-width:'+minWidth+'px;">';
		}else{
			showIndexHtml = '<span style="color: #868686;">'+rankingIndex+'</span>';
			showProHtml = '<div class="progress" style="width:'+showbfl+'%;background: #868686;min-width:'+minWidth+'px;">';
		}
		
		showPageHtml += '<li>' +
							'<ul class="list">' +
								'<li class="grade">' +
									showIndexHtml +
								'</li>' +
								'<li class="photo">' +
									showHeadImgHtml +
									'<div class="vip_box">' +
										'<span>VIP'+result.topSix[i].level+'</span>' +
									'</div>' +
								'</li>' +
								'<li class="content">' +
									'<p>' +
										'<span class="uname">'+result.topSix[i].nickname+'</span><span class="phone">'+showPhoneHtml+'</span>' +
									'</p>' +
										showProHtml +
										'<span class="effectValue">' +
											'<img src="../skins/effect/img/myeffect_icon_white.png" width="14px"><span>'+result.topSix[i].effect+'</span>' +
										'</span>' +
									'</div>' +
								'</li>' +
							'</ul>' +
						'</li>';
		
	}
	
	return showPageHtml;
	
}

// ==================================================获取数据JS=======================================================================
var myScroll,
pullDownEl, pullDownOffset,
pullUpEl, pullUpOffset,
generatedCount = 0;


//加载上下滚动数据
function loadDownUpData(flag,downNum){
	
	var dataList = "";
	if(clickFlag == 1){
		dataList = {"beginRownum":downNum,"pageSize":"6"};
	}else{
		if(flag == 'down'){
			dataList = {"beginRownum":downNum,"pageSize":"6"};
		}else{
			dataList = {"beginRownum":downNum,"pageSize":"6","clickFlag":clickFlag};
		}
	}
	
	$.ajax({
		url : '../effect/pullRanking.do',
		type : 'post',
		dataType : 'json',
		data : dataList,
		async : false,
		success : function(result){
			
			//序号
			rankingIndex = result.rankingIndex;
			
			//调统一得方法获取数据
			var showPageHtml = unifiedLoadMethod(result);
			
			if(flag == "down"){
				downPull = downPull + 1;//页数变化
				$("#thelist").append(showPageHtml);
			}else{
				upPull = upPull - 1;//页数变化
				$(showPageHtml).insertBefore("#thelist>li:first-child");
			}
			
		}
	});
}


/**
* 下拉刷新 （自定义实现此方法）
* myScroll.refresh();		// 数据加载完成后，调用界面更新方法
*/
function pullDownAction () {
	
	if(upPull == 1){
		Message.showNotify("获取数据完毕!",2000);
		myScroll.refresh();
	}else{
		setTimeout(function () {
			
			//页数坐标
			//upPull = upPull - 1;
			loadDownUpData("up",upPull);
			
			myScroll.refresh();
		}, 1000);
	}
}

/**
* 滚动翻页 （自定义实现此方法）
* myScroll.refresh();		// 数据加载完成后，调用界面更新方法
*/
function pullUpAction () {
	if(downPull < pageCount){
		setTimeout(function () {
			
			//页数坐标
			//流程走完在自加1
			//downPull = downPull + 1;
			loadDownUpData("down",downPull);
			
			myScroll.refresh();
		}, 1000);
	}else{
		Message.showNotify("数据获取完毕!",2000);
		myScroll.refresh();
	}
}

/**
* 初始化iScroll控件
*/
function loaded() {
pullDownEl = document.getElementById('pullDown');
pullDownOffset = pullDownEl.offsetHeight;
pullUpEl = document.getElementById('pullUp');	
pullUpOffset = pullUpEl.offsetHeight;

myScroll = new iScroll('wrapper', {
	scrollbarClass: 'myScrollbar', /* 重要样式 */
	useTransition: false, /* 此属性不知用意，本人从true改为false */
	topOffset: pullDownOffset,
	onRefresh: function () {
		if (pullDownEl.className.match('loading')) {
			pullDownEl.className = '';
			pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
		} else if (pullUpEl.className.match('loading')) {
			pullUpEl.className = '';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
		}
	},
	onScrollMove: function () {
		if (this.y > 5 && !pullDownEl.className.match('flip')) {
			pullDownEl.className = 'flip';
			pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
			this.minScrollY = 0;
		} else if (this.y < 5 && pullDownEl.className.match('flip')) {
			pullDownEl.className = '';
			pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			this.minScrollY = -pullDownOffset;
		} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
			pullUpEl.className = 'flip';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
			this.maxScrollY = this.maxScrollY;
		} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
			pullUpEl.className = '';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			this.maxScrollY = pullUpOffset;
		}
	},
	onScrollEnd: function () {
		if (pullDownEl.className.match('flip')) {
			pullDownEl.className = 'loading';
			pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
			pullDownAction();
		} else if (pullUpEl.className.match('flip')) {
			pullUpEl.className = 'loading';
			pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
			pullUpAction();
		}
		
		
		if(pageTopVal == 0){
			pageTopVal = this.y;
		}
		
		if(this.y < -55){
			$("#backtoTop").fadeIn(1500);
		}else{
			$("#backtoTop").fadeOut(1500);
		}
		
	}
});

setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

//初始化绑定iScroll
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', loaded, false); 


















