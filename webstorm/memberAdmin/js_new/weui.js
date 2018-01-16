/**
 * 参照weui.js通用功能封装
 */
var weui = function(){
    /**
     * dialog，弹窗，alert和confirm的父类
     *
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.content 弹窗的内容
     * @param {string=} options.className 弹窗的自定义类名
     * @param {array=} options.buttons 按钮配置项
     *
     * @param {string} [options.buttons[].label=确定] 按钮的文字
     * @param {string} [options.buttons[].type=primary] 按钮的类型 [primary, default]
     * @param {function} [options.buttons[].onClick=$.noop] 按钮的回调
     *
     * @example
     * weui.dialog({
	 *     title: 'dialog标题',
	 *     content: 'dialog内容',
	 *     className: 'custom-classname',
	 *     buttons: [{
	 *         label: '取消',
	 *         type: 'default',
	 *         onClick: function () { alert('取消') }
	 *     }, {
	 *         label: '确定',
	 *         type: 'primary',
	 *         onClick: function () { alert('确定') }
	 *     }]
	 * });
     */
    var dialog = function(options) {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if($('.weui_dialog_ext').length > 0) {
            $('.weui_dialog_ext').remove();
        }

        options = $.extend({
            title: '',
            content: '',
            className: 'weui_dialog_ext',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: $.noop
            }]
        }, options);

        var btns = '';
        for(var i = 0; i < options.buttons.length; i++){
            btns += '<a href="javascript:;" data-flag="'+options.buttons[i].flag+'" class="weui_dialog_btn '+options.buttons[i]["type"]+'">'+options.buttons[i]["label"]+'</a>';
        }
        var tpl =   '<div class="'+options.className+'">'+
            '<div class="weui_mask"></div>'+
            '<div class="weui_dialog style">'+
            '<div class="weui_dialog_hd"><strong class="weui_dialog_title">'+options.title+'</strong></div>'+
            '<div class="weui_dialog_bd" style="color: #333">'+options.content+'</div>'+
            '<div class="weui_dialog_ft">'+
            btns +
            '</div>'+
            '</div>'+
            '</div>';

        var $dialogWrap = $(tpl);
        var $dialog = $dialogWrap.find('.weui_dialog');
        var $mask = $dialogWrap.find('.weui_mask');

        function hide(callback){
            $mask.fadeOut('normal');
            $dialog.fadeOut('normal',function(){
                $dialogWrap.remove();
                callback();
            })
        }

        $('body').append($dialogWrap);
        $mask.fadeIn('normal');
        $dialog.fadeIn('normal');

        $dialogWrap.on('click', '.weui_dialog_btn', function (evt) {

            var index = $(this).index();
            if($(this).data("flag")){

            }
            hide(function(){
                options.buttons[index].onClick && options.buttons[index].onClick.call(this, evt);
            });
        });
    };


    var CashBox = function(options) {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if($('.weui_dialog_ext').length > 0) {
            $('.weui_dialog_ext').remove();
        }

        options = $.extend({
            className: 'weui_dialog_ext'
        }, options);
        var btns = '';
        for(var i = 0; i < options.buttons.length; i++){
            btns += '<a href="javascript:;" class="weui_dialog_btn '+options.buttons[i]["type"]+'">'+options.buttons[i]["label"]+'</a>';
        }
        var tpl =   '<div class="'+options.className+'">'+
            '<div class="weui_mask"></div>'+
            '<div class="weui_dialog">'+
            '<div class="weui_dialog_hd" style="color: #333">'+options.content+'</div>'+
            '<div class="weui_dialog_bd">' +
            options.html+
            '</div>'+
            '<div class="weui_dialog_ft">'+
            btns +
            '</div>'+
            '</div>'+
            '</div>';

        var $dialogWrap = $(tpl);
        console.log($dialogWrap.html())
        var $dialog = $dialogWrap.find('.weui_dialog');
        var $mask = $dialogWrap.find('.weui_mask');

        function hide(callback){
            $mask.fadeOut('normal');
            $dialog.fadeOut('normal',function(){
                $dialogWrap.remove();
                callback();
            })
        }

        $('body').append($dialogWrap);
        $mask.fadeIn('normal');
        $dialog.fadeIn('normal');

        $dialogWrap.on('click', '.weui_dialog_btn', function (evt) {
            var index = $(this).index();
            hide(function(){
                options.buttons[index].onClick && options.buttons[index].onClick.call(this, evt);
            });
        });
    };


    /**
     * alert 警告弹框，功能类似于浏览器自带的 alert 弹框，用于提醒、警告用户简单扼要的信息，只有一个“确认”按钮，点击“确认”按钮后关闭弹框。
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * weui.alert('普通的alert');
     * weui.alert('带回调的alert', function(){ console.log('ok') });
     * weui.alert('自定义标题的alert', { title: '自定义标题' });
     * weui.alert('带回调的自定义标题的alert', function(){
	 *    console.log('ok')
	 * }, {
	 *    title: '自定义标题'
	 * });
     * weui.alert('自定义按钮的alert', {
	 *     title: '自定义按钮的alert',
	 *     buttons: [{
	 *         label: 'OK',
	 *         type: 'primary',
	 *         onClick: function(){ console.log('ok') }
	 *     }]
	 * });
     */
    var alert = function(content, yes, options) {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var yes = arguments[1];
        var options = arguments[2];

        var type = typeof yes === 'object';
        if (type) {
            options = yes;
        }

        options = $.extend({
            content: content,
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: type ? $.noop : yes
            }]
        }, options);
        dialog(options);
    };

    /**
     * 确认弹窗
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {function=} no  点击取消按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * weui.confirm('普通的confirm');
     * weui.confirm('自定义标题的confirm', { title: '自定义标题' });
     * weui.confirm('带回调的confirm', function(){ console.log('yes') }, function(){ console.log('no') });
     * weui.confirm('带回调的自定义标题的confirm', function(){ console.log('yes') }, function(){ console.log('no') }, {
	 *     title: '自定义标题'
	 * });
     * weui.confirm('自定义按钮的confirm', {
	 *     title: '自定义按钮的confirm',
	 *     buttons: [{
	 *         label: 'NO',
	 *         type: 'default',
	 *         onClick: function(){ console.log('no') }
	 *     }, {
	 *         label: 'YES',
	 *         type: 'primary',
	 *         onClick: function(){ console.log('yes') }
	 *     }]
	 * });
     */
    var confirm = function(content, yes, no, options) {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var yes = arguments[1];
        var no = arguments[2];
        var options = arguments[3];

        var type = typeof yes === 'object';
        if (type) {
            options = yes;
        }

        options = $.extend({
            content: content,
            buttons: [{
                label: '取消',
                type: 'default',
                flag:false,
                onClick: type ? $.noop : no
            }, {
                label: '确定',
                type: 'primary',
                flag:true,
                onClick: type ? $.noop : yes
            }]
        }, options);

        dialog(options);
    };


    /**
     * 多参数弹框
     */
    var confirmCashBox = function(options) {

        options = $.extend({
            buttons: [{
                label: '取消',
                type: 'default'
            }, {
                label: '确定',
                type: 'primary'
            }]
        }, options);

        CashBox(options);
    };

    /**
     * toast 一般用于操作成功时的提示场景
     * @param {string} content toast的文字
     * @param {Object|function=} options 配置项或回调
     * @param {number=} [options.duration=3000] 多少毫秒后关闭toast
     * @param {function=} options.callback 关闭后的回调
     * @param {string=} options.className 自定义类名
     *
     * @example
     * weui.toast('操作成功', 3000);
     * weui.toast('操作成功', {
	 *     duration: 3000,
	 *     className: 'custom-classname',
	 *     callback: function(){ console.log('close') }
	 * });
     */
    var toast = function(content) {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }
        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            content: content,
            duration: 1000,
            callback: $.noop,
            className: ''
        }, options);

        var tpl = '<div class="'+options.className+'">'+
            '<div class="weui_mask_transparent"></div>'+
            '<div class="weui_toast">'+
            '<img src="../images/smile_icon.png" alt="" id="smile-icon"/>'+
            '<p class="weui_toast_content">'+options.content+'</p>'+
            '</div>'+
            '</div>';

        var $toastWrap = $(tpl);
        var $toast = $toastWrap.find('.weui_toast');
        var $mask = $toastWrap.find('.weui_mask');

        $('body').append($toastWrap);
        $toast.fadeIn('normal');
        $mask.fadeIn('normal');

        setTimeout(function() {
            $mask.fadeOut('normal');
            $toast.fadeOut('normal', function () {
                $toastWrap.remove();
                options.callback();
            });
        }, options.duration);
    };

    /**
     * loading
     * @param {string} content loading的文字
     * @param {object=} options 配置项
     * @param {string=} options.className 自定义类名
     *
     * @example
     * var loading = weui.loading('loading', {
	 *     className: 'custom-classname'
	 * });
     * setTimeout(function () {
	 *     loading.hide();
	 * }, 3000);
     */
    var startLoading = function(content) {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        options = $.extend({
            content: content,
            className: ''
        }, options);

        var tpl = '<div class="weui_loading_toast">'+
            '<div class="weui_mask_transparent"></div>'+
            '<div class="weui_toast">'+
            '<div class="weui_loading">'+
            '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
            '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
            '</div>'+
            '<p class="weui_toast_content">数据加载中</p>'+
            '</div>'+
            '</div>';

        var $loadingWrap = $(tpl);
        var $loading = $loadingWrap.find('.weui_toast');
        var $mask = $loadingWrap.find('.weui_mask');

		/*function hide() {
		 $mask.fadeOut('normal');
		 $loading.fadeOut('normal', function () {
		 $loadingWrap.remove();

		 });
		 }*/
        $('body').append($loadingWrap);
        $loading.fadeIn('normal');
        $mask.fadeIn('normal');

    };

    var stopLoading = function() {
        var $loadingWrap = $('.weui_loading_toast');
        if($loadingWrap) {
            var $loading = $loadingWrap.find('.weui_toast');
            var $mask = $loadingWrap.find('.weui_mask');

            $mask.fadeOut('normal');
            $loading.fadeOut('normal', function () {
                $loadingWrap.remove();
            });
        }
    };

    /**
     * toptips 顶部报错提示
     * @param {string} content 报错的文字
     * @param {number|function|object=} options 多少毫秒后消失|消失后的回调|配置项
     * @param {number=} [options.duration=3000] 多少毫秒后消失
     * @param {function=} options.callback 消失后的回调
     *
     * @example
     * weui.topTips('请填写正确的字段');
     * weui.topTips('请填写正确的字段', 3000);
     * weui.topTips('请填写正确的字段', function(){ console.log('close') });
     * weui.topTips('请填写正确的字段', {
	 *     duration: 3000,
	 *     className: 'custom-classname',
	 *     callback: function(){ console.log('close') }
	 * });
     */
    var topTips = function (content, options) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            content: content,
            duration: 1000,
            callback: $.noop,
            className: ''
        }, options);

        const $topTips = $('<div class="weui_toptips weui_warn '+options.className+'" style="display: block;">'+options.content+'</div>');
        function hide(){
            $topTips.remove();
            options.callback();
        }

        $('body').append($topTips);

        setTimeout(hide, options.duration);

    };

    return {
        alert: alert,
        confirm: confirm,
        confirmCashBox:confirmCashBox,
        showMsg: toast,
        showTips: topTips,
        startLoading: startLoading,
        stopLoading: stopLoading
    }
}();