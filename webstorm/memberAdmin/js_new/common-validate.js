/*判断是否为空*/
function isEmpty(value) {
	return /^\s*$/.test(value);
}

/*判断是否为Email*/
function isEmail(value) {
	return /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test(value);
    //return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}

/*判断是否为手机号码*/
function isPhone(value){
	return /^(1[38][0-9]|14[57]|15[012356789]|17[0678])[0-9]{8}$/.test(value);
}

/*判断是否为固定电话*/
function isTel(value){
    return /(^0\d{2,3}\-\d{7,8}$)/.test(value);
}

/**
 * 判断是否为url
 */
function isURL(value) {
	return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );;
}

/**
 * 判断是否为Date
 */
function isDate(value) {
	
	return !/Invalid|NaN/.test( new Date(value).toString());
}


/*判断是否为数字*/
function isNumber(value) {
	
	return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}

/*判断是否为整形*/
function isDigits(value) {
	
	return /^\d+$/.test(value);
}

/*判断用户名是否正确,只能是字母数字下划线，并且以字母开头(5-16位)*/
function checkUserName(value) {	
	return /^[a-zA-Z]\w{4,15}$/.test(value);
}

//邮政编码校验
function isPostCode(value) {	
	return /^\d{6}$/.test(value);
}

//根据身份证生成生日
function getBirthday(){
	var str=document.getElementById('idCard').value;//身份证编码 
	var birthday=document.getElementById('birthday');
	var len=str.length;//身份证编码长度 
	if (len==18){ 
		birthday.value=str.substr(6,4)+'-'+str.substr(10,2)+'-'+str.substr(12,2); 	
	} 
	if (len==15){ 
		birthday.value="19"+str.substr(6,2)+'-'+str.substr(8,2)+'-'+str.substr(10,2); 	
	} 
}

/*
 *判断字符串中是否包含了特殊字符
 * 返回false--包含
 * 返回true--不包含
*/
function existSpecialstr(str){
	
	var specialpatterns = new Array(':',',', '?', '!', '|', '>','<', '&','\\','\'','"','=','&','@',';','。','，','！','￥','《','》','、','】','【','’','‘','；');
    for(var i=0;i<specialpatterns.length;i++){
    	if(str.indexOf(specialpatterns[i])!=-1)
    		return false;
    }
    return true;
}


// 校验字符串是否为中文
function isChineseChar(value){
    //如果值为空，通过校验
    if (value == "") {
    	return true;
    }
    var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
    return pattern.test(value);
}



/*
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：6位地区编码
 * yymmdd: 出生年(两位年)月日，如：910215
 * xx: 顺序编码，系统产生，无法确定
 * p: 性别，奇数为男，偶数为女
 * 
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：6位地区编码
 * yyyymmdd: 出生年(四位年)月日，如：19910215
 * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 * 
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
 */
function validateIdCard(idCard){
 	//15位和18位身份证号码的正则表达式
	var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

 	//如果通过该验证，说明身份证格式正确，但准确性还需计算
 	if(regIdCard.test(idCard)){
  		if(idCard.length==18){
   			var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
   			var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
   			var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
   			for(var i=0;i<17;i++){
    			idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
  			}

		   	var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
		   	var idCardLast=idCard.substring(17);//得到最后一位身份证号码

   			//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
   			if(idCardMod==2){
    			if(idCardLast=="X"||idCardLast=="x"){
     				//alert("恭喜通过验证啦！");
     				return true
	    		}else{
	     			//alert("身份证号码错误！");
	     			return false;
	    		}
	   		}else{
	    		//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
	    		if(idCardLast==idCardY[idCardMod]){
	     			//alert("恭喜通过验证啦！");
	     			return true;
	    		}else{
	     			//alert("身份证号码错误！");
	     			return false;
	    		}
	   		}
		} 
 	} else {
  		//alert("身份证格式不正确!");
  		return false;
 	}
}