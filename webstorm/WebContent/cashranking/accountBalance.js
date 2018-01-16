/*分页*/
var pagesimple = {};
var ptype=1;
$(function() {
	loadData(2, 0);
	/*$("#showDownInfo_message").html("");
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
	$("#frozen").parent().bind('click',function(){
		pagesimple.start = 0;
		pagesimple.rownum = 10;
		loadData(1,0);
	});

	$("#cost").parent().bind('click',function() {
		pagesimple.start = 0;
		pagesimple.rownum = 10;
		loadData(2,0);
	});

	$(window).scroll(function() {
		if(ptype==2){
		var srollPos = $(window).scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)

		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());
	    var range=50;
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		
		if (($(document).height() - range) <= totalheight) {
			if(pagesimple.maxCount>pagesimple.start){
				
				pagesimple.start = pagesimple.start+pagesimple.rownum;
				var data={};
				data.pagesimple=pagesimple;
				loadData(2,1);
			}
			
		}
		}
	});
	
	$("#return").bind('click',function(){
		history.go(-1);
		return false;
	});
	/*二维码弹出*/
	$("#invation").click(function(){
		if(hs_money){
			$('#showScan').css("display","block");
		}else{
			Message.showNotify("没有可提现得余额",3000);
		}
	});
	$('.mask').click(function(){
		$('#showScan').css("display","none");
	});
});


/**
 * type 类型：1冻结，2总支出,
 * pa  是否是分页 0否 1是
 */
function loadData(type, pa) {
	var str = "";
	$.ajax({
				async : false,
				url : "../cashRanking/accountBalanceData.do",
				type : "post",
				dataType : "json",
				data : {
					   "pagesimple.start":pagesimple.start,
					   "pagesimple.rownum":pagesimple.rownum,
					   "pagesimple.maxCount":pagesimple.maxCount
					   },
				success : function(data) {
					// 余额
					$("#balance").empty();
					$("#balance").html(data.userCashRanking.cash);
					// 总支出
					$("#cost").empty();
					$("#cost").html(data.cost_money);
					// 可提现
					$("#cashing").empty();
					//2016.08.04沟通后获取余额字段$("#cashing").html(data.userCashRanking.cashing);
					$("#cashing").html(data.userCashRanking.cash);
					// 冻结
					$("#frozen").empty();
					//2016.08.04沟通后获取余额字段$("#frozen").html(parseFloat((data.userCashRanking.cash-data.userCashRanking.cashing).toFixed(2)));
					$("#frozen").html(data.userCashRanking.cash);

					if (type == 1) {

						$("#cost").parent().removeAttr("class");
						$("#frozen").parent().attr("class", "current");
						var ar = data.cpd.list;
						for ( var i = 0; i < ar.length; i++) {
							str += "<div class=\"list1\">"
									+ "<div class=\"list1_l\">"
									+ "<p>"+ar[i].m_create_name
									
//									+"<br><span>解冻日期:"+ar[i].format_date+"</span><p>"
									+"<br><span>返现日期:"+ar[i].m_create_date+"</span><p>"
									+ "</div>"
									+ "<div class=\"list1_r\">￥"+ar[i].m_cash+"</div>"
									+ "</div>";
						}
						
						ptype=1;
					} else if (type == 2) {

						$("#frozen").parent().removeAttr("class");
						$("#cost").parent().attr("class", "current");
						
                        $.each(data.ced.list,function(i,o){
                        	str += "<div class=\"list1\">"
								+ "<div class=\"list1_l\"><p>";
						if (o.m_type == "1") {
							str += "购买商品";
						} else if (o.m_type == "2") {
							str += "提现";
						}
						str += "<br><span>" + o.format_date
								+ "</span><p></div>"
								+ "<div class=\"list1_r\"><span>-￥"
								+ o.m_cash + "</span></div>"
								+ "</div>";
                        });   
                       
                        pagesimple=data.ced.page;
                        ptype=2;

					}

					if (str == "" && pa !== 1) {
						str += "<div style='color:#868686;text-align:center;font-size:0.9rem;padding:4%;'>暂无数据</div>";
					}

					if (pa !== 1) {
						$("#show").empty();
					}
					$("#show").append(str);

				}
			});

}
