$(document).ready(function(){
			$('.venobox').venobox({
				numeratio: true,
				border: '20px'
			});
			$('.venoboxvid').venobox({
				bgcolor: '#000'
			});
			$('.venoboxframe').venobox({
				border: '6px'
			});
			$('.venoboxinline').venobox({
				framewidth: '300px',
				frameheight: '250px',
				border: '6px',
				bgcolor: '#f46f00'
			});
			$('.venoboxajax').venobox({
				border: '30px;',
				frameheight: '220px'
			});
		})
		$(function(){
	stepBar.init("stepBar", {
		step : 4,
		change : true,
		animation : true
	});
});