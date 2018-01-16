function changeStar(num,str){
	$("."+str+"star").attr("src","../skins/personcenter/img/star_white.png");
	for(i=1;i<=num;i++){
		$("#"+str+i).attr("src","../skins/personcenter/img/star_orange.png");
	}
	$("#"+str+"fen").val(num);
}