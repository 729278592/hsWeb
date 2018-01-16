function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


function check() {
	var flag = true;
	if (!/^\d{11,11}$/.test($("#phone").val())) {
		$("#phone").val("");
		$("#phone").attr("placeholder","请输入11位手机号码!");
		flag = false;
	} 
	
	if($("#uname").val() == "" || $("#uname").val().length > 5){
		$("#uname").val("");
		$("#uname").attr("placeholder","请填写收货人姓名!");
		flag = false;
	}
	
	if($("#dizhi").val() == ""){
		$("#dizhi").attr("placeholder","请填写收货地址信息!");
		flag = false;
	}
	if($("#city").val() == ""){
		$("#city").attr("placeholder","请填写您的地址!");
		flag = false;
	}
	return flag;
}


$(function(){
	
	$("#goodsId").val(GetQueryString("goodsId"));//赋值
	$("#showDefault").val(GetQueryString("showDefault"));//默认地址是否显示
	var gsn = GetQueryString("gsn");//商品数量
	var gsc = decodeURI(GetQueryString("gsc"));//商品颜色
	var isDef = GetQueryString("showDefault");
	if(isDef == "yes"){
		$("#showHide").show();//显示
	}else{
		$("#showHide").hide();//隐藏
	}
	
	//返回
	$("#backPage").click(function(){
		var goodsId = $("#goodsId").val();
		history.go(-1);
		return false;
		//window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(gsc))+"&goodsNum="+gsn+"&goodsId="+goodsId;
	});
	
	//校验手机号码
	$("#phone").blur(function(){
		check();
	});
	
	//防止重复点击
	var clickFlag = true;
	//确定保存
	$("#enterSave").click(function(){
		if(clickFlag){
			clickFlag = false;
			if(check()){
				//var data = $('#butSubmit').serialize(); //得到form的值
				//得到 data
				var uname = $('#uname').val();
				var phone = $('#phone').val();
				var dizhi = $('#dizhi').val();
				var adefault;
				var showDefault;
				//是否为默认地址
				var _check = $('.defaultIcon').hasClass('selected');
				if(_check){
					adefault=0;
					showDefault=0;
				}else{
					adefault=1;
					showDefault=1;
				}
				var city = $('#city').val().split(' ');
				var proName = city[0];
				var cityName = city[1];
				var countryName;
				if(city[2]==undefined){
					countryName=null;
				}else{
					countryName=city[2];
				}
				var data= {
						"uname": uname,
						"phone": phone,
						"proName": proName,
						"cityName": cityName,
						"countyName": countryName,
						"dizhi": dizhi,
						"adefault": adefault,
						"showDefault": showDefault //是否显示为默认地址
				};
				//console.log(data);
				$.ajax({
					url : '../address/saveAddressInfo.do',
					data : data,
					type : 'POST',
					dataType : 'json',
					success : function(result){
						//alert(JSON.stringify(result));
						if(result.code=='error'){
							console.log('失败');
						}else{
							//var goodsId = $("#goodsId").val();
							//window.location.href = "../account/goToSubmitOrder.do?goodsColor="+encodeURI(encodeURI(gsc))+"&goodsNum="+gsn+"&goodsId="+goodsId;
							$('#alert').removeClass('hide');
							//点击消失
							$(document).on('click','#sureClick',function(){
								$('#alert').addClass('hide');
							});
							//自动消失
							setTimeout(function(){
								$('#alert').addClass('hide');
								history.go(-1);
								return false;
							},1200);
						}
					},
					error: function(err){
						console.log(JSON.stringify(err));
					}
				});
			}else{
				clickFlag = true;
			}
		}
	});
	
	//_init_area();//初始化省份
	//changeCity(0);//初始化城市
	//changeTown(0);//区域
	
});