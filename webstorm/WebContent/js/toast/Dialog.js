//dialog 弹出层  
//使用方法 $(#selector).dialog(option);
/*新增参数：{
	close：boolean/对话框是否有关闭按钮，默认true
	closeFn: 点击关闭按钮事件
	autoClose：boolean/对话框是否自动关闭，默认false，
	autoCloseTime：number/对话框自动关闭的时间，默认1000毫秒，
	autoCloseFn：function/对话框自动关闭后的执行方法，默认空，
	moveable: boolean/框体是否可以移动
}*/
$.fn.dialog = function(options){
	var defaults = {
		width:300,
		height:100,
		css:{},//设置dialog框体的样式
		titleHeight:30,
		mask:true,
		title:"",
		reset:false,
		close:false,//有关闭按钮，默认为无
		closeFn:function(){},//关闭后执行的方法
		autoClose:false,//自动关闭默认为否
		timeout:1000,
		autoCloseFn:function(){},//自动关闭后执行的方法
		moveable:false,//是否可拖动，默认为是
		maskclose : false,//点击遮罩层关闭弹窗，默认为否
		closeOtherDialogs : true,//弹出时是否关闭其他已显示的弹出层
		sticky_bottom : false,//是否置底
		sticky_top:false,//是否置高
		alongshow:false,//为true时一直展示
		aClass:""
	};
	var $this = this;
	var flag = $this.selector?true:false;//判断调用的JQUERY对象是 字符串 还是选择器
	if (typeof (UWP) != "undefined" && UWP != null) {
		var options = $.extend({},defaults,options,{moveable : true});
	} else {
		var options = $.extend({},defaults,options,parent.AppMain.Utils.config.dialog);
	}
	var box ='<div class="dialog '+options.aClass+'" id="popup_dialog"><div class="title theme-bg"><span class="title"></span><span class="close"></span></div><div class="content scroll"></div></div>';
	var $currentDialog;
	clearTimeout($.fn.dialog.timeout);
	open();
	//var $currentDialog = $this.parents(".dialog:first");
	if(options.autoClose){
		$.fn.dialog.timeout = setTimeout(function(){
          	if($currentDialog.is(":visible")){
				$currentDialog.fadeOut(100,function(){
					if($(".dialog:visible").length<=0){
						options.mask?bodyUnMask():false;
					}
				});
			}
          	options.autoCloseFn();
        },options.timeout);
	}
	if(options.moveable){
		addMoveEvent(true);
	} else {
		addMoveEvent(false);
	}
	function open(){
		$this.hide();
		options.mask?bodyMask():false;
		if(flag){
			if($this.parent().parent(".dialog").length==0){
				$this.wrap('<div class="dialog"><div class="content scroll"></div></div>');
				$this.parent().parent().prepend('<div class="title theme-bg"><span class="title"></span><span class="close"></span></div>');
			}
			$currentDialog = $this.parent().parent(".dialog");
		}else{
			if($("#popup_dialog").length==0){
				  $('body').append(box);
			}
			$currentDialog = $("#popup_dialog");
			$currentDialog.children(".content").empty().append($this);
		}
		options.sticky_bottom?$currentDialog.addClass("sticky"):$currentDialog.removeClass("sticky");
		if(!$currentDialog.hasClass("sticky")){
			options.sticky_top?$currentDialog.addClass("sticky"):$currentDialog.removeClass("sticky");
		}
		options.alongshow?$currentDialog.addClass("alongshow"):$currentDialog.removeClass("alongshow");
		var $header_div = $currentDialog.children(".title");
		var $content_div = $currentDialog.children(".content");

		$currentDialog.css({
			'position':'fixed',
			'top':($(window).height()-options.height)/2+'px',
			'left':($(window).width()-options.width)/2+'px',
			width:options.width+'px',
			height:options.height+'px',
			opacity:1
		});
		$currentDialog.css(options.css);
		if(options.title){
			$header_div.children("span.title").html(options.title).show();
			$header_div.attr('header','header');
			$header_div.css({'height' : options.titleHeight + 'px',"border-bottom":"1px solid #ddd"});
		    $content_div.css('height',(options.height-options.titleHeight)+'px');
		}else{
			$header_div.height(0).children("span.title").empty().hide();
			$header_div.removeAttr('header');
			$content_div.css('height',options.height+'px');
		}
		$currentDialog.find('.title span.close').toggle(options.close);
		if(options.maskclose){
			$('#bodyMask').one("click",function(){
				$currentDialog.is(":visible")?closeDialog($currentDialog):"";
				options.closeFn();
			});
		}
		if(options.confirm && $.isFunction(options.confirm)){
			$('<div />',{'class':'btn-row'})
				.append($('<input />',{'class':'btn cancel','type':'button','value':'取消'}))
				.append($('<input />',{'class':'btn commit','type':'button','value':'确定'}))
				.appendTo($content_div);
			$content_div.find('.btn-row .commit').on('click',function(){options.confirm();});
		}
		if(options.buttons){
			var buttonsArr = options.buttons;
			var defaults = {//默认的参数设置
				txt : "",
				cls : "",
				fn : function(){}
			}
			if ($currentDialog.find('.btn-row').length < 1) {
				var str=[];
				for(var i = 0;i< buttonsArr.length;i++){
					buttonsArr[i] = $.extend({},defaults,buttonsArr[i]);
					str.push('<input type="button" class="btn '+buttonsArr[i].cls+'" value="'+buttonsArr[i].txt+'"/>');
				}
				str=str.join('');
				$('<div />',{'class':'btn-row'}).append(str).appendTo($content_div);
				$currentDialog.find('.btn-row .btn').each(function(index){
					$(this).on('click',function(e){
						buttonsArr[index].fn($(e.target));
					});
				});
			} 
		}
		$header_div.children("span.close").off('click').on('click',function(){close();});
		var z_index;
		if(options.closeOtherDialogs){
			$(".dialog").not(".sticky").hide();
			$(".dialog").not(".alongshow").hide();
		} else {
			if($(".dialog:visible").length>=0){
				z_index = 1000;
			}
		}
		if(options.sticky_bottom){
			var z_index = 991;
			if($(".dialog.sticky:visible").length>0){
				z_index = 992;
			}
		}
		if(options.sticky_top){
			var z_index = 1001;
			if($(".dialog.sticky:visible").length>0){
				z_index = 1002;
			}
		}
		if(options.zindex){
            z_index = options.zindex
		}
		$currentDialog.css({"z-index":z_index});
		$currentDialog.stop().show();
		$this.show();
	};
	var close=function(){
		clearTimeout($.fn.dialog.timeout);//清除自动关闭时设置的操作
		$currentDialog.fadeOut(100,function(){
			if($(".dialog:visible").length<=0){
				options.mask?bodyUnMask():false;
			}
			options.closeFn();
		});
	};
	//添加拖动框体事件
	function addMoveEvent(flag){
		if(flag){
			if($("#dialog_move_bg").length<=0){
				$('<div id="dialog_move_bg" class="theme-bg hide"></div>').appendTo("body");
			}
			var finalTop,finalLeft;

			var throttle = function(fn, delay, mustrundelay) {
				var starttime = null;
				var timer = null;
				return function() {
					var context = this,
							args = arguments,
							currenttime = new Date();

					clearTimeout(timer);
					if (!starttime) {
						starttime = currenttime;
					}
					//alert(currenttime - starttime);
					if (currenttime - starttime >= mustrundelay) {
						fn.apply(context, args);
						starttime = currenttime;
					} else {
						timer = setTimeout(function() {
							fn.apply(context, args);
						}, delay);
					}
				}
			};


			$currentDialog.find("div.title[header=header]").css("cursor","move").mousedown(function(){
				var e = window.event;
				if($(e.target).hasClass("close")){return false;}
				var x = e.clientX;
				var y = e.clientY;
				var Top = parseInt($currentDialog.css("top").replace("px",""));
				var Left = parseInt($currentDialog.css("left").replace("px",""));
				var height = $currentDialog.height();
				var width = $currentDialog.width();
				var windowWidth = $(window).width();
				var windowHeight = $(window).height();
				$("#dialog_move_bg").css({"top":Top+"px","left":Left,"width":width,"height":height});
				finalTop = Top;
				finalLeft = Left;
				$(document).mousemove(function(e){
					$("#dialog_move_bg").show();
					var currentX = e.clientX;
					var currentY = e.clientY;
					if (typeof (UWP) != "undefined" && UWP != null) {
						var fn = throttle(function(){
							var finalX = currentX - x;
							var finalY = currentY - y;
							finalTop = Top + finalY;
							finalLeft = Left + finalX;
							if(finalTop<15){//多留15PX的空隙，不让边框和body边界重合
								finalTop = 15;
							}
							if(finalLeft<15){
								finalLeft = 15;
							}
							if(finalTop+height>windowHeight-15){
								finalTop = windowHeight-height-15;
							}
							if(finalLeft+width>windowWidth-15){
								finalLeft = windowWidth-width-15;
							}
							$("#dialog_move_bg").css({"top":finalTop + "px","left":finalLeft + "px"});
						},50,50);
					} else {
						var fn = parent.AppMain.Utils.throttle(function(){
									var finalX = currentX - x;
									var finalY = currentY - y;
									finalTop = Top + finalY;
									finalLeft = Left + finalX;
									if(finalTop<15){//多留15PX的空隙，不让边框和body边界重合
										finalTop = 15;
									}
									if(finalLeft<15){
										finalLeft = 15;
									}
									if(finalTop+height>windowHeight-15){
										finalTop = windowHeight-height-15;
									}
									if(finalLeft+width>windowWidth-15){
										finalLeft = windowWidth-width-15;
									}
									$("#dialog_move_bg").css({"top":finalTop + "px","left":finalLeft + "px"});
								},50,50);
					}
					fn();
				}).mouseup(function(){
					$(document).off("mousemove");
					$(document).off("mouseup");
					$("#dialog_move_bg").hide();
					$currentDialog.css({"top":finalTop + "px","left":finalLeft + "px"});
				});
			});
		} else {
			$currentDialog.find("div.title[header=header]").off("mousedown");
		}
	};
	//body蒙版
	function bodyMask (obj){
		var bodywidth=$(window).width(), bodyheight=$(window).height();
		var trans=false;
		if(obj && obj.transparent==true){
			trans=true;
		}
		if($('#bodyMask').length<=0){
			$('<div>',{
				id:'bodyMask'
			}).css({
				"background":"#000",
				"width":"100%",
				"height":"100%",
				"opacity":trans?0:0.45,
				"cursor":trans?"not-allowed":"default",
				"overflow":'hidden',
				"filter":"alpha(opacity=50)",
				"z-index":990,
				"position":"absolute",
				"top":"0px"
			}).appendTo('body');
		}else{
			$('#bodyMask').show();
		}
	};
	//删除body蒙版
	function bodyUnMask(){
		$('#bodyMask').hide();
		$("#usb-guide-window").html('');
		$("#phone-connect-window-iphone").html('');
	};
	//关闭弹窗
	function closeDialog(obj){
		if(obj && (typeof(obj) == "string"||typeof(obj) == "object")){
			if(typeof(obj) == "string"){
				var selectors = obj.split(",");
				var oDiv;
				for(var i=0;i<selectors.length;i++){
					oDiv = selectors[i];
					$(oDiv).each(function(){
						if($(this).parents(".dialog:first").is(":visible")){
							$(this).parents(".dialog:first").fadeOut(100,function(){
								if($(".dialog:visible").length<=0){
									bodyUnMask();
								}
							});
						}
					});
				}	
			} else {
				var $dialog;
				if($(obj).is(".dialog")){
					$dialog = $(obj);
				} else if ($(obj).parents(".dialog:first").is(":visible")){
					$dialog = $(obj).parents(".dialog:first");
				}
				$dialog.fadeOut(100,function(){
					if($(".dialog:visible").length<=0){
						bodyUnMask();
					}
				});
			}
		}else{
			$(".dialog").not(".sticky").fadeOut(100,function(){
				if($(".dialog:visible").length<=0){
					bodyUnMask();
				}
			});
		}
	};
};


