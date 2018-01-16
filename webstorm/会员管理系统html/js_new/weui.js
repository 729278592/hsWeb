/**
 * 参照weui.js通用功能封装
 */
var weui = function(){

    var showMsg = function(content) {
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

        var tpl =  '<div class="'+options.className+'">'+
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
            duration: 1500,
            callback: $.noop,
            className: ''
        }, options);

        var tpl =   '<div class="dot_dialog hide">'+
                        '<div class="dot_text">'+options.content+'</div>'+
                    '</div>';

        var $toast = $(tpl);
        var $mask = $toast.find('.dot_text');
        $('body').append($toast);

        $toast.fadeIn('normal');
        $mask.fadeIn('normal');
        $mask.css({'marginLeft':-$mask.width()/2});
        setTimeout(function() {

            $toast.fadeOut('normal', function () {
                $toast.remove();
                options.callback();
            });
        }, options.duration);
    };

    var dialog = function(options) {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var btns = '';
        for(var i = 0; i < options.buttons.length; i++){
            btns += '<div href="javascript:;" data-flag="'+options.buttons[i].flag+'" class="btn '+options.buttons[i]["direction"]+' '+options.buttons[i]["type"]+'">'+options.buttons[i]["label"]+'</div>';
        }
        var tpl =   '<div class="alertBox">'+
                        '<div class="cont sure">'+
                            '<div class="title">提示</div>'+
                            '<div class="content">'+options.content+'</div>'+
                            '<div class="btm">'+
                                btns+
                            '</div>'+
                        '</div>'+
                    '</div>';

        var $dialog = $(tpl);
        var $mask = $dialog.find('.cont');

        function hide(){
            $mask.fadeOut('normal');
            $dialog.remove();
        }

        $('body').append($dialog);
        $mask.fadeIn('normal');
        $dialog.fadeIn();

        $dialog.on('click', '.btn', function (evt) {

            var index = $(this).index();
            if(!$(this).data("flag")){
                options.onCancel();
            }else{
                options.onSure();
            }
            hide();
        });
    };

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
                        type: 'cancelBtn',
                        direction:'left',
                        flag:false,
                        onClick: type ? $.noop : no
                    },
                    {
                        label: '确定',
                        type: 'sureBtn',
                        direction:'right',
                        flag:true,
                        onClick: type ? $.noop : yes
                    }]
        }, options);

        dialog(options);
    };
    return {

        showMsg: showMsg,
        toast:toast,
        confirm: confirm,

    }
}();