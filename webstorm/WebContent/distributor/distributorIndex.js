
//y坐标范围-最大值
var heightArray = [100, 100,100];
//y坐标范围-最小值
var minValueArray = [0,0,0];
//展示的月份
var monthArray = ["7月","8月","9月","10月","11月","12月"];
//激活的手机数量
var activePhoneArray = [0, 0, 0, 0, 0, 0];
//手机获得的积分
var activePhonePointsArray = [0, 0, 0, 0, 0, 0];
//月度排名
var activePhonePointsRankArray = [1, 1, 1, 1, 1, 1];
var realRank = [1, 1, 1, 1, 1, 1];
//数据集合
var dataArray = [activePhoneArray,activePhonePointsArray,activePhonePointsRankArray];
//是否显示data的值
var showLabel = [true,true,false];
//排名的最大值
var maxRank = 0;

//计算当前的年-月
var date = new Date;
var year = date.getFullYear();
var month = date.getMonth()+1;

//企业号ID
var enterpriseId = 0;

var myecharts;
// Step:3 conifg ECharts's path, link to echarts.js from current page.
// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
require.config({
    paths: {
        echarts: '../js'
    }
});

 
// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
require(
    [
        'echarts',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/map'
    ],
    function (p_echarts) { 
		
    	myecharts = p_echarts;
		loadReport();
	}
);

//切换企业
function switchEnterprise(obj){
	var opt = obj.options[obj.selectedIndex]
    //alert("The option you select is:"+opt.text+"("+opt.value+")");
	
	//修改enterpriseId
	enterpriseId = parseInt(opt.value);

	paintChart();
}

//组装下拉列表
function getSelectStr(){
	
	var innnerHtml = "";
    $.ajax({
        async: false,
        url: "../distributor/getEnterPriseList.do",
        type: "post",
        dataType : "json",
        success: function (obj) {
    		if(obj && obj.enterpriseArray){
    			
    			//商务需求：如果没有分组，展示为普通文本
    			if(obj.enterpriseArray.length <=1 ){
    				innnerHtml = "" + obj.enterpriseArray[0].name;
    			}
    			else{
    				var options = "";
        			$.each(obj.enterpriseArray,function(i,item){
        			    //alert(item.id + "--" + item.name );
        			    options += "<option value=\""+ item.id+ "\">"+ item.name + "</option>";
        			  });
        			
        			innnerHtml = "<select id=\"repeatType\" name=\"enterpriseList\" onchange=\"switchEnterprise(this)\" class=\"formSelect\">"
     				   +      options
     				   + "</select>";
    			}
    			
    		}		
    	}
    });
	return innnerHtml;
}

//柱状图颜色
var colorArray = ["#88E0EB","#FFB58D","#FF8787"];

//字体颜色
var fontArray = ["#02B0C5","#FF7124","#FF0000"];

$(function(){
	
	showCurrentYear();
	
	//查询企业号信息
	$.ajax({
	        async: false,
	        url: "../distributor/getUserInfo.do",
	        type: "post",
	        dataType : "json",
	        success: function (obj) {
	    		if(obj && obj.data){
	    			$("#name").html(obj.data.name);
	    			$("#mobile").html(obj.data.mobile);
	    			$("#enterpriseName").html(getSelectStr());//obj.data.enterpriseName);
	    			//$("#activePhonePointsRank").html(obj.pointRank);
	    			enterpriseId = obj.data.enterpriseId;
	    		}
	    		
	    		if(obj && obj.user){
	    			if(obj.user.head_img.substr(0,7)=="http://"){
	    				$("#head_img").attr("src",obj.user.head_img);
	    			}else{
	    				$("#head_img").attr("src","../cashRanking/img.do?imgName="+obj.user.head_img);
	    			}
	    		}
	        }
	});
	
	paintChart();
	
});

function paintChart(){
	//查询经销商积分排名
	loadPointRank();
	
	//查询激活手机
	loadActivePhoneNum();
	
	//加载今年的数据
	loadAnnualDate( year );
}

//查询排名
function loadPointRank(){
	
	$.post("../distributor/getEnterprisePointRank.do?enterpriseId=" + enterpriseId, function(obj){
		if(obj){
			$("#activePhonePointsRank").html(obj.pointRank);
		}
	},'json'); 
}

//查询激活手机
function loadActivePhoneNum(){
	$.post("../distributor/getactivePhoneInfo.do?type=0&enterpriseId=" + enterpriseId, function(obj){
		if(obj && obj.data){
			$("#activePhoneNum").html(obj.data.activePhoneNum);
			$("#activePhonePoints").html(obj.data.activePhonePoints);
		}
	},'json'); 
}

function loadAnnualDate(pYear){
	//查询年度激活手机
	$.post("../distributor/getactivePhoneInfo.do?type=1&year="+pYear+"&enterpriseId=" + enterpriseId,function(obj){
		if(obj && obj.data){
			$("#annualactivePhoneNum").html(obj.data.activePhoneNum);
			$("#annualactivePhonePoints").html(obj.data.activePhonePoints);
			$("#annualactivePhonePointsRnak").html(obj.activePhonePointsRank);
		}
	},'json'); 
	
	//加载月度数据
	$.post("../distributor/getactivePhoneInfo.do?type=2&year="+pYear+"&enterpriseId=" + enterpriseId,function(obj){
		if(obj && obj.data){
 
			heightArray[0] = obj.maxPhoneNum;
			heightArray[1] = obj.maxPhonePoints;
			
			//排名要+1，防止最后一名显示为0 的情况
			maxRank = obj.maxRank+1; 
			heightArray[2] = maxRank; 
			
			monthArray = obj.data.monthArray;
			activePhoneArray = obj.data.activePhoneNum;
			activePhonePointsArray = obj.data.activePhonePoints;
			realRank = obj.data.activePhonePointsRank;
			
			if(realRank){
				for(var i = 0;i < realRank.length;i ++){
					activePhonePointsRankArray[i] = maxRank - realRank[i];
				}
			}
			dataArray= [activePhoneArray,activePhonePointsArray,activePhonePointsRankArray];
			//排名要取反显示
			loadReport();
			//TODO
		}
	},'json'); 
}

//加载图表:月度激活手机和赚的积分
function loadReport(){

	//基于准备好的dom，初始化echarts实例
	var myChart1 = myecharts.init(document.getElementById('main1'));
	var myChart2 = myecharts.init(document.getElementById('main2'));
	//var myChart3 = myecharts.init(document.getElementById('main3'));
	var myChart4 = myecharts.init(document.getElementById('main4'));
	//报表对象
	var chartArray = [myChart1,myChart2];
	
	for(var i = 0;i < chartArray.length;i ++){
    	 // 指定图表的配置项和数据
    	   var option = {
    		    grid: {
    		    	x:20,
    				//y:0,
    				x2:20,
    				//y2:0
    		        borderColor : "#fff",
    		        containLabel: true,
    		        bottom:0,
    		        left:-40,
    		        right:0,
    		    },
    		    xAxis: {
    		        type : 'category',
    		        axisLine : {
    		         	show : false
    		        },
    		        splitLine: {
    		            show : false
    		        },
    		        axisTick : {
    		            show : false
    		        },
    		        data: monthArray
    		    },
    		    yAxis: {
    		        type : 'value',
    		        show : true,
    		        axisLine : {
    		            show : false
    		        },
    		        splitLine :  {
    		            show : false
    		        },
    		        axisTick : {
    		            show : false
    		        },
    		        axisLabel : {
    		            show : false
    		        },
    		        max : heightArray[i],
    		        min : minValueArray[i]
    		    },
    		    series: [{
    		    	name:'Acutal',
    				type:'bar',
    				stack: 'sum',
    				//barCategoryGap: '50%',
    				itemStyle: {
    					normal: {
    						color: colorArray[i],
    						barBorderColor: 'gray',
    						barBorderWidth: 0,
    						barBorderRadius:0,
    						label : {
    							show: true,
    							position: 'top',
    							textStyle: {
    							    color: fontArray[i],
						            fontWeight : 800,
						            fontSize : 15
    							}
    						}
    					}
    				}, 
    		        data: dataArray[i]
    		 	}]
    		
        	};
    	
	    	// 使用刚指定的配置项和数据显示图表。
			chartArray[i].setOption(option);
    	
	    }
	    //绘制排名
	    //showRank(myChart3);
	    showRankchart(myChart4);
}//end chart

function getRealRank(rank){
	
	return maxRank-parseInt(rank)
	
}
function showRankchart(myChart) {
	
	var lineOption = {
	
		grid:{
			x:20,
			//y:40,
			x2:20,
			//y2:0 
		},
		tooltip: {
		   trigger: "item",
		   formatter: function (params, ticket, callback){
			   		showRank = getRealRank( params.value );
			   		return  "第" + showRank +"名";}
		},

		xAxis : [
			{
				type : 'category',
				//show :false,
				axisLine: {
					show : false
				},
				axisTick : {
					show : true
				},
				axisLabel: {
					show : true
				},
				splitLine : {
					show : true,
					lineStyle : {
						color: ['#eeeeee'],
						width: 1,
						type: 'solid'
					}
				},
				splitArea : {
					show : true,
					areaStyle: {
						color: [ 
							'rgba(255,255,255,0.5)',
							'rgba(245,245,245,0.5)'

						]   
					}
				},
				boundaryGap : false,
				data : monthArray
			},
			{
				type : 'category',
				//show :false,
				axisLine: {
					show : false
				},
				axisTick : {
					show : false
				},
				axisLabel: {
					show : true,
					textStyle: {
						color: "#ff8c8c",
						fontWeight : 800,
						fontSize : 15
					}
				},
				splitLine : {
					show : false
				},
				splitArea : {
					show : false
				},
				boundaryGap : false,
	            
	            data : realRank
			}
		],
		yAxis : [
			{
				//show :false,
			    axisLine: {
					show : false
				},
				axisTick : {
					show : false
				},
				axisLabel: {
					show : true
				},
				splitLine : {
					show : true,
					lineStyle : {
						color: ['#eeeeee'],
						width: 1,
						type: 'solid'
					}
				},
				splitArea : {
					show : true,
					areaStyle: {
						color: [ 
							'rgba(255,255,255,0.5)',
							'rgba(245,245,245,0.5)'

						]   
					}
				},
				max : maxRank,
				min : 1,
				type : 'value',
				axisLabel : {
					formatter: function (value){
						//var negtiveRank = getRealRank( value );
						//return  "第" + negtiveRank + "名";
						return "";
					}
				}
			}
		],
		series : [
			{
				name:'积分排名',
				type:'line',
				itemStyle: {
					normal: {
						color: "#ff8c8c"
					}
				}, 
				data:activePhonePointsRankArray
				 
			} 
		]
	};
    myChart.setOption(lineOption);
 
}

/*
 * 		    //grid:{
				//x:0,
				//y:0
				//x2:0,
				//y2:0 
			//},
 */
function showRank(myChart){
	var option = {
		    grid: { 
		    	x:20,
				y:0,
				x2:20,
				//y2:0 
		        borderColor : "#fff",
		        containLabel: true,
		        bottom:0,
		        left:-40,
		        right:0,
		    },
		    xAxis: {
		    	show : true,
		        type : 'category',
		        axisLine : {
		         	show : false
		        },
		        splitLine: {
		            show : false
		        },
		        axisTick : {
		            show : false
		        },
		        data: realRank
		    },
		    yAxis: {
		        type : 'value',
		        show : false,
		        axisLine : {
		            show : false
		        },
		        splitLine :  {
		            show : false
		        },
		        axisTick : {
		            show : false
		        },
		        axisLabel : {
		            show : false
		        },
		        max : 1,
		        min : 0
		    },
		    series: [{
		    	name:'Acutal',
				type:'bar',
				stack: 'sum',
				//barCategoryGap: '50%',
				itemStyle: {
					normal: {
						color: "#ffffff",
						barBorderColor: 'gray',
						barBorderWidth: 0,
						barBorderRadius:0,
						label : {
							show: true,
							position: 'insideTop',
							textStyle: {
								color: fontArray[2],
								fontSize : 15,
								fontWeight : 800
							}
						}
					}
				}, 
				data: realRank
		    }]
		
    	};
	myChart.setOption(option);
}

function showCurrentYear(){
	//年度
	$("#cyear").html(year);
}

//下一年度
function previous(){
	var previousYear = year +1;
	if( previousYear <= date.getFullYear() ){
		year = previousYear;
		
		//更新年份
		showCurrentYear();
		//加载年度/月度数据
		loadAnnualDate(year);
		//重新绘制图表
		loadReport();
	}
	else{
		Message.showNotify("暂无数据!",3000);
	}
}
//前一年度
function next(){
	nextYear = year -1;
	if( nextYear >= 2016){
		year = nextYear;
		
		//更新年份
		showCurrentYear();
		//加载年度/月度数据
		loadAnnualDate(year);
		//重新绘制图表
		loadReport();
	}
	else{
		Message.showNotify("暂无数据!",3000);
	}
}
